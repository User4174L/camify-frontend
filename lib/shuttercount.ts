/**
 * Client-side shuttercount-lezer (geen upload). Leest EXIF/MakerNote uit JPEG en TIFF-gebaseerde RAW
 * (NEF/PEF/DNG/ARW). Ondersteuning per merk:
 *  - Nikon: MakerNote tag 0x00A7 ShutterCount (ongecodeerd) — DSLR + Z.  ✅
 *  - Pentax/Ricoh GR: MakerNote tag 0x005D (XOR met Date/Time)              ✅
 *  - Sony: 0x9050-blok (substitutie-cipher, offset per modelgroep a/b/c/d)     ✅ (a1 II/a7 V/a7R VI alleen mech. sluiter)
 *  - Canon: alleen R5/R6 (0x0AF1) en R6 II/R8/R50 (0x0D29) uit CameraInfo      bèta; overige Canon niet in de foto
 * Referentie: Phil Harvey's ExifTool (Image::ExifTool::Nikon / Pentax / Sony).
 */

export interface ShutterResult {
  make?: string;
  model?: string;
  /** wat voor bestand we herkenden, voor gericht advies */
  fileKind?: 'png' | 'heic' | 'webp' | 'cr3' | 'video' | 'unknown' | 'camera';
  shutterCount?: number;
  mechanicalShutterCount?: number;
  method?: 'nikon-makernote' | 'pentax-makernote' | 'sony-makernote' | 'canon-camerainfo';
  status: 'ok' | 'no-makernote' | 'unsupported-brand' | 'not-found' | 'unreadable';
  message: string;
}

const td = new TextDecoder('latin1');

class Reader {
  constructor(public dv: DataView, public le: boolean, public base = 0) {}
  u8(o: number) { return this.dv.getUint8(o); }
  u16(o: number) { return this.dv.getUint16(o, this.le); }
  u32(o: number) { return this.dv.getUint32(o, this.le); }
  str(o: number, n: number) { return td.decode(new Uint8Array(this.dv.buffer, this.dv.byteOffset + o, n)).replace(/\0+$/, ''); }
}

interface Entry { tag: number; type: number; count: number; valueOffset: number; /* absolute offset of value data */ }
const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8, 13: 4 };

/** Lees een IFD op absolute offset `ifdOff`; waardes-offsets zijn relatief aan `tiffBase`. */
function readIFD(r: Reader, ifdOff: number, tiffBase: number): Entry[] {
  const out: Entry[] = [];
  if (ifdOff + 2 > r.dv.byteLength) return out;
  const n = r.u16(ifdOff);
  for (let i = 0; i < n; i++) {
    const e = ifdOff + 2 + i * 12;
    if (e + 12 > r.dv.byteLength) break;
    const tag = r.u16(e), type = r.u16(e + 2), count = r.u32(e + 4);
    const size = (TYPE_SIZE[type] ?? 1) * count;
    const valueOffset = size <= 4 ? e + 8 : tiffBase + r.u32(e + 8);
    out.push({ tag, type, count, valueOffset });
  }
  return out;
}

function entryNumber(r: Reader, e: Entry): number | undefined {
  if (e.valueOffset + 4 > r.dv.byteLength) return undefined;
  if (e.type === 3) return r.u16(e.valueOffset);
  if (e.type === 4 || e.type === 9 || e.type === 13) return r.u32(e.valueOffset);
  if (e.type === 1 || e.type === 7) return r.u8(e.valueOffset);
  return undefined;
}

/** Vind het TIFF-blok (EXIF) in een JPEG (APP1 "Exif\0\0") of neem het bestand zelf (TIFF/RAW). */
function locateTiff(buf: ArrayBuffer): { dv: DataView; base: number } | null {
  const u8 = new Uint8Array(buf);
  if (u8[0] === 0xff && u8[1] === 0xd8) {
    let p = 2;
    while (p + 4 < u8.length) {
      if (u8[p] !== 0xff) { p++; continue; }
      const marker = u8[p + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { p += 2; continue; }
      const len = (u8[p + 2] << 8) | u8[p + 3];
      if (marker === 0xe1 && u8[p + 4] === 0x45 && u8[p + 5] === 0x78 && u8[p + 6] === 0x69 && u8[p + 7] === 0x66) {
        return { dv: new DataView(buf, p + 10, len - 8), base: 0 };
      }
      if (marker === 0xda) break; // start of scan
      p += 2 + len;
    }
    return null;
  }
  // TIFF-gebaseerd (NEF/PEF/DNG/ARW/TIFF)
  if ((u8[0] === 0x49 && u8[1] === 0x49) || (u8[0] === 0x4d && u8[1] === 0x4d)) return { dv: new DataView(buf, 0), base: 0 };
  return null;
}

export function readShutterCount(buf: ArrayBuffer): ShutterResult {
  const u8h = new Uint8Array(buf, 0, Math.min(16, buf.byteLength));
  const ftyp = td.decode(u8h.subarray(4, 12));
  if (ftyp.startsWith('ftypcrx')) return { status: 'unsupported-brand', make: 'Canon', fileKind: 'cr3', message: 'Dit is een Canon CR3-RAW; die kunnen we (nog) niet lezen. Gebruik een JPEG rechtstreeks van de camera — of kijk bij de Canon-stappen hieronder.' };
  if (ftyp.startsWith('ftypheic') || ftyp.startsWith('ftypheix') || ftyp.startsWith('ftypmif1') || ftyp.startsWith('ftypmsf1')) return { status: 'unreadable', fileKind: 'heic', message: 'Dit is een HEIC/HEIF-bestand (vaak van een telefoon of export). Zet de camera op JPEG of gebruik het originele JPEG/RAW-bestand van de geheugenkaart.' };
  if (ftyp.startsWith('ftypmp4') || ftyp.startsWith('ftypisom') || ftyp.startsWith('ftypqt') || ftyp.startsWith('ftypMSNV') || ftyp.startsWith('ftypavc1')) return { status: 'unreadable', fileKind: 'video', message: 'Dit is een videobestand — video telt niet mee in de shuttercount en bevat de teller ook niet. Gebruik een foto (JPEG of RAW).' };
  if (u8h[0] === 0x89 && u8h[1] === 0x50 && u8h[2] === 0x4e && u8h[3] === 0x47) return { status: 'unreadable', fileKind: 'png', message: 'Dit is een PNG (meestal een schermafbeelding of export) — daar staan geen cameragegevens in. Gebruik het originele JPEG/RAW-bestand van de geheugenkaart.' };
  if (td.decode(u8h.subarray(0, 4)) === 'RIFF' && td.decode(u8h.subarray(8, 12)) === 'WEBP') return { status: 'unreadable', fileKind: 'webp', message: 'Dit is een WebP (meestal opgeslagen vanaf een website of app) — daar staan geen cameragegevens in. Gebruik het originele JPEG/RAW-bestand van de geheugenkaart.' };
  const t = locateTiff(buf);
  if (!t) return { status: 'unreadable', fileKind: 'unknown', message: 'Dit bestand herkennen we niet als camerafoto. Gebruik een JPEG of RAW rechtstreeks van de geheugenkaart.' };
  const { dv } = t;
  const le = dv.getUint8(0) === 0x49;
  const r = new Reader(dv, le);
  if (r.u16(2) !== 42 && r.u16(2) !== 0x4f52 && r.u16(2) !== 0x5352) {
    // 42 = TIFF; 0x4f52/0x5352 = Olympus ORF varianten
  }
  const ifd0Off = r.u32(4);
  const ifd0 = readIFD(r, ifd0Off, 0);
  const res: ShutterResult = { status: 'not-found', message: '' };
  for (const e of ifd0) {
    if (e.tag === 0x010f) res.make = r.str(e.valueOffset, e.count).trim();
    if (e.tag === 0x0110) res.model = r.str(e.valueOffset, e.count).trim();
  }
  const exifPtr = ifd0.find(e => e.tag === 0x8769);
  const dngPriv = ifd0.find(e => e.tag === 0xc634); // DNGPrivateData (Pentax/Ricoh DNG)
  let mn: Entry | undefined;
  if (exifPtr) {
    const exifIfd = readIFD(r, r.u32(exifPtr.valueOffset), 0);
    mn = exifIfd.find(e => e.tag === 0x927c);
  }
  if (!mn && dngPriv) {
    // Ricoh/Pentax DNG: DNGPrivateData = "RICOH\0" wrapper met daarin de "PENTAX \0"-MakerNote — zoek de signature.
    if (r.str(dngPriv.valueOffset, 5) === 'RICOH') {
      mn = { tag: 0x927c, type: 7, count: dngPriv.count - 6, valueOffset: dngPriv.valueOffset + 6 }; // "RICOH\0" strippen → "II"+IFD (PENTAX-layout)
    } else mn = dngPriv;
  }
  if (!mn) return { ...res, status: 'no-makernote', message: 'Geen fabrikantgegevens (MakerNote) in deze foto. Foto’s via WhatsApp/e-mail/bewerking verliezen dit — gebruik het originele bestand.' };

  const make = (res.make ?? '').toUpperCase();
  const mnOff = mn.valueOffset;
  const mnLen = mn.count;

  if (make.startsWith('NIKON')) return nikon(r, mnOff, mnLen, res);
  if (make.startsWith('PENTAX') || make.startsWith('RICOH')) return pentax(r, mnOff, mnLen, res);
  if (make.startsWith('SONY')) return sony(r, mnOff, mnLen, res);
  if (make.startsWith('CANON')) return canon(r, mnOff, mnLen, res);
  if (make.startsWith('FUJI')) return { ...res, status: 'unsupported-brand', message: 'Fujifilm slaat de shuttercount niet in de foto op. X100V/VI: menu SET UP → USER SETTING → SHUTTER COUNT; X-H2/X-H2S/X-T5/X-S20: via de Fujifilm XApp (Equipment).' };
  if (make.startsWith('OLYMPUS') || make.startsWith('OM DIGITAL')) return { ...res, status: 'unsupported-brand', message: 'OM System/Olympus slaat de shuttercount niet in de foto op; kijk in het verborgen servicemenu (zie stappen hieronder).' };
  if (make.startsWith('PANASONIC') || make.startsWith('LEICA')) return { ...res, status: 'unsupported-brand', message: `${res.make} slaat de shuttercount niet in de foto op (Lumix: servicemodus SHTCNT; Leica: alleen via service).` };
  return { ...res, status: 'unsupported-brand', message: `${res.make ?? 'Dit merk'} slaat de shuttercount niet (leesbaar) op in de foto. Geen probleem — wij lezen het uit bij ontvangst.` };
}

/* ── Sony: MakerNote "SONY DSC \0\0\0" (12 bytes) + IFD; offsets relatief aan de EXIF/TIFF-header.
 * Tag 0x9050 = versleuteld blok (substitutie-cipher c = b³ mod 249, ExifTool Sony.pm Decipher).
 * ShutterCount-offset per modelgroep (Sony.pm Tag9050a/b/c/d), waarde & 0x00ffffff. */
const SONY_DECIPHER = (() => {
  const t = new Uint8Array(256);
  const set = new Uint8Array(256);
  for (let i = 0; i < 256; i++) t[i] = i;
  for (let b = 2; b <= 247; b++) { const c = (b * b * b) % 249; if (!set[c]) { t[c] = b; set[c] = 1; } } // c → b (eerste treffer, zoals Perl tr///)
  return t;
})();
function sony(r: Reader, mnOff: number, mnLen: number, res: ShutterResult): ShutterResult {
  void mnLen;
  const model = res.model ?? '';
  const head = r.str(mnOff, 8);
  const ifdOff = head.startsWith('SONY') ? mnOff + 12 : mnOff;
  const entries = readIFD(r, ifdOff, 0);
  const t = entries.find(e => e.tag === 0x9050);
  if (!t) return { ...res, status: 'not-found', message: 'Geen shuttercount-blok (0x9050) in deze Sony-foto (bewerkt/geëxporteerd, of dit model slaat het niet op).' };
  const len = t.count;
  const raw = new Uint8Array(r.dv.buffer, r.dv.byteOffset + t.valueOffset, Math.min(len, r.dv.byteLength - t.valueOffset));
  const d = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) d[i] = SONY_DECIPHER[raw[i]];
  const u32 = (o: number) => (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;

  const isA = !/^(DSC-|Stellar|ILCE-(1|6100|6300|6400|6500|6600|6700|7C|7M3|7M4|7M5|7RM2|7RM3A?|7RM4A?|7RM5|7RM6|7SM2|7SM3|9|9M2)|ILCA-99M2|ILME-(FX2|FX3)|ZV-)/.test(model);
  const isB = /^(ILCE-(6100A?|6300|6400A?|6500|6600|7C|7M3|7RM2|7RM3A?|7RM4A?|7SM2|9|9M2)|ILCA-99M2|ZV-E10)\b/.test(model);
  const isC = /^(ILCE-(1\b|7M4|7RM5|7SM3)|ILME-FX3)/.test(model);
  const isD = /^(ILCE-(6700|7CM2|7CR)|ILME-FX2|ZV-(E1|E10M2))\b/.test(model);
  const isDmech = /^(ILCE-(1M2|7M5|7RM6))/.test(model);
  if (/^ILCE-9M3/.test(model)) return { ...res, status: 'unsupported-brand', message: 'De Sony a9 III heeft een global shutter zonder mechanische sluiter; er is geen shuttercount om te lezen.' };
  if (/^ZV-(E1|E10M2)/.test(model)) return { ...res, status: 'unsupported-brand', message: `Voor de ${model} slaat Sony geen shuttercount op in de foto.` };

  let off = -1; let note = '';
  if (isDmech) {
    if (d.length >= 5 && d[0] === 0 && d[1] === 0 && d[2] === 0 && d[3] === 0 && d[4] === 0) { off = 0x0a; note = 'Telt alleen mechanische sluiteropnamen; foto moet met de mechanische sluiter zijn gemaakt.'; }
    else return { ...res, status: 'not-found', message: `Bij de ${model} is de shuttercount alleen leesbaar uit een foto die met de mechanische sluiter is gemaakt (niet elektronisch/stil). Probeer zo'n foto.` };
  } else if (isD) { off = 0x0a; note = 'Telt mechanische sluiteropnamen (elektronische/stille opnamen tellen niet mee).'; }
  else if (isC || isB) { off = 0x3a; note = 'Telt mechanische sluiteropnamen (stille opnamen tellen niet mee).'; }
  else if (isA) { off = 0x32; note = 'Oudere modellen: bij sommige (o.a. A7R) telt de waarde door tot 65.536 en begint dan opnieuw.'; }
  if (off < 0 || off + 4 > d.length) return { ...res, status: 'not-found', message: `Dit Sony-model (${model}) wordt (nog) niet ondersteund door de check.` };
  const n = u32(off) & 0x00ffffff;
  if (n === 0) return { ...res, status: 'not-found', message: 'Shuttercount-veld gevonden maar leeg (0). Probeer een andere originele foto (met mechanische sluiter).' };
  return { ...res, shutterCount: n, method: 'sony-makernote', status: 'ok', message: `Gelezen uit het versleutelde Sony-blok (ExifTool-methode). ${note}` };
}

/* ── Pentax/Ricoh: MakerNote "AOC\0" + byteorder + IFD op +6, of "PENTAX \0" + byteorder + IFD op +10.
 * 0x005D ShutterCount (4 bytes big-endian) XOR Date(0x0006, 4 bytes) XOR (0xFFFFFFFF − Time(0x0007, 3 bytes + \0)). */
function pentax(r: Reader, mnOff: number, mnLen: number, res: ShutterResult): ShutterResult {
  void mnLen;
  const head = r.str(mnOff, 8);
  let ifdOff: number, base: number, le: boolean;
  if (head.startsWith('AOC')) { le = r.str(mnOff + 4, 2) === 'II'; ifdOff = mnOff + 6; base = 0; }
  else if (head.startsWith('PENTAX')) { le = r.str(mnOff + 8, 2) === 'II'; ifdOff = mnOff + 10; base = mnOff; }
  else if (head.startsWith('II') || head.startsWith('MM')) { le = head.startsWith('II'); ifdOff = mnOff + 2; base = mnOff; }
  else { le = r.le; ifdOff = mnOff; base = 0; }
  const tryBases = base === 0 ? [0, mnOff] : [base, base + 2, 0, mnOff - 6];
  for (const b of tryBases) {
    const rr = new Reader(r.dv, le);
    const entries = readIFD(rr, ifdOff, b);
    const date = entries.find(e => e.tag === 0x0006), time = entries.find(e => e.tag === 0x0007), sc = entries.find(e => e.tag === 0x005d);
    if (!date || !time || !sc) continue;
    if (date.valueOffset + 4 > r.dv.byteLength || time.valueOffset + 3 > r.dv.byteLength || sc.valueOffset + 4 > r.dv.byteLength) continue;
    const be = new Reader(r.dv, false);
    const year = be.u16(date.valueOffset);
    if (year < 1995 || year > 2100) continue; // verkeerde base → onzin-datum
    const dateN = be.u32(date.valueOffset) >>> 0;
    const timeN = ((r.u8(time.valueOffset) << 24) | (r.u8(time.valueOffset + 1) << 16) | (r.u8(time.valueOffset + 2) << 8)) >>> 0;
    const raw = be.u32(sc.valueOffset) >>> 0;
    const n = ((raw ^ dateN ^ ((0xffffffff - timeN) >>> 0)) >>> 0);
    if (n > 5_000_000) continue;
    return { ...res, shutterCount: n, method: 'pentax-makernote', status: 'ok', message: 'Gelezen uit de Pentax MakerNote (ExifTool-methode). Let op: kan door een servicebeurt gereset zijn; live view/video tellen niet mee.' };
  }
  return { ...res, status: 'not-found', message: 'Geen leesbare shuttercount in deze Pentax/Ricoh-foto (bewerkt/geëxporteerd, of ouder model zonder teller).' };
}

/* ── Canon (bèta): CameraInfo (MakerNote tag 0x000D) bevat voor R5/R6 (offset 0x0AF1) en R6 II/R8/R50 (0x0D29) een ShutterCount
 * (mechanisch + elektronisch, ExifTool Canon.pm CameraInfoR6 / CameraInfoR6m2). Overige Canon: niet in de foto. */
function canon(r: Reader, mnOff: number, mnLen: number, res: ShutterResult): ShutterResult {
  void mnLen;
  const model = res.model ?? '';
  const entries = readIFD(r, mnOff, 0);
  const ci = entries.find(e => e.tag === 0x000d);
  let off = -1;
  if (/EOS R5$|EOS R6$/.test(model)) off = 0x0af1;
  else if (/EOS R6m2|EOS R6 Mark II|EOS R8$|EOS R50$/.test(model)) off = 0x0d29;
  if (off < 0 || !ci) {
    if (/EOS R3|EOS R1$|EOS-1D X Mark III/.test(model)) return { ...res, status: 'unsupported-brand', message: `${model}: niet in de foto, wel in het menu — Set-up → Systeemstatus (System status display) → "shutter-release cycles" (afgerond op 1.000).` };
    return { ...res, status: 'unsupported-brand', message: `${model || 'Canon'} slaat de shuttercount niet in de foto op. Uitlezen kan met een USB-programma (bv. ShutterCount-app) — of laat het aan ons: wij lezen het uit bij ontvangst.` };
  }
  if (ci.valueOffset + off + 4 > r.dv.byteLength) return { ...res, status: 'not-found', message: 'CameraInfo-blok te kort; probeer een originele JPEG rechtstreeks van de kaart.' };
  const n = new Reader(r.dv, true).u32(ci.valueOffset + off);
  if (n === 0 || n > 5_000_000) return { ...res, status: 'not-found', message: 'Geen plausibele shuttercount gevonden (bèta-ondersteuning voor dit model).' };
  return { ...res, shutterCount: n, method: 'canon-camerainfo', status: 'ok', message: 'Bèta: gelezen uit het Canon CameraInfo-blok (ExifTool-methode). Telt mechanische én elektronische opnamen samen.' };
}

/* ── Nikon: MakerNote "Nikon\0" + versie(2) + TIFF-header op offset 10; tags relatief aan die header. Tag 0x00A7 = ShutterCount. */
function nikon(r: Reader, mnOff: number, mnLen: number, res: ShutterResult): ShutterResult {
  const head = r.str(mnOff, 6);
  let base: number, ifdOff: number, rr: Reader;
  if (head.startsWith('Nikon')) {
    base = mnOff + 10;
    const le = r.u8(base) === 0x49;
    rr = new Reader(r.dv, le);
    ifdOff = base + rr.u32(base + 4);
  } else {
    // oud formaat: IFD direct in MakerNote, offsets relatief aan TIFF-header
    base = 0; rr = r; ifdOff = mnOff;
  }
  const entries = readIFD(rr, ifdOff, base);
  const sc = entries.find(e => e.tag === 0x00a7);
  const mech = entries.find(e => e.tag === 0x0037); // MechanicalShutterCount (Z-bodies, ongecodeerd)
  void mnLen;
  if (!sc) return { ...res, status: 'not-found', message: 'Geen shuttercount gevonden in deze Nikon-foto (mogelijk bewerkt/geëxporteerd, of een model zonder mechanische sluiter).' };
  const n = entryNumber(rr, sc);
  if (n === undefined || n === 4294965247) return { ...res, status: 'not-found', message: 'Shuttercount-veld aanwezig maar niet beschikbaar voor dit model.' };
  const m = mech ? entryNumber(rr, mech) : undefined;
  const isZ89 = /Z ?[89]\b/.test(res.model ?? '');
  const msg = isZ89
    ? 'De Z8/Z9 hebben geen mechanische sluiter; dit is het aantal (elektronische) opnamen — geen slijtage-indicatie.'
    : m !== undefined ? `Totaal (mechanisch + elektronisch); mechanische sluiteropnamen: ${m.toLocaleString('nl-NL')}.` : 'Gelezen uit de Nikon MakerNote (telt mechanische en elektronische opnamen samen).';
  return { ...res, shutterCount: n, mechanicalShutterCount: m, method: 'nikon-makernote', status: 'ok', message: msg };
}

/* ── Nette merk+modelnaam voor weergave en prefill in de verkoopflow ── */
const SONY_MODEL_MAP: Record<string, string> = {
  'ILCE-1': 'Sony A1', 'ILCE-1M2': 'Sony A1 II', 'ILCE-9': 'Sony A9', 'ILCE-9M2': 'Sony A9 II', 'ILCE-9M3': 'Sony A9 III',
  'ILCE-7M2': 'Sony A7 II', 'ILCE-7M3': 'Sony A7 III', 'ILCE-7M4': 'Sony A7 IV', 'ILCE-7M5': 'Sony A7 V',
  'ILCE-7RM2': 'Sony A7R II', 'ILCE-7RM3': 'Sony A7R III', 'ILCE-7RM3A': 'Sony A7R III', 'ILCE-7RM4': 'Sony A7R IV', 'ILCE-7RM4A': 'Sony A7R IV', 'ILCE-7RM5': 'Sony A7R V',
  'ILCE-7SM2': 'Sony A7S II', 'ILCE-7SM3': 'Sony A7S III',
  'ILCE-7C': 'Sony A7C', 'ILCE-7CM2': 'Sony A7C II', 'ILCE-7CR': 'Sony A7CR',
  'ILCE-6000': 'Sony A6000', 'ILCE-6100': 'Sony A6100', 'ILCE-6300': 'Sony A6300', 'ILCE-6400': 'Sony A6400', 'ILCE-6500': 'Sony A6500', 'ILCE-6600': 'Sony A6600', 'ILCE-6700': 'Sony A6700',
  'ILME-FX3': 'Sony FX3', 'ILME-FX30': 'Sony FX30', 'ZV-E10': 'Sony ZV-E10', 'ZV-E1': 'Sony ZV-E1',
};
export function friendlyCameraName(make?: string, model?: string): string | undefined {
  if (!model) return undefined;
  const mk = (make ?? '').toUpperCase();
  let m = model.trim();
  if (mk.startsWith('SONY')) return SONY_MODEL_MAP[m] ?? `Sony ${m}`;
  if (mk.startsWith('NIKON')) { m = m.replace(/^NIKON\s*/i, '').replace(/^Z\s+(\d)/, 'Z$1'); return `Nikon ${m}`; }
  if (mk.startsWith('CANON')) return m.replace(/^Canon\s*/i, 'Canon ');
  if (mk.startsWith('PENTAX') || mk.startsWith('RICOH')) return m.replace(/^(PENTAX|RICOH)\s*/i, x => x.charAt(0) + x.slice(1).toLowerCase());
  if (mk.startsWith('FUJI')) return m.startsWith('X') || m.startsWith('GFX') ? `Fujifilm ${m}` : m;
  if (mk.startsWith('OM DIGITAL') || mk.startsWith('OLYMPUS')) return m;
  if (mk.startsWith('PANASONIC')) return m.startsWith('DC-') || m.startsWith('DMC-') ? `Panasonic ${m.replace(/^D(C|MC)-/, '')}` : `Panasonic ${m}`;
  if (mk.startsWith('LEICA')) return m.toUpperCase().startsWith('LEICA') ? m : `Leica ${m}`;
  return m;
}
