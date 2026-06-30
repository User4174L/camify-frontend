import SimplePage from '@/components/layout/SimplePage';
import TrustpilotWidget, { TP } from '@/components/ui/TrustpilotWidget';

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
      <div style={{ marginBottom: 8 }}>
        <TrustpilotWidget templateId={TP.microCombo} height="24px" style={{ textAlign: 'left' }} />
      </div>

      {/* Live reviews-grid */}
      <TrustpilotWidget templateId={TP.grid} height="520px" stars="4,5" reviewLanguages="nl" />
    </SimplePage>
  );
}
