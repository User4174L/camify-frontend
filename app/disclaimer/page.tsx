import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '32px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function DisclaimerPage() {
  return (
    <SimplePage
      title="Disclaimer"
      breadcrumb="Disclaimer"
      intro="Wat je van de informatie op deze website mag verwachten, en wat niet."
    >
      <h2 style={{ ...h2, marginTop: 0 }}>Deze website</h2>
      <p style={p}>
        Wij besteden veel zorg aan de inhoud van deze website. Toch kan het voorkomen dat informatie
        onvolledig, verouderd of onjuist is. Aan de inhoud van deze website kun je daarom geen rechten
        ontlenen.
      </p>
      <p style={p}>
        Dat geldt in het bijzonder voor prijzen en voorraad. Beide veranderen doorlopend, en bij
        tweedehands apparatuur gaat het vrijwel altijd om één exemplaar. Blijkt een prijs kennelijk
        onjuist te zijn &mdash; bijvoorbeeld door een type- of systeemfout &mdash; dan zijn wij daar
        niet aan gebonden.
      </p>

      <h2 style={h2}>Productinformatie</h2>
      <p style={p}>
        Wij beschrijven elk toestel zo nauwkeurig mogelijk en fotograferen elk exemplaar apart.
        Specificaties nemen wij over van de fabrikant; voor de juistheid daarvan kunnen wij niet
        instaan. Kleuren op een foto kunnen afwijken van de werkelijkheid, afhankelijk van je scherm.
      </p>

      <h2 style={h2}>Links naar andere websites</h2>
      <p style={p}>
        Op onze website staan links naar websites van derden. Wij hebben geen invloed op de inhoud
        daarvan en zijn daar niet verantwoordelijk voor.
      </p>

      <h2 style={h2}>Auteursrecht</h2>
      <p style={p}>
        Alle inhoud op deze website &mdash; teksten, productfoto&rsquo;s, vormgeving en logo&rsquo;s
        &mdash; is eigendom van Camera-tweedehands.nl B.V. of van onze licentiegevers.
      </p>
      <p style={p}>
        Onze productfoto&rsquo;s maken wij zelf, van elk exemplaar apart. Je mag ze niet overnemen,
        verveelvoudigen of commercieel gebruiken zonder onze voorafgaande schriftelijke toestemming.
      </p>

      <h2 style={h2}>Geautomatiseerd uitlezen</h2>
      <p style={p}>
        Het is niet toegestaan deze website geautomatiseerd uit te lezen, te doorzoeken of te
        kopiëren. Dat geldt voor het gebruik van robots, bots, spiders, scrapers en vergelijkbare
        hulpmiddelen, en voor geautomatiseerde tekst- en dataminingtechnieken.
      </p>
      <p style={p}>
        Dit is uitdrukkelijk bedoeld als voorbehoud van onze rechten in de zin van artikel 4 lid 3 van
        de Europese richtlijn auteursrecht in de digitale eengemaakte markt (EU) 2019/790.
      </p>
      <p style={p}>
        Ongeoorloofd gebruik van gegevens van deze website &mdash; waaronder prijsinformatie,
        voorraadgegevens en onze modeldatabase &mdash; is verboden.
      </p>

      <h2 style={h2}>Beschikbaarheid</h2>
      <p style={p}>
        Wij spannen ons in om deze website beschikbaar te houden, maar kunnen niet garanderen dat hij
        storingsvrij werkt. Wij zijn niet aansprakelijk voor schade door tijdelijke onbereikbaarheid
        of technische storingen.
      </p>

      <h2 style={h2}>Aansprakelijkheid</h2>
      <p style={p}>
        Wij zijn niet aansprakelijk voor schade die voortvloeit uit het gebruik van deze website of
        uit het vertrouwen op de informatie erop, behalve wanneer die schade het gevolg is van opzet
        of bewuste roekeloosheid van onze kant.
      </p>
      <p style={p}>
        Voor bestellingen en overeenkomsten gelden onze{' '}
        <Link href="/terms" style={{ color: 'var(--accent)' }}>algemene voorwaarden</Link>. Wat daarin
        staat, gaat voor op deze disclaimer.
      </p>

      <h2 style={h2}>Vragen</h2>
      <p style={{ ...p, marginBottom: 0 }}>
        Camera-tweedehands.nl B.V. &middot; Kerkstraat 47-Bis, 4191 AA Geldermalsen<br />
        <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> &middot;{' '}
        <a href="mailto:info@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>info@camera-tweedehands.nl</a><br />
        KvK 80564674 &middot; Btw-identificatienummer NL861717971B01
      </p>
    </SimplePage>
  );
}
