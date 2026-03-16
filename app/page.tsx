'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
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

const justAddedProducts = products.filter(p => p.stock > 0).slice(0, 4);
const bestsellerProducts = products.filter(p => p.stock > 0).slice(2, 6);

export default function HomePage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg-text">Buy, sell or trade</div>
        <div className="container">
          <h1 className="hero__title"><span>Buy, sell</span> or trade</h1>
          <p className="hero__subtitle">
            The trusted marketplace for second-hand camera equipment.<br />
            Professionally checked, with minimum 12 months warranty.
          </p>
          <div className="hero__buttons">
            <Link href="/trade-in" className="btn btn--primary">Start Selling →</Link>
          </div>
          <div className="hero__trustpilot" style={{ justifyContent: 'center' }}>
            <span className="trustpilot-label">Excellent</span>
            <div className="trustpilot-stars">
              {[1,2,3,4,5].map(i => <span key={i} className="trustpilot-star">&#9733;</span>)}
            </div>
            <span className="trustpilot-logo"><span className="tp-star">&#9733;</span> Trustpilot</span>
          </div>
        </div>
      </section>

      {/* JUST ADDED — right after hero */}
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
          <div className="reviews__grid">
            {[
              { title: 'Fantastic service!', text: 'Ordered a Nikon Z8 in excellent condition. Arrived within 2 days, perfectly packaged. Camera was exactly as described. Will definitely buy again!', author: 'M.V.', date: 'Feb 2026' },
              { title: 'Best prices in Europe', text: 'Compared prices across 5 different used camera shops. Camify had the best price for the Canon RF 70-200mm f/2.8 and the condition was better than expected.', author: 'J.K.', date: 'Jan 2026' },
              { title: 'Easy trade-in process', text: 'Sold my old Sony A7III and bought a Fujifilm X-T5. The trade-in quote was fair and the whole process took less than a week. Great experience!', author: 'S.D.', date: 'Feb 2026' },
            ].map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-card__stars">
                  {[1,2,3,4,5].map(s => <span key={s} className="trustpilot-star">&#9733;</span>)}
                </div>
                <div className="review-card__title">{review.title}</div>
                <div className="review-card__text">{review.text}</div>
                <div className="review-card__author">
                  <div className="review-card__avatar">{review.author}</div>
                  <div>
                    <div className="review-card__name">{review.author}</div>
                    <div className="review-card__date">{review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
