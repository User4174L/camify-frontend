import SimplePage from '@/components/layout/SimplePage';
import TrustpilotWidget, { TP, TP_TOKEN } from '@/components/ui/TrustpilotWidget';

export default function ReviewsPage() {
  return (
    <SimplePage
      title="Reviews"
      breadcrumb="Reviews"
      eyebrow="Reviews"
      parent={{ label: 'Help', href: '/help' }}
      image="/images/hero-photographer-1.jpg"
      intro="Beoordeeld door duizenden fotografen in heel Europa. Lees hieronder de echte reviews op Trustpilot."
      related={[
        { label: 'How it works', desc: 'Verkopen, inruilen en kopen — stap voor stap.', href: '/how-it-works' },
        { label: 'Quality & grading', desc: 'Hoe we conditie bepalen en testen.', href: '/quality-grading' },
        { label: 'About us', desc: 'Het verhaal achter Camify.', href: '/about' },
      ]}
    >
      {/* Score bovenaan */}
      <div style={{ marginBottom: 18, maxWidth: 300 }}>
        <TrustpilotWidget templateId={TP.microTrustScore} token={TP_TOKEN.microTrustScore} height="20px" />
      </div>

      {/* Live reviews (Carousel — laatste reviews) */}
      <TrustpilotWidget templateId={TP.carousel} token={TP_TOKEN.carousel} height="140px" stars="1,2,3,4,5" reviewLanguages="nl" />
    </SimplePage>
  );
}
