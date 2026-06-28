import type { CSSProperties } from 'react';

/**
 * Toont tekst die woord-voor-woord ingfade't (pure CSS-keyframe `camWordReveal`).
 * Werkt overal — ook in de statische Pages-export — want het heeft geen JS nodig.
 * Bedoeld voor koppen die bij het laden in beeld staan.
 */
export default function WordReveal({
  text,
  style,
  className,
  startDelay = 0,
  step = 55,
}: {
  text: string;
  style?: CSSProperties;
  className?: string;
  startDelay?: number;
  step?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span key={i}>
          <span
            data-cam-word=""
            style={{
              display: 'inline-block',
              animation: 'camWordReveal .6s cubic-bezier(.16,1,.3,1) both',
              animationDelay: `${startDelay + i * step}ms`,
              willChange: 'transform, opacity',
            }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
