'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Star } from 'lucide-react';

export default function Footer() {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  return (
    <footer className="border-t border-gray-100 pt-16 pb-8">
      <div className="container">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2.5 text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8692A] text-xs font-bold text-white">C</div>
              Camify
            </Link>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#E8692A]" />
                support@camera-tweedehands.nl
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#E8692A]" />
                085 301 83 32
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8692A]" />
                Kerkstraat 47 Bis, 4191AA Geldermalsen
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="mb-5 text-sm font-bold uppercase tracking-wider text-[#E8692A]">Shop</div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Cameras', href: '/cameras' },
                { label: 'Lenses', href: '/lenses' },
                { label: 'Video', href: '/video-and-cinema' },
                { label: 'Action & Drones', href: '/action-and-drones' },
                { label: 'Accessories', href: '/accessories' },
                { label: 'All Brands', href: '/brands' },
                { label: 'Sale', href: '/sale' },
                { label: 'New Arrivals', href: '/new' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-500 transition-colors hover:text-[#E8692A]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="mb-5 text-sm font-bold uppercase tracking-wider text-[#E8692A]">Help</div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'FAQ', href: '/faq' },
                { label: 'Knowledge Base', href: '/knowledge-base' },
                { label: 'About Us', href: '/about' },
                { label: 'Sell Your Gear', href: '/sell' },
                { label: 'Contact', href: '/about' },
              ].map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-500 transition-colors hover:text-[#E8692A]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="mb-5 text-sm font-bold uppercase tracking-wider text-[#E8692A]">Newsletter</div>
            {newsletterSubmitted ? (
              <p className="text-sm font-semibold text-emerald-500">Bedankt! Je bent aangemeld.</p>
            ) : (
              <form
                className="mb-5 flex gap-2"
                onSubmit={(e) => { e.preventDefault(); setNewsletterSubmitted(true); }}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#E8692A]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8692A] text-white transition-colors hover:bg-[#D15A20]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Star className="h-4 w-4 text-[#00b67a]" fill="#00b67a" />
              <span>Trustpilot — 4.9</span>
              <div className="ml-1 flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="trustpilot-star" style={{ width: 16, height: 16, fontSize: 9 }}>&#9733;</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-[13px] text-gray-400 md:flex-row">
          <div>
            <span>&copy; 2026 Camera-tweedehands.nl B.V. All rights reserved.</span>
            <span className="mt-1 block text-[11px] text-gray-300">
              KVK: 80564674 &middot; BTW: NL861717971B01
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['iDEAL', 'Visa', 'MC', 'AMEX', 'PayPal', 'Apple', 'Klarna'].map(m => (
              <div key={m} className="flex h-7 w-10 items-center justify-center rounded border border-gray-200 bg-gray-50 text-[9px] font-semibold text-gray-400">
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
