'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield, CheckCircle2, Truck, RotateCcw, ChevronRight,
  Star, ArrowRight, Sparkles, TrendingUp, Camera,
} from 'lucide-react';

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

const categories = [
  { name: 'Cameras', count: '850+', href: '/cameras', image: '/images/sony-a7-iv.jpg' },
  { name: 'Lenses', count: '1200+', href: '/lenses', image: '/images/sony-fe-24-70mm-f28-gm.jpg' },
  { name: 'Video', count: '340+', href: '/video-and-cinema', image: '/images/sony-a1.jpg' },
  { name: 'Accessories', count: '2400+', href: '/accessories', image: '/images/canon-r5.jpg' },
];

const justAddedProducts = products.filter(p => p.stock > 0).slice(0, 4);
const bestsellerProducts = products.filter(p => p.stock > 0).slice(2, 6);


export default function HomePage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        {/* Background text watermark */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(60px,12vw,160px)] font-bold tracking-tight text-[#E8692A]/[0.04]">
          Buy, sell or trade
        </div>

        <div className="container relative z-10 py-16 text-center md:py-24">
          <h1 className="mb-4 text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-tight">
            <span className="text-[#E8692A]">Buy, sell</span> or trade
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-gray-500">
            The trusted marketplace for second-hand camera equipment.<br className="hidden md:block" />
            Professionally checked, with minimum 12 months warranty.
          </p>
          <div className="mb-8 flex justify-center gap-4">
            <Link
              href="/cameras"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E2133] px-8 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/20"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/trade-in"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1E2133] px-8 py-4 text-[15px] font-semibold text-[#1E2133] transition-all hover:-translate-y-0.5 hover:bg-[#1E2133] hover:text-white"
            >
              Start Selling
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-sm font-medium">
            <span className="font-semibold">Excellent</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="trustpilot-star" style={{ width: 20, height: 20, fontSize: 11 }}>&#9733;</span>
              ))}
            </div>
            <span className="font-bold">
              <Star className="mr-0.5 inline h-4 w-4 text-[#00b67a]" fill="#00b67a" />
              Trustpilot
            </span>
          </div>
        </div>
      </section>

      {/* ─── JUST ADDED ─── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#E8692A]">
                <Sparkles className="h-4 w-4" /> Fresh Arrivals
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Just <span className="italic text-[#E8692A]">Added</span>
              </h2>
            </div>
            <Link href="/new" className="hidden text-sm font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-[#E8692A] md:inline">
              View all &rarr;
            </Link>
          </div>
          <p className="mb-6 text-sm text-gray-500">Fresh arrivals added this week</p>

          {/* Tabs */}
          <div className="mb-8 flex gap-2">
            {['All', 'Cameras', 'Lenses', 'Accessories'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-full border px-5 py-2 text-[13px] font-medium transition-all',
                  activeTab === tab
                    ? 'border-[#1E2133] bg-[#1E2133] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <ProductGrid products={justAddedProducts} onQuickView={setQuickViewId} />

          <Link href="/new" className="mt-6 block text-center text-sm font-semibold text-gray-900 underline underline-offset-4 md:hidden">
            View all &rarr;
          </Link>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="border-y border-gray-100 py-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Shield, title: 'Secure Checkout', text: 'SSL encrypted payments via Pay.nl' },
              { icon: CheckCircle2, title: 'Professionally Checked', text: 'Every item inspected & tested' },
              { icon: Truck, title: 'Free Shipping', text: 'On orders above \u20AC50 in NL/BE' },
              { icon: RotateCcw, title: '14-Day Returns', text: 'For online purchases, no questions asked' },
            ].map(badge => (
              <div key={badge.title} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#E8692A]">
                  <badge.icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{badge.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{badge.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Shop by <span className="italic text-[#E8692A]">Category</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 p-5 md:h-56"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
                />
                <div className="relative z-10">
                  <div className="text-lg font-bold text-white">{cat.name}</div>
                  <div className="text-xs text-white/60">{cat.count} products</div>
                </div>
                <ChevronRight className="absolute right-4 top-4 z-10 h-5 w-5 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-white/80" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY BRAND ─── */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="mb-2 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Shop by <span className="italic text-[#E8692A]">Brand</span>
            </h2>
            <Link href="/brands" className="text-sm font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-[#E8692A]">
              All brands &rarr;
            </Link>
          </div>
          <p className="mb-8 text-sm text-gray-500">Browse our most popular brands</p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {topBrands.map(brand => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex items-center gap-3.5 rounded-xl bg-[#1E2133] p-4 text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/20"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-lg font-extrabold text-[#E8692A]">
                  {brand.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">{brand.name}</div>
                  <div className="text-xs text-white/50">{brand.count.toLocaleString()} items</div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-white/60" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BESTSELLERS ─── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#E8692A]">
                <TrendingUp className="h-4 w-4" /> Most Popular
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Best<span className="italic text-[#E8692A]">sellers</span>
              </h2>
            </div>
            <Link href="/cameras" className="text-sm font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-[#E8692A]">
              View all &rarr;
            </Link>
          </div>
          <p className="mb-8 text-sm text-gray-500">Our most popular items</p>

          <ProductGrid products={bestsellerProducts} onQuickView={setQuickViewId} />
        </div>
      </section>

      {/* ─── WHY CAMIFY ─── */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="mb-3 text-[clamp(28px,4vw,40px)] font-bold tracking-tight">
              Why <span className="text-[#E8692A]">Camify</span>?
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              We make buying and selling used camera gear simple, safe, and affordable.
            </p>
          </div>

          <div className="mb-16 grid gap-5 md:grid-cols-3">
            {[
              { icon: Shield, title: '12-Month Warranty', text: 'Every item comes with a minimum 12-month warranty for peace of mind.' },
              { icon: CheckCircle2, title: 'Expert Inspection', text: 'Our team of professionals checks every item before it goes on sale.' },
              { icon: Sparkles, title: 'Best Prices', text: 'Competitive pricing based on real-time market data across Europe.' },
            ].map(card => (
              <div
                key={card.title}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:-translate-y-0.5 hover:border-[#E8692A]/20 hover:shadow-lg hover:shadow-orange-100/50"
              >
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-orange-50 text-[#E8692A] transition-colors group-hover:bg-[#E8692A] group-hover:text-white">
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-[17px] font-bold text-gray-900">{card.title}</div>
                <div className="text-sm leading-relaxed text-gray-500">{card.text}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-12 text-center md:grid-cols-4">
            {[
              { number: '10,000+', label: 'Products' },
              { number: '15,000+', label: 'Items Sold' },
              { number: '100+', label: 'Brands' },
              { number: '4.9', label: 'Trustpilot Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-bold tracking-tight text-[#E8692A]">{stat.number}</div>
                <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-[#00b67a]" fill="#00b67a" />
              <span className="text-xl font-bold">Trustpilot</span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: 'Fantastic service!', text: 'Ordered a Nikon Z8 in excellent condition. Arrived within 2 days, perfectly packaged. Camera was exactly as described. Will definitely buy again!', author: 'M.V.', date: 'Feb 2026' },
              { title: 'Best prices in Europe', text: 'Compared prices across 5 different used camera shops. Camify had the best price for the Canon RF 70-200mm f/2.8 and the condition was better than expected.', author: 'J.K.', date: 'Jan 2026' },
              { title: 'Easy trade-in process', text: 'Sold my old Sony A7III and bought a Fujifilm X-T5. The trade-in quote was fair and the whole process took less than a week. Great experience!', author: 'S.D.', date: 'Feb 2026' },
            ].map((review, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-7 transition-shadow hover:shadow-md">
                <div className="mb-4 flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="trustpilot-star" style={{ width: 20, height: 20, fontSize: 11 }}>&#9733;</span>
                  ))}
                </div>
                <div className="mb-2.5 text-[15px] font-bold text-gray-900">{review.title}</div>
                <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-500">{review.text}</p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                    {review.author}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{review.author}</div>
                    <div className="text-xs text-gray-400">{review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="bg-[#1E2133] py-16 text-white">
        <div className="container text-center">
          <Badge className="mb-5 rounded-full bg-[#E8692A] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#E8692A]">
            Get &euro;10 off your first order
          </Badge>
          <h2 className="mb-2 text-[28px] font-bold tracking-tight">Stay in the loop</h2>
          <p className="mb-7 text-[15px] text-white/60">
            New arrivals, deals, and camera tips straight to your inbox.
          </p>
          <form className="mx-auto flex max-w-md gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#E8692A]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#E8692A] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15A20]"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-[11px] text-white/30">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </>
  );
}
