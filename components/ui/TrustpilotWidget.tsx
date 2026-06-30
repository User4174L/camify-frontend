'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

const BUSINESS_UNIT_ID = '63efddc46c5dc26ae2638c47';

/**
 * Officiële Trustpilot TrustBox. Vereist het bootstrap-script (zit in layout.tsx).
 * Geef het `templateId` van het gewenste type (zie placement-advies/_docs).
 */
export default function TrustpilotWidget({
  templateId,
  token,
  height = '52px',
  width = '100%',
  theme,
  stars,
  locale = 'nl-NL',
  reviewLanguages,
  className,
  style,
  children,
}: {
  templateId: string;
  token?: string;
  height?: string;
  width?: string;
  theme?: 'light' | 'dark';
  stars?: string;
  locale?: string;
  reviewLanguages?: string;
  className?: string;
  style?: CSSProperties;
  /** Fallback-inhoud die getoond wordt zolang/indien de live widget niet rendert (bv. ander domein). */
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`trustpilot-widget${className ? ` ${className}` : ''}`}
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={BUSINESS_UNIT_ID}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
      data-stars={stars}
      data-review-languages={reviewLanguages}
      data-token={token}
      style={style}
    >
      {children ?? (
        <a href="https://nl.trustpilot.com/review/www.camera-tweedehands.nl" target="_blank" rel="noopener">
          Trustpilot
        </a>
      )}
    </div>
  );
}

/** Centrale template-id's zodat we ze niet door de code verspreiden. */
export const TP = {
  microCombo: '5419b6ffb0d04a076446a9af',
  microStar: '5419b732fbfb950b10de65e5',
  microTrustScore: '5419b637fa0340045cd0c936',
  horizontal: '5406e65db0d04a09e042d5fc',
  mini: '53aa8807dec7e10d38f59f32',
  carousel: '53aa8912dec7e10d38f59f36',
  grid: '539adbd6dec7e10e686debee',
  list: '539ad60defb9600b94d7df2c',
  reviewCollector: '56278e9abfbbba0bdcd568bc',
} as const;

/** Per-widget tokens uit het Trustpilot-dashboard (nodig om de widget te renderen). */
export const TP_TOKEN = {
  microTrustScore: '5bcf1715-ff02-4195-9853-3f248413e733',
  carousel: '162f39f3-c000-4c80-8a63-a33642253b59',
  mini: '2d108f53-7196-42a8-97a2-2d32463da388',
} as const;
