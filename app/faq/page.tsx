'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';

const faqData = [
  {
    category: 'Kopen',
    items: [
      { q: 'Hoe plaats ik een bestelling?', a: 'Blader door de shop, voeg items toe aan je winkelwagen en reken af — net als bij elke webshop. Elke productpagina toont de exacte conditie, echte foto’s en (waar van toepassing) de shuttercount, zodat je vooraf precies weet wat je koopt.' },
      { q: 'Welke betaalmethodes accepteren jullie?', a: 'iDEAL, creditcard (Visa, Mastercard, American Express), PayPal, Bancontact en betaling in 3 termijnen via in3, naast diverse internationale methodes. Alle betalingen verlopen beveiligd via onze betaalprovider Pay.nl.' },
      { q: 'Hoe snel wordt mijn bestelling bezorgd?', a: 'Voor 15:00 besteld op werkdagen = dezelfde dag verzonden. Binnen Nederland, België en Duitsland ontvang je je pakket meestal de volgende werkdag; voor de rest van de EU duurt het doorgaans 2–5 werkdagen. Na verzending ontvang je de track & trace per e-mail en kun je je zending ook volgen in je account.' },
      { q: 'Wat kost verzending?', a: 'Nederland & België: gratis vanaf €100, anders €4,95. Duitsland: gratis vanaf €100, anders €6,95. Overig EU (incl. Frankrijk): €14,95. Buiten de EU: €79. Elke bestelling gaat aangetekend en verzekerd de deur uit.' },
      { q: 'Wat betekenen de conditieniveaus?', a: 'We hanteren vijf niveaus, op basis van de uiterlijke staat: Zo goed als nieuw, Zeer goed, Goed, Gebruikt en Zeer gebruikt. Elk item wordt professioneel geïnspecteerd en eerlijk gegradeerd, met echte foto’s van het exacte item. Zie Quality & grading voor de details.' },
      { q: 'Hoe bepalen jullie de shuttercount?', a: 'Waar van toepassing lezen we de shuttercount uit met professionele diagnosetools — uit de EXIF-data of via fabrikant-servicesoftware. De exacte shuttercount staat vermeld op de productpagina.' },
      { q: 'Kan ik de echte foto’s vooraf zien?', a: 'Ja. Elke listing bevat echte foto’s van het exacte item dat je ontvangt, vanuit meerdere hoeken — geen stockbeelden. Wat je ziet, is wat je krijgt.' },
      { q: 'Zijn jullie prijzen inclusief btw? Wat betekent het BTW-label?', a: 'Onze producten zijn standaard margeproducten. Staat er een BTW-label bij, dan is het een btw-product en is de prijs inclusief btw. In beide gevallen is de getoonde prijs altijd de prijs die je betaalt — er komt niets bij. Koop je zakelijk? Bij een margeproduct kun je de btw niet terugvragen, maar bij latere verkoop draag je er ook geen btw over af, dus het verschil is vaak klein. Bij een btw-product vraag je de btw wel gewoon terug. Voor zakelijke kopers binnen de EU verleggen we de btw via een intracommunautaire levering.' },
    ],
  },
  {
    category: 'Verkopen & inruilen',
    items: [
      { q: 'Hoe werkt het inruilen of verkopen?', a: 'Gebruik onze inruiltool voor een directe waarde-indicatie. Akkoord met de prijsopgave? Dan ontvang je een gratis verzendlabel. Stuur je apparatuur op, wij inspecteren en testen alles, en je wordt uitbetaald — of je verrekent het bedrag met een nieuwe aankoop.' },
      { q: 'Hoe bepalen jullie de inruilwaarde?', a: 'Op basis van actuele marktprijzen, de conditie, de vraag en wat vergelijkbare items opbrengen. Omdat we direct aan eindklanten verkopen, zonder tussenpartijen, kunnen we scherp bieden.' },
      { q: 'Hoe lang duurt de keuring?', a: 'Na ontvangst inspecteren en testen onze technici je apparatuur binnen 2 werkdagen — sensor, autofocus, glas, sluiter en cosmetische staat. Je krijgt bericht zodra we klaar zijn.' },
      { q: 'Hoe stuur ik mijn apparatuur op?', a: 'Na akkoord op je prijsopgave ontvang je een gratis verzendlabel. Verpak je gear goed (bij voorkeur de originele doos plus beschermend materiaal), plak het label erop en lever het af bij een PostNL- of DHL-punt. De verzending is volledig verzekerd.' },
      { q: 'Wanneer krijg ik mijn geld?', a: 'Klopt de conditie met je opgave? Dan betalen we doorgaans binnen 2–3 werkdagen na ontvangst uit op je IBAN. Wijkt de conditie af, dan nemen we contact op met een aangepast bod — of we sturen je apparatuur kosteloos terug.' },
    ],
  },
  {
    category: 'Verzending & retour',
    items: [
      { q: 'Wat is jullie retourbeleid?', a: 'Voor online aankopen heb je 14 dagen na ontvangst om te retourneren, zonder opgave van reden. Het product moet compleet en in originele staat zijn. Meld je retour aan en we regelen het samen — zo koop je met een gerust hart.' },
      { q: 'Hoe retourneer ik een product?', a: 'Meld je retour binnen 14 dagen aan via info@camera-tweedehands.nl met je ordernummer, voeg het retourformulier bij en stuur het product compleet retour. Na ontvangst en controle betalen we het orderbedrag doorgaans binnen 3–5 werkdagen terug op je oorspronkelijke betaalmethode.' },
      { q: 'Verzenden jullie internationaal?', a: 'Ja. Binnen de EU verzenden we tegen de geldende tarieven; buiten de EU verzenden we voor €79. Elke zending gaat aangetekend en verzekerd, met track & trace.' },
      { q: 'Hoe zit het met invoerrechten buiten de EU?', a: 'Voor bestellingen buiten de EU worden btw-producten zonder btw verkocht. Eventuele invoerrechten en lokale belastingen zijn voor rekening van de klant en variëren per land.' },
    ],
  },
  {
    category: 'Garantie & support',
    items: [
      { q: 'Welke garantie geven jullie?', a: 'Op tweedehands producten geldt minimaal 12 maanden garantie, op nieuwe producten 24 maanden — tenzij anders vermeld bij het product. Elk item wordt vóór verkoop grondig getest.' },
      { q: 'Wat valt wel en niet onder de garantie?', a: 'Gedekt zijn defecten die bij verkoop niet bekend of zichtbaar waren. Niet gedekt: normale slijtage en gebruikssporen, accu’s onder 30% van de opgegeven capaciteit, flitsbuizen (slijtageonderdeel) en schade door val, vocht of verkeerd gebruik.' },
      { q: 'Hoe meld ik een garantieclaim of reparatie?', a: 'Neem contact op via info@camera-tweedehands.nl met je ordernummer en een omschrijving van het probleem. We besteden reparaties uit aan gespecialiseerde partners; een reparatie duurt doorgaans 4–8 weken en op een uitgevoerde reparatie zit minimaal 6 maanden garantie.' },
      { q: 'Is de garantie overdraagbaar?', a: 'Nee, de garantie kan alleen worden ingeroepen door de oorspronkelijke koper en is niet overdraagbaar; een garantiebewijs is vereist.' },
      { q: 'Hoe bereik ik de klantenservice?', a: 'Per e-mail via klantenservice@camera-tweedehands.nl, telefonisch op 085 301 83 32 (ma–vr 09:00–17:30) of via de live chat op de website. We reageren doorgaans binnen 1 werkdag.' },
    ],
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaq = searchQuery.length > 0
    ? faqData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      })).filter(cat => cat.items.length > 0)
    : faqData;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Help', href: '/help' }, { label: 'FAQ' }]} />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--rl)',
          padding: '52px 40px',
          marginBottom: 48,
          textAlign: 'center',
          color: '#fff',
          background: 'linear-gradient(180deg, rgba(20,21,43,.74), rgba(20,21,43,.84)), url(/images/hero-photographer-1.jpg) center 28%/cover',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .8, marginBottom: 12 }}>Camera-tweedehands.nl Help Center</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 18, position: 'relative' }}>Hoe kunnen we je helpen?</h1>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Zoek een onderwerp of vraag…"
            aria-label="Zoeken in FAQ"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
      </section>

      {filteredFaq.map(cat => (
        <div key={cat.category} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--accent)' }}>{cat.category}</h2>
          <div className="accordion">
            {cat.items.map((item, i) => {
              const key = `${cat.category}-${i}`;
              return (
                <div key={key} className={`accordion__item${openItems[key] ? ' is-open' : ''}`}>
                  <button className="accordion__trigger" aria-expanded={openItems[key]} onClick={() => toggle(key)}>
                    {item.q}
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                  <div className="accordion__body">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredFaq.length === 0 ? (
        <p style={{ fontSize: 15, color: 'var(--text-sec)', margin: '0 0 40px' }}>Geen resultaten gevonden. Probeer een andere zoekterm of <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>neem contact op</Link>.</p>
      ) : null}

      <section style={{ background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 60%, #1E2133 100%)', borderRadius: 'var(--rl)', padding: '40px', textAlign: 'center', marginBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)' }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#fff', position: 'relative' }}>Nog vragen?</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 20, position: 'relative' }}>Ons team helpt je graag verder.</p>
        <Link href="/contact" className="btn btn--primary" style={{ position: 'relative' }}>Neem contact op</Link>
      </section>
    </div>
  );
}
