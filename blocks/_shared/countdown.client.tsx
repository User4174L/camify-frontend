'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Aftelling voor de banner (data.countdown_until). Client-only; rendert niets na afloop. */
export function Countdown({ until, label, light }: { until: string; label?: string; light?: boolean }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(until).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [until]);
  if (left === null || left <= 0) return null;
  const d = Math.floor(left / 86_400_000), h = Math.floor((left % 86_400_000) / 3_600_000), m = Math.floor((left % 3_600_000) / 60_000);
  const parts = [d > 0 ? `${d}d` : null, `${h}u`, `${String(m).padStart(2, '0')}m`].filter(Boolean);
  return (
    <p className={cn('mt-4 flex flex-wrap items-center gap-2 text-sm', light ? 'text-white/85' : 'text-text-secondary')}>
      {label && <span>{label}</span>}
      <span className="inline-flex gap-1">
        {parts.map((p) => <span key={p} className={cn('rounded-md px-2 py-0.5 font-mono text-[13px] font-bold', light ? 'bg-white/15 text-white' : 'bg-surface-inverse text-text-inverse')}>{p}</span>)}
      </span>
    </p>
  );
}
