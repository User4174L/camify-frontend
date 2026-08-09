/**
 * Platformlogo's als inline SVG. Bewust geen losse bestanden of een CDN:
 * de artifact-/CSP-omgeving blokkeert externe requests, en inline blijft het
 * scherp op elk scherm zonder extra netwerkverkeer.
 *
 * Alle merken staan in hun eigen huisstijlkleur, zoals de platformen dat zelf
 * voorschrijven. Vierkant canvas van 40x40 zodat ze in een rij netjes uitlijnen.
 */

type LogoProps = { size?: number };

export function WebwinkelKeurLogo({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="WebwinkelKeur">
      <circle cx="20" cy="20" r="17" fill="none" stroke="#E6007E" strokeWidth="4.5" />
      {/* Staartje rechtsonder, kenmerkend voor het WebwinkelKeur-vinkje */}
      <path d="M30 28c3 3 4 5.5 4 7" fill="none" stroke="#E6007E" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M12.5 20.5l5 5 10-11" fill="none" stroke="#E6007E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookLogo({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Facebook">
      <rect width="40" height="40" rx="7" fill="#1877F2" />
      <path
        d="M26.5 20.2h-4.2V32h-5.1V20.2H14v-4.4h3.2v-2.6c0-3.4 1.6-5.4 5.5-5.4h3.4v4.4h-2.1c-1.3 0-1.5.5-1.5 1.6v2h3.7l-.7 4.4z"
        fill="#fff"
      />
    </svg>
  );
}

export function GoogleLogo({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function TrustedShopsLogo({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Trusted Shops">
      <circle cx="20" cy="20" r="19" fill="#1B1B1B" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#FFDC0F" strokeWidth="1.6" />
      <text
        x="20" y="27.5" textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontStyle="italic"
        fill="#FFDC0F"
      >
        e
      </text>
    </svg>
  );
}

export function TrustpilotLogo({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Trustpilot">
      <path
        fill="#00B67A"
        d="M20 3.5l4.9 11.4 12.4 1-9.4 8.1 2.8 12.1L20 29.7 9.3 36.1l2.8-12.1-9.4-8.1 12.4-1z"
      />
    </svg>
  );
}

/** Gouden ster voor de score-kolom, gelijk aan de weergave van WebwinkelKeur. */
export function ScoreStar({ size = 17 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFC107" aria-hidden="true">
      <path d="M12 2.2l3 6.7 7.3.6-5.5 4.8 1.6 7.1L12 17.7 5.6 21.4l1.6-7.1L1.7 9.5l7.3-.6z" />
    </svg>
  );
}
