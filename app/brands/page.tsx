'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';

/* ── Brand data ── */

const popularBrands = [
  { name: 'Canon', count: 2450 },
  { name: 'Nikon', count: 1830 },
  { name: 'Sony', count: 2100 },
  { name: 'Fujifilm', count: 890 },
  { name: 'Panasonic', count: 540 },
  { name: 'Olympus', count: 380 },
  { name: 'Sigma', count: 650 },
  { name: 'Leica', count: 420 },
  { name: 'Hasselblad', count: 180 },
  { name: 'DJI', count: 310 },
  { name: 'RED', count: 95 },
];

const allBrands = [
  '3 Legged Thing', '7Artisans',
  'ARRI', 'Apple',
  'Benro', 'Blackmagic',
  'Canon', 'Cokin', 'CineStill',
  'DJI', 'DZOFilm',
  'Epson',
  'Fujifilm', 'Fotodiox',
  'Gitzo', 'GoPro', 'Godox',
  'Hasselblad', 'Hoya',
  'Insta360',
  'JVC',
  'K&F Concept', 'Kenko', 'Kowa',
  'Laowa', 'Leica', 'Lowepro', 'Lume Cube',
  'Manfrotto', 'Meike', 'Mitakon',
  'Nikon', 'NiSi',
  'Olympus', 'OM System',
  'Panasonic', 'Peak Design', 'Pentax', 'Phase One', 'Profoto',
  'Ricoh', 'RED', 'Rode', 'Rokinon',
  'Sigma', 'SmallRig', 'Sony', 'SanDisk', 'Sennheiser',
  'Tamron', 'Tenba', 'Tokina', 'TTArtisan',
  'Viltrox', 'Voigtlander',
  'Z CAM', 'Zeiss', 'Zhiyun',
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[&]/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* Group brands by first letter */
function groupByLetter(brands: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const brand of brands) {
    const first = brand.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(first) ? first : '#';
    if (!groups[key]) groups[key] = [];
    groups[key].push(brand);
  }
  // Sort each group
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.localeCompare(b));
  }
  return groups;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letters = [...alphabet, '#'];
const grouped = groupByLetter(allBrands);
const activeLetters = new Set(Object.keys(grouped));

export default function BrandsPage() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollToLetter = (letter: string) => {
    const el = sectionRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 64 }}>
      <Breadcrumb items={[{ label: 'Brands' }]} />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#1E2133',
            marginBottom: 8,
          }}
        >
          Shop by Brand
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--text-secondary, #6b7280)',
            maxWidth: 640,
          }}
        >
          Browse our most popular camera and lens brands, or scroll through
          the full A-Z list to find exactly what you&apos;re looking for.
        </p>
      </div>

      {/* ── Popular Brands ── */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1E2133',
            marginBottom: 16,
          }}
        >
          Popular Brands
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12,
          }}
          className="brands-popular-grid"
        >
          {popularBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/brands/${toSlug(brand.name)}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px 12px 20px',
                background: '#1E2133',
                borderRadius: 12,
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="brand-popular-card"
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(232,105,42,.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: '#E8692A',
                marginBottom: 10,
                letterSpacing: '-.5px',
              }}>
                {brand.name.charAt(0)}
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{brand.name}</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12 }}>{brand.count.toLocaleString()} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1.5px solid #EEEEF2', marginBottom: 32 }} />

      {/* ── All Brands ── */}
      <section>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1E2133',
            marginBottom: 16,
          }}
        >
          All Brands
        </h2>

        {/* Alphabet nav */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            marginBottom: 28,
            position: 'sticky',
            top: 0,
            background: '#F8F8FA',
            padding: '12px 0',
            zIndex: 10,
          }}
        >
          {letters.map((letter) => {
            const isActive = activeLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => isActive && scrollToLetter(letter)}
                disabled={!isActive}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '1.5px solid #EEEEF2',
                  background: isActive ? '#fff' : '#F8F8FA',
                  color: isActive ? '#1E2133' : '#c5c5cc',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: isActive ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Grouped brand list */}
        <div>
          {letters
            .filter((l) => grouped[l])
            .map((letter) => (
              <div
                key={letter}
                ref={(el) => {
                  sectionRefs.current[letter] = el;
                }}
                style={{ marginBottom: 28, scrollMarginTop: 80 }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#E8692A',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '1px solid #EEEEF2',
                  }}
                >
                  {letter}
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px 16px',
                  }}
                  className="brands-all-grid"
                >
                  {grouped[letter].map((brand) => (
                    <Link
                      key={brand}
                      href={`/brands/${toSlug(brand)}`}
                      style={{
                        fontSize: 14,
                        color: '#1E2133',
                        textDecoration: 'none',
                        padding: '8px 0',
                        transition: 'color 0.15s',
                      }}
                      className="brand-all-link"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── Responsive styles ── */}
      <style>{`
        .brand-popular-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(30, 33, 51, 0.3);
        }
        .brand-all-link:hover {
          color: #E8692A !important;
        }
        @media (max-width: 768px) {
          .brands-popular-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .brands-all-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .brands-popular-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .brands-all-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
