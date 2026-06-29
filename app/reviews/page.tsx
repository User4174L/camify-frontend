import SimplePage from '@/components/layout/SimplePage';

const sample = [
  { name: 'Mark D.', text: 'Lens arrived even better than described. Honest grading and fast shipping.' },
  { name: 'Sanne V.', text: 'Sold my old body via trade-in — smooth process and a fair price.' },
  { name: 'Thomas R.', text: 'Great service and real photos of the actual item. Buy with confidence.' },
];

export default function ReviewsPage() {
  return (
    <SimplePage
      title="Reviews"
      breadcrumb="Reviews"
      eyebrow="Reviews"
      parent={{ label: 'Help', href: '/help' }}
      intro="Rated 4.9 on Trustpilot by thousands of photographers across Europe."
    >
      {/* Trustpilot widget placeholder */}
      <div
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 28,
          background: 'var(--surface)',
          color: '#5A5C6B',
          fontSize: 14,
        }}
      >
        ★★★★★ Trustpilot widget — live feed wordt hier ingeladen (TrustBox / API).
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
        {sample.map((r) => (
          <div
            key={r.name}
            className="cam-lift"
            style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 18, background: '#fff' }}
          >
            <div style={{ color: 'var(--tp)', fontSize: 14, marginBottom: 6 }}>★★★★★</div>
            <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6 }}>{r.text}</p>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
