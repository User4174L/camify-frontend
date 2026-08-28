/**
 * Telemetrie voor de shuttercount-check — hybride model (besluit 26-08):
 * - Standaard gaat alléén merk, model, status en bestandstype mee. Nooit bytes,
 *   dus de belofte "je foto verlaat je apparaat niet" blijft intact.
 * - Het metadata-blok (eerste deel van het bestand, géén herleidbaar beeld) gaat
 *   uitsluitend mee nadat de gebruiker daar bij een mislukte uitlezing expliciet
 *   voor kiest via de deel-knop.
 * Telemetrie mag de tool nooit breken: alle fouten worden stil geslikt.
 */

const NTFY_TOPIC = 'https://ntfy.marketintelligencedata.nl/shutter-check-telemetrie-9k2f';

export type TelemetryEvent = {
  status: string;
  make?: string;
  model?: string;
  fileKind?: string;
  count?: number;
};

export function sendTelemetry(ev: TelemetryEvent): void {
  try {
    const ok = ev.status === 'ok';
    const label = [ev.make, ev.model].filter(Boolean).join(' ') || 'onbekend model';
    fetch(NTFY_TOPIC, {
      method: 'POST',
      body: JSON.stringify(ev),
      headers: {
        Title: ok ? `OK · ${label} · ${ev.count ?? ''}` : `MIS (${ev.status}) · ${label}`,
        Tags: ok ? 'white_check_mark,camera' : 'x,camera',
      },
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* nooit de tool laten falen op telemetrie */
  }
}

/** Deelt (na expliciete klik) het eerste stuk van het bestand als bijlage,
 *  zodat wij ontbrekende modellen aan de parser kunnen toevoegen.
 *  256 KB dekt EXIF + MakerNote bij JPEG én de IFD's van RAW-bestanden. */
export async function shareMetadata(file: File, ev: TelemetryEvent): Promise<boolean> {
  try {
    const blob = file.slice(0, 256 * 1024);
    const safeName = (file.name || 'foto').replace(/[^\w.-]+/g, '_').slice(0, 60);
    const label = [ev.make, ev.model].filter(Boolean).join(' ') || 'onbekend model';
    const res = await fetch(`${NTFY_TOPIC}?filename=${encodeURIComponent(`meta_${safeName}.bin`)}`, {
      method: 'PUT',
      body: blob,
      headers: {
        Title: `METADATA · ${label} · ${ev.status}`,
        Tags: 'inbox_tray,camera',
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
