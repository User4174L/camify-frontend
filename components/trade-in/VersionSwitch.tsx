import Link from 'next/link';

/** Tijdelijke schakelaar om de twee inruilflow-varianten naast elkaar te bekijken. */
export default function VersionSwitch({ active }: { active: 1 | 2 | 3 }) {
  const pill = (n: 1 | 2 | 3, href: string) => (
    <Link
      href={href}
      style={{
        padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: 'none',
        background: active === n ? '#1E2133' : 'transparent',
        color: active === n ? '#fff' : '#6B6D80',
      }}
    >
      Versie {n}
    </Link>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 1200, margin: '0 auto', padding: '10px 24px 0' }}>
      <div style={{ display: 'inline-flex', gap: 2, background: '#F8F8FA', border: '1px solid #EEEEF2', borderRadius: 999, padding: 3 }}>
        {pill(1, '/trade-in')}
        {pill(2, '/trade-in/v2')}
        {pill(3, '/trade-in/v3')}
      </div>
    </div>
  );
}
