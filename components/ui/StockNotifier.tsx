'use client';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Stock notifier — shared form (category popup + inline on product)  */
/*  Conditions follow the V2 backend ProductCondition scale.           */
/* ------------------------------------------------------------------ */

export const NOTIFIER_CONDITIONS = [
  'New',
  'Excellent',
  'Very good',
  'Good',
  'Used',
  'Heavily used',
];

/* Usage metric depends on product type: shutter count for cameras,
   operation hours for cinema gear, nothing for lenses/accessories. */
export type UsageMetric = 'shutter' | 'hours' | 'none';

export function usageMetricForCategory(category: string): UsageMetric {
  if (category === 'cameras' || category === 'drones') return 'shutter';
  if (category === 'video-cinema' || category === 'cinema') return 'hours';
  return 'none';
}

const shutterCountOptions = [
  'No preference',
  'Under 5,000',
  'Under 10,000',
  'Under 25,000',
  'Under 50,000',
  'Under 100,000',
];

const operationHoursOptions = [
  'No preference',
  'Under 100 hours',
  'Under 250 hours',
  'Under 500 hours',
  'Under 1,000 hours',
  'Under 2,000 hours',
];

export const BellIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function StockNotifier({
  productTitle,
  usageMetric = 'shutter',
}: {
  productTitle: string;
  usageMetric?: UsageMetric;
}) {
  const [email, setEmail] = useState('');
  /* All conditions pre-checked: every unchecked box is a missed match.
     The notification email itself (condition + price) is the filter. */
  const [conditions, setConditions] = useState<string[]>([...NOTIFIER_CONDITIONS]);
  const [maxUsage, setMaxUsage] = useState('No preference');
  const [submitted, setSubmitted] = useState(false);

  const toggleCondition = (c: string) => {
    setConditions(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));
  };

  const usageOptions = usageMetric === 'hours' ? operationHoursOptions : shutterCountOptions;
  const usageLabel = usageMetric === 'hours' ? 'Max. operation hours' : 'Max. shutter count';

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Alert set!</div>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
          We&apos;ll email you as soon as a {productTitle} matching your preferences arrives.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bell icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <BellIcon size={24} />
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginTop: 0, marginBottom: 8 }}>
        Get notified when available
      </h3>
      <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
        We don&apos;t have a {productTitle} in stock right now, but we regularly receive new units.
        Set your preferences below and we&apos;ll email you the moment one arrives.
      </p>

      {/* Email */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', border: '1.5px solid var(--border, #e5e7eb)',
            borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Conditions */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Notify me for these conditions
        </label>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 10px' }}>
          Uncheck the conditions you&apos;re not interested in.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {NOTIFIER_CONDITIONS.map(c => (
            <label
              key={c}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer',
                padding: '6px 12px', borderRadius: 8,
                border: conditions.includes(c) ? '1.5px solid var(--accent, #f97316)' : '1.5px solid var(--border, #e5e7eb)',
                background: conditions.includes(c) ? '#fff7ed' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="checkbox"
                checked={conditions.includes(c)}
                onChange={() => toggleCondition(c)}
                style={{ accentColor: 'var(--accent, #f97316)' }}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Usage metric — cameras: shutter count, cinema: operation hours */}
      {usageMetric !== 'none' && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 10 }}>
            {usageLabel}
          </label>
          <select
            value={maxUsage}
            onChange={e => setMaxUsage(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '1.5px solid var(--border, #e5e7eb)',
              borderRadius: 10, fontSize: 14, background: '#fff', cursor: 'pointer', boxSizing: 'border-box',
            }}
          >
            {usageOptions.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={() => setSubmitted(true)}
        style={{
          width: '100%', padding: '14px', background: 'var(--accent, #f97316)', color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <BellIcon />
        Notify me
      </button>

      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 14, marginBottom: 0, lineHeight: 1.5 }}>
        You&apos;ll receive an email each time a matching item is listed. Unsubscribe anytime.
      </p>
    </div>
  );
}
