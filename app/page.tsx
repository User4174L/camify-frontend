'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import TrustpilotWidget, { TP } from '@/components/ui/TrustpilotWidget';
import { products } from '@/data/products';

const topBrands = [
  { name: 'Canon', count: 2450, slug: 'canon' },
  { name: 'Nikon', count: 1830, slug: 'nikon' },
  { name: 'Sony', count: 2100, slug: 'sony' },
  { name: 'Fujifilm', count: 890, slug: 'fujifilm' },
  { name: 'Leica', count: 420, slug: 'leica' },
  { name: 'Sigma', count: 650, slug: 'sigma' },
  { name: 'Hasselblad', count: 180, slug: 'hasselblad' },
  { name: 'Panasonic', count: 540, slug: 'panasonic' },
];

const justAddedProducts = products.filter(p => p.stock > 0).slice(0, 5);
const bestsellerProducts = products.filter(p => p.stock > 0).slice(2, 7);

export default function HomePage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  return (
    <>
      {/* HERO — inruil banner (full-bleed strip) */}
      <section className="trade-hero">
        <style>{`
          .trade-hero{position:relative;overflow:hidden;display:flex;align-items:center;min-height:400px;margin-bottom:48px;background:linear-gradient(110deg,#F3F2F0 0%,#F0EFEC 38%,#ECEBE8 100%)}
          .trade-hero__photo{position:absolute;top:0;right:0;bottom:0;width:62%;background:url(/images/trade-in-hero.jpg) center right/cover;-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.35) 16%,#000 48%);mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.35) 16%,#000 48%)}
          .trade-hero .container{position:relative;z-index:2}
          .trade-hero__content{min-width:0;max-width:540px;padding:36px 0}
          .trade-hero__icon{color:var(--accent);margin-bottom:16px;display:flex}
          .trade-hero__title{font-size:clamp(21px,2.4vw,30px);font-weight:800;line-height:1.16;letter-spacing:-.02em;color:var(--text);margin:0;overflow-wrap:break-word}
          .trade-hero__title span{display:block;color:var(--accent)}
          .trade-hero__sub{font-size:clamp(13px,1.2vw,15px);color:#5A5C6B;margin:10px 0 0}
          .trade-hero__btn{display:inline-flex;align-items:center;gap:8px;margin-top:20px;background:var(--accent);color:#fff;font-weight:600;font-size:15px;padding:11px 28px;border-radius:999px;transition:background .2s,transform .2s,box-shadow .2s}
          .trade-hero__btn:hover{background:var(--accent-h);transform:translateY(-1px);box-shadow:0 8px 22px rgba(232,105,42,.28)}
          .trade-hero__tp{position:absolute;right:0;bottom:32px;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;background:rgba(255,255,255,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:9px 16px;border-radius:999px;box-shadow:0 2px 12px rgba(30,33,51,.07)}
          @media(max-width:768px){
            .trade-hero{min-height:0;margin-bottom:32px}
            .trade-hero__photo{width:100%;opacity:.28;-webkit-mask-image:none;mask-image:none}
            .trade-hero__content{max-width:none;padding:32px 0}
            .trade-hero__title{font-size:22px;line-height:1.22}
            .trade-hero__tp{position:static;margin-top:18px;background:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;padding:0;flex-wrap:wrap;gap:8px}
          }
        `}</style>
        <div className="trade-hero__photo" aria-hidden="true" />
        <div className="container">
          <div className="trade-hero__content">
            <div className="trade-hero__icon" aria-hidden="true">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
            </div>
            <h1 className="trade-hero__title">
              Verkoop je apparatuur.
              <span>Geef je gear een nieuw leven.</span>
            </h1>
            <p className="trade-hero__sub">Snel, veilig en eenvoudig.</p>
            <Link href="/trade-in" className="trade-hero__btn">Ruil in &rarr;</Link>
          </div>
          <div className="trade-hero__tp">
            <span className="trustpilot-label">Excellent</span>
            <div className="trustpilot-stars">
              {[1,2,3,4,5].map(i => <span key={i} className="trustpilot-star">&#9733;</span>)}
            </div>
            <span className="trustpilot-logo"><span className="tp-star">&#9733;</span> Trustpilot</span>
          </div>
        </div>
      </section>

      {/* JUST ADDED — right after hero */}
      <style>{`
        /* Homepage product grids: 5 kolommen, responsive omlaag */
        .bestsellers .product-grid-responsive,
        .just-added-scroll .product-grid-responsive{grid-template-columns:repeat(5,1fr)}
        @media(max-width:1100px){
          .bestsellers .product-grid-responsive,
          .just-added-scroll .product-grid-responsive{grid-template-columns:repeat(4,1fr)}
        }
        @media(max-width:880px){
          .bestsellers .product-grid-responsive,
          .just-added-scroll .product-grid-responsive{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:600px){
          .bestsellers .product-grid-responsive{grid-template-columns:repeat(2,1fr)}
        }
        /* Altijd één nette rij — verberg overflow zodat er geen 2e rij ontstaat */
        /* 4 cols (881-1100): toon 4 */
        @media(max-width:1100px) and (min-width:881px){
          .bestsellers .product-grid-responsive > *:nth-child(n+5),
          .just-added-scroll .product-grid-responsive > *:nth-child(n+5){display:none}
        }
        /* 3 cols (Just Added 769-880): toon 3 — onder 768 wordt 't horizontale scroll, dan weer alles tonen */
        @media(max-width:880px) and (min-width:769px){
          .just-added-scroll .product-grid-responsive > *:nth-child(n+4){display:none}
        }
        /* 3 cols (Bestsellers 601-880): toon 3 */
        @media(max-width:880px) and (min-width:601px){
          .bestsellers .product-grid-responsive > *:nth-child(n+4){display:none}
        }
        /* 2 cols (Bestsellers <=600): toon 2 */
        @media(max-width:600px){
          .bestsellers .product-grid-responsive > *:nth-child(n+3){display:none}
        }
      `}</style>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Just <span>Added</span></h2>
              <p className="section__subtitle">Fresh arrivals added this week</p>
            </div>
            <Link href="/new" className="section__link">View all →</Link>
          </div>
          <div className="filter-tabs">
            <button className="filter-tab filter-tab--active">All</button>
            <button className="filter-tab">Cameras</button>
            <button className="filter-tab">Lenses</button>
            <button className="filter-tab">Accessories</button>
          </div>
          {/* Desktop: grid, Mobile: horizontal scroll */}
          <div className="just-added-scroll">
            <ProductGrid products={justAddedProducts} onQuickView={setQuickViewId} />
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar__grid">
            <div className="trust-badge">
              <div className="trust-badge__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="trust-badge__title">Secure Checkout</div>
              <div className="trust-badge__text">SSL encrypted payments via Pay.nl</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div className="trust-badge__title">Professionally Checked</div>
              <div className="trust-badge__text">Every item inspected &amp; tested</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="trust-badge__title">Free Shipping</div>
              <div className="trust-badge__text">On orders above &euro;50 in NL/BE</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 3 3 12 9 12"/></svg>
              </div>
              <div className="trust-badge__title">14-Day Returns</div>
              <div className="trust-badge__text">For online purchases, no questions asked</div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Shop by <span>Brand</span></h2>
            </div>
            <Link href="/brands" className="section__link">All brands →</Link>
          </div>
          <style>{`
            .home-brands-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
            .home-brand-card{display:flex;align-items:center;gap:14px;padding:18px 20px;background:#1E2133;border-radius:12px;text-decoration:none;color:#fff;transition:transform .2s,box-shadow .2s;overflow:hidden;position:relative}
            .home-brand-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(30,33,51,.25)}
            .home-brand-card__icon{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#E8692A;flex-shrink:0;letter-spacing:-.5px}
            .home-brand-card__name{font-size:15px;font-weight:700;line-height:1.2}
            .home-brand-card__count{font-size:12px;color:rgba(255,255,255,.5);font-weight:400}
            .home-brand-card__arrow{margin-left:auto;opacity:.3;transition:opacity .2s}
            .home-brand-card:hover .home-brand-card__arrow{opacity:.7}
            @media(max-width:1024px){.home-brands-grid{grid-template-columns:repeat(2,1fr)}}
            @media(max-width:540px){.home-brands-grid{grid-template-columns:repeat(2,1fr);gap:8px}.home-brand-card{padding:14px 14px}}
          `}</style>
          <div className="home-brands-grid">
            {topBrands.map(brand => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`} className="home-brand-card">
                <div className="home-brand-card__icon">{brand.name.charAt(0)}</div>
                <div>
                  <div className="home-brand-card__name">{brand.name}</div>
                  <div className="home-brand-card__count">{brand.count.toLocaleString()} items</div>
                </div>
                <svg className="home-brand-card__arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bestsellers">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Best<span>sellers</span></h2>
              <p className="section__subtitle">Our most popular items</p>
            </div>
            <Link href="/cameras" className="section__link">View all →</Link>
          </div>
          <div className="filter-tabs">
            <button className="filter-tab filter-tab--active">All</button>
            <button className="filter-tab">Cameras</button>
            <button className="filter-tab">Lenses</button>
          </div>
          <ProductGrid products={bestsellerProducts} onQuickView={setQuickViewId} />
        </div>
      </section>

      {/* WHY CAMIFY */}
      <section className="why">
        <div className="container">
          <div className="why__header">
            <h2>Why <span>Camify</span>?</h2>
            <p>We make buying and selling used camera gear simple, safe, and affordable.</p>
          </div>
          <div className="why__grid">
            <div className="why-card">
              <div className="why-card__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="why-card__title">12-Month Warranty</div>
              <div className="why-card__text">Every item comes with a minimum 12-month warranty for peace of mind.</div>
            </div>
            <div className="why-card">
              <div className="why-card__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div className="why-card__title">Expert Inspection</div>
              <div className="why-card__text">Our team of professionals checks every item before it goes on sale.</div>
            </div>
            <div className="why-card">
              <div className="why-card__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              </div>
              <div className="why-card__title">Best Prices</div>
              <div className="why-card__text">Competitive pricing based on real-time market data across Europe.</div>
            </div>
          </div>

          <div className="why__stats">
            <div><div className="why__stat-number">10,000+</div><div className="why__stat-label">Products</div></div>
            <div><div className="why__stat-number">15,000+</div><div className="why__stat-label">Items Sold</div></div>
            <div><div className="why__stat-number">100+</div><div className="why__stat-label">Brands</div></div>
            <div><div className="why__stat-number">4.9</div><div className="why__stat-label">Trustpilot Rating</div></div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews">
        <div className="container">
          <div className="reviews__header">
            <div className="reviews__tp-logo">
              <span style={{ color: 'var(--tp)', fontSize: 24 }}>&#9733;</span>
              <span>Trustpilot</span>
            </div>
          </div>
          {/* Live Trustpilot-reviews (Carousel) */}
          <TrustpilotWidget templateId={TP.carousel} height="240px" stars="4,5" reviewLanguages="nl" />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter__badge">Get &euro;10 off your first order</div>
          <h2 className="newsletter__title">Stay in the loop</h2>
          <p className="newsletter__subtitle">New arrivals, deals, and camera tips straight to your inbox.</p>
          <form className="newsletter__form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
          <p className="newsletter__privacy">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </>
  );
}
