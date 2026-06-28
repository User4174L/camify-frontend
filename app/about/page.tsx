import Breadcrumb from '@/components/layout/Breadcrumb';
import WordReveal from '@/components/ui/WordReveal';

const stats = [
  { num: '2018', label: 'Founded' },
  { num: '€1.2M+', label: 'In stock' },
  { num: '15K+', label: 'Items sold' },
  { num: '4.9 ★', label: 'Trustpilot' },
  { num: '10+', label: 'EU countries' },
];

const timeline = [
  { year: '2018', text: 'Founded in Geldermalsen' },
  { year: '2023', text: '10,000th item sold' },
  { year: '2025', text: 'European expansion as Camify' },
];

export default function AboutPage() {
  return (
    <>
      <div className="svc-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'About us' }]} />
          <div className="svc-eyebrow">Over ons</div>
          <h1 className="svc-title"><WordReveal text="About Camify" /></h1>
          <p className="svc-intro" style={{ animation: 'camWordReveal .6s cubic-bezier(.16,1,.3,1) both', animationDelay: '300ms' }}>
            We&rsquo;re building Europe&rsquo;s most trusted marketplace for pre-owned camera equipment. Every item inspected,
            graded, and backed by warranty &mdash; so you can focus on what matters: making images.
          </p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: 72 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 22px', minWidth: 110 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{s.num}</div>
            <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* USP's */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', marginBottom: 44 }}>
        {[
          { t: '12 maanden garantie', p: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
          { t: 'Professioneel geïnspecteerd', p: <path d="M20 6 9 17l-5-5" /> },
          { t: '14 dagen retour', p: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></> },
          { t: 'Echte productfoto’s', p: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></> },
        ].map(u => (
          <div key={u.t} className="cam-lift" style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', background: '#fff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ flexShrink: 0 }}>{u.p}</svg>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{u.t}</span>
          </div>
        ))}
      </div>

      {/* Story */}
      <div style={{ maxWidth: 760, fontSize: 15.5, lineHeight: 1.75, color: 'var(--text)' }}>
        <p style={{ margin: '0 0 18px' }}>
          Camify started from frustration. Buying used camera gear online meant scrolling through blurry Marktplaats
          listings, hoping the seller was honest about that &ldquo;barely used&rdquo; lens. Selling wasn&rsquo;t any
          better &mdash; lowball offers, no-shows, and the hassle of shipping without guarantees.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--accent)', background: 'var(--surface)', padding: '12px 18px', borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: 'var(--text-sec)', margin: '0 0 18px' }}>
          There had to be a better way.
        </blockquote>

        <p style={{ margin: '0 0 18px' }}>
          In 2018, we opened our doors in Geldermalsen as <strong>Camera-Tweedehands.nl</strong> &mdash; a small operation
          with a big idea: bring the trust of a professional dealer to the second-hand camera market. Every item inspected.
          Every product graded honestly. Every purchase backed by a real warranty.
        </p>
        <p style={{ margin: '0 0 28px' }}>
          What started with a few shelves of Canon and Nikon bodies has grown into one of the Netherlands&rsquo; largest
          specialist dealers in pre-owned photo and video equipment. We&rsquo;ve handled tens of thousands of items across
          every major brand &mdash; from entry-level kits to professional cinema rigs.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', maxWidth: 760, marginBottom: 28 }}>
        {timeline.map(t => (
          <div key={t.year} className="cam-lift" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>{t.year}</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 2 }}>{t.text}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 760, fontSize: 15.5, lineHeight: 1.75, color: 'var(--text)' }}>
        <p style={{ margin: '0 0 24px' }}>
          Today, we&rsquo;re expanding across Europe under the name <strong>Camify</strong>. New name, same obsession:
          making it safe, simple, and enjoyable to buy and sell used camera gear. We inspect every single item ourselves.
          We photograph everything. We write honest descriptions. And we stand behind every sale.
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            We&rsquo;re photographers ourselves. We know that feeling when a new-to-you lens arrives and it&rsquo;s even
            better than expected. That&rsquo;s what we aim for &mdash; every time.
          </p>
        </div>
      </div>

      {/* Trustpilot */}
      <div style={{ marginTop: 44, border: '1px dashed var(--border)', borderRadius: 12, padding: '18px 24px', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-sec)', fontSize: 14 }}>
        <span style={{ color: 'var(--tp)', letterSpacing: 1 }}>★★★★★</span>
        <span><strong style={{ color: 'var(--text)' }}>Trustpilot 4.9</strong> — widget met live reviews wordt hier ingeladen.</span>
      </div>
      </div>
    </>
  );
}
