'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronLeft, ChevronRight, Camera, Bell, CheckCircle2, CreditCard } from 'lucide-react';

const inStockCameras = products.filter(p => p.category === 'cameras' && p.stock > 0);

/* ── Filter matching helpers ── */
function matchesPriceRange(price: number, range: string): boolean {
  if (range === 'Under €500') return price < 500;
  if (range === '€500 – €1,000') return price >= 500 && price <= 1000;
  if (range === '€1,000 – €2,000') return price >= 1000 && price <= 2000;
  if (range === '€2,000 – €5,000') return price >= 2000 && price <= 5000;
  if (range === '€5,000+') return price >= 5000;
  return false;
}

function matchesSensor(sensorSpec: string | undefined, filter: string): boolean {
  if (!sensorSpec) return false;
  const s = sensorSpec.toLowerCase();
  if (filter === 'Full Frame') return s.includes('full frame');
  if (filter === 'APS-C / DX') return s.includes('aps-c') || s.includes('dx');
  if (filter === 'Micro Four Thirds') return s.includes('micro four thirds');
  if (filter === 'Medium Format') return s.includes('medium format');
  if (filter === '1-inch') return s.includes('1-inch') || s.includes('1"');
  return false;
}

const subcategories = [
  { label: 'All Cameras', href: '/cameras', count: '850+', active: true, image: null },
  { label: 'Mirrorless', href: '/cameras/mirrorless', count: '420+', active: false, image: '/images/nikon-z8.jpg' },
  { label: 'DSLR', href: '/cameras/dslr', count: '180+', active: false, image: '/images/canon-r5.jpg' },
  { label: 'Compact', href: '/cameras/compact', count: '95+', active: false, image: '/images/sony-a7-iv.jpg' },
  { label: 'Medium Format', href: '/cameras/medium-format', count: '34+', active: false, image: '/images/hasselblad-x2d-100c.jpg' },
  { label: 'Rangefinder', href: '/cameras/rangefinder', count: '18+', active: false, image: '/images/nikon-zf.jpg' },
  { label: 'Analog / Film', href: '/cameras/analog-film', count: '45+', active: false, image: '/images/nikon-zf.jpg' },
  { label: 'Bridge', href: '/cameras/bridge', count: '28+', active: false, image: '/images/fujifilm-x-t4.jpg' },
];

const allFilters = ['Brand', 'Price', 'Camera type', 'Sensor', 'Mount', 'Megapixels', 'Video resolution', 'IBIS', 'Shuttercount', 'Use case', 'Level', 'In stock'];

const filterOptions: Record<string, string[]> = {
  Brand: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad', 'Panasonic', 'Olympus'],
  Price: ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €5,000', '€5,000+'],
  'Camera type': ['Mirrorless', 'DSLR', 'Compact', 'Medium Format', 'Rangefinder', 'Bridge'],
  Sensor: ['Full Frame', 'APS-C / DX', 'Micro Four Thirds', 'Medium Format', '1-inch'],
  Mount: ['Canon RF', 'Canon EF', 'Nikon Z', 'Nikon F', 'Sony E/FE', 'Fujifilm X', 'Micro Four Thirds', 'Leica M', 'L-Mount'],
  Megapixels: ['< 20 MP', '20 – 30 MP', '30 – 40 MP', '40+ MP'],
  'Video resolution': ['4K', '6K', '8K'],
  IBIS: ['With IBIS', 'Without IBIS'],
  Shuttercount: ['< 10,000', '10,000 – 50,000', '50,000 – 100,000', '100,000+'],
  'Use case': ['Wildlife', 'Portrait', 'Landscape', 'Street', 'Travel', 'Wedding', 'Sports', 'Video', 'Vlogging', 'Astro', 'Macro', 'Allround'],
  Level: ['Entry', 'Enthusiast', 'Pro'],
  'In stock': ['In stock only'],
};


export default function CamerasPage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [readMore, setReadMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Filter & sort state ── */
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const getSelected = (f: string) => filterSelections[f] || [];
  const toggleFilter = (f: string, v: string) => {
    setFilterSelections(prev => {
      const current = prev[f] || [];
      return { ...prev, [f]: current.includes(v) ? current.filter(x => x !== v) : [...current, v] };
    });
    setCurrentPage(1);
  };

  const filterStateMap: Record<string, { selected: string[]; toggle: (v: string) => void }> = {};
  for (const f of allFilters) {
    filterStateMap[f] = { selected: getSelected(f), toggle: (v) => toggleFilter(f, v) };
  }

  const totalActiveFilters = Object.values(filterSelections).reduce((sum, arr) => sum + arr.length, 0);

  const clearAllFilters = () => {
    setFilterSelections({});
    setCurrentPage(1);
  };

  const selectedBrands = getSelected('Brand');
  const selectedPrices = getSelected('Price');
  const selectedSensors = getSelected('Sensor');

  /* ── Derived filtered + sorted list ── */
  const filteredSortedCameras = useMemo(() => {
    let result = [...inStockCameras];

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedPrices.length > 0) {
      result = result.filter(p => selectedPrices.some(range => matchesPriceRange(p.price, range)));
    }
    if (selectedSensors.length > 0) {
      result = result.filter(p =>
        selectedSensors.some(f => matchesSensor(p.specs?.['Sensor'], f))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [selectedBrands, selectedPrices, selectedSensors, sortBy]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.max(1, Math.ceil(filteredSortedCameras.length / ITEMS_PER_PAGE));
  const paginatedCameras = filteredSortedCameras.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginatedCameras.slice(0, 8);
  const secondHalf = paginatedCameras.slice(8);

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Cameras' }]} />

      {/* Title + SEO intro */}
      <div className="mb-6">
        <h1 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">Cameras</h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-gray-500">
          Discover our extensive collection of professionally inspected second-hand cameras. From{' '}
          <Link href="/cameras/mirrorless" className="font-semibold text-[#E8692A] hover:underline">mirrorless systems</Link> by{' '}
          <Link href="/cameras?brand=sony" className="font-semibold text-[#E8692A] hover:underline">Sony</Link>,{' '}
          <Link href="/cameras?brand=nikon" className="font-semibold text-[#E8692A] hover:underline">Nikon</Link> and{' '}
          <Link href="/cameras?brand=canon" className="font-semibold text-[#E8692A] hover:underline">Canon</Link> to{' '}
          <Link href="/cameras/medium-format" className="font-semibold text-[#E8692A] hover:underline">medium format</Link> bodies by{' '}
          <Link href="/cameras?brand=hasselblad" className="font-semibold text-[#E8692A] hover:underline">Hasselblad</Link> and{' '}
          <Link href="/cameras?brand=fujifilm" className="font-semibold text-[#E8692A] hover:underline">Fujifilm</Link> — every camera is tested, graded and backed by our 12-month warranty.
        </p>

        {!readMore && (
          <button
            onClick={() => setReadMore(true)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#E8692A] hover:underline"
          >
            Read more <span className="text-xs">&#8595;</span>
          </button>
        )}

        {readMore && (
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-gray-500">
            Whether you&apos;re a hobbyist upgrading from a smartphone or a professional looking for a reliable backup body, our range covers every need and budget. All cameras come with detailed condition reports, accurate shutter counts, and are covered by our comprehensive warranty program. We ship across Europe with fast delivery and easy 14-day returns for online purchases.
          </p>
        )}
      </div>

      {/* Subcategory tiles */}
      <div className="relative mb-7">
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 z-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-1 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {subcategories.map(sc => (
            <Link
              key={sc.href}
              href={sc.href}
              className={cn(
                'flex w-[140px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border bg-white transition-all duration-200 hover:shadow-md',
                sc.active
                  ? 'border-2 border-[#E8692A] shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              style={{ height: 140 }}
            >
              <div className={cn(
                'flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-lg',
                sc.image ? 'bg-gray-50' : 'bg-[#1a1a2e]'
              )}>
                {sc.image ? (
                  <Image
                    src={sc.image}
                    alt={sc.label}
                    width={60}
                    height={60}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-10 w-10 text-white" strokeWidth={1.5} />
                )}
              </div>
              <span className="text-center text-[13px] font-semibold leading-tight">{sc.label}</span>
              <span className="text-[11px] text-gray-400">{sc.count} products</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 z-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Filter grid (MPB-style) */}
      <div className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
        {allFilters.map(f => {
          const activeCount = filterStateMap[f].selected.length;
          const hasActive = activeCount > 0;
          return (
            <Popover key={f}>
              <PopoverTrigger
                className={cn(
                  'flex w-full items-center justify-between whitespace-nowrap rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] font-medium shadow-sm transition-all hover:shadow-md',
                  hasActive
                    ? 'border-[#E8692A] bg-orange-50 text-gray-900 shadow-orange-100'
                    : 'bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                <span>{f}{hasActive ? ` (${activeCount})` : ''}</span>
                <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 text-gray-400" />
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-1.5" align="start">
                <div className="max-h-[320px] overflow-y-auto">
                  {filterOptions[f]?.map(option => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={filterStateMap[f].selected.includes(option)}
                        onCheckedChange={() => { filterStateMap[f].toggle(option); setCurrentPage(1); }}
                        className="data-checked:border-[#E8692A] data-checked:bg-[#E8692A]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {/* VAT-only badge */}
      {typeof window !== 'undefined' && sessionStorage.getItem('btw_only') === '1' && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/60 px-3.5 py-2 text-[13px] text-blue-600">
          <CreditCard className="h-3.5 w-3.5" />
          <span className="font-semibold">Showing VAT reclaimable products only</span>
          <span className="text-gray-500 font-normal">— margin scheme products are hidden</span>
          <button
            onClick={() => { sessionStorage.removeItem('btw_only'); window.location.reload(); }}
            className="ml-auto text-sm font-semibold text-blue-600 hover:text-blue-800"
          >&times;</button>
        </div>
      )}

      {/* Results bar + sort */}
      <div className="mb-4 flex items-center justify-between border-y border-gray-200 py-3">
        <div className="flex items-center gap-3 text-[13px] text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredSortedCameras.length}</strong> of {inStockCameras.length} results
          </span>
          {totalActiveFilters > 0 && (
            <button
              onClick={() => { clearAllFilters(); setCurrentPage(1); }}
              className="font-semibold text-[#E8692A] underline hover:text-[#D15A20]"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-gray-500">Sort by:</span>
          <Select value={sortBy} onValueChange={(v: string | null) => { if (v) { setSortBy(v); setCurrentPage(1); } }}>
            <SelectTrigger className="h-auto w-auto border-none bg-transparent p-0 text-[13px] font-semibold shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">relevance</SelectItem>
              <SelectItem value="price-low">price low to high</SelectItem>
              <SelectItem value="price-high">price high to low</SelectItem>
              <SelectItem value="newest">newest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product grid */}
      {filteredSortedCameras.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="mb-2 text-base font-semibold">No cameras match your filters</p>
          <p className="text-sm">Try removing some filters to see more results.</p>
        </div>
      ) : (
        <>
          <ProductGrid products={firstHalf} onQuickView={setQuickViewId} />

          {secondHalf.length > 0 && (
            <>
              {/* USP trust band */}
              <div className="my-6 flex flex-wrap justify-center gap-6 border-y border-gray-200 py-7 md:gap-8">
                {['12-month warranty', 'Professionally inspected', 'Free shipping from \u20AC50', '14-day returns'].map(text => (
                  <div key={text} className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-[#E8692A]" />
                    {text}
                  </div>
                ))}
              </div>

              <ProductGrid products={secondHalf} onQuickView={setQuickViewId} />
            </>
          )}
        </>
      )}

      {/* Pagination */}
      <div className="my-8 flex items-center justify-center gap-1">
        <button
          onClick={() => {
            if (currentPage > 1) { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
          disabled={currentPage <= 1}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
            currentPage <= 1
              ? 'cursor-default border-gray-200 text-gray-300'
              : 'border-gray-200 text-gray-700 hover:border-gray-400'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors',
              page === currentPage
                ? 'border-[#E8692A] bg-[#E8692A] font-semibold text-white'
                : 'border-gray-200 text-gray-700 hover:border-gray-400'
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => {
            if (currentPage < totalPages) { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
          disabled={currentPage >= totalPages}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
            currentPage >= totalPages
              ? 'cursor-default border-gray-200 text-gray-300'
              : 'border-gray-200 text-gray-700 hover:border-gray-400'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <span className="ml-3 text-[13px] text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* OOS CTA */}
      <div className="mt-4 border-t border-gray-200 py-8 text-center">
        <p className="mb-4 text-[15px] text-gray-500">
          Looking for a model that&apos;s currently unavailable?
        </p>
        <Link
          href="/cameras/out-of-stock"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#E8692A] px-7 py-3 text-sm font-semibold text-[#E8692A] transition-colors hover:bg-[#E8692A] hover:text-white"
        >
          <Bell className="h-4 w-4" />
          View out of stock &amp; set alerts
        </Link>
      </div>

      {/* SEO text block */}
      <div className="mt-4 border-t border-gray-200 py-8">
        <h2 className="mb-3 text-xl font-bold">Buy Used Cameras Online</h2>
        <div className="max-w-3xl text-sm leading-[1.8] text-gray-500">
          <p>
            At Camera-tweedehands.nl, we offer one of Europe&apos;s largest selections of professionally inspected second-hand cameras.
            Whether you&apos;re searching for a{' '}
            <Link href="/cameras/mirrorless" className="font-semibold text-[#E8692A] hover:underline">mirrorless camera</Link>,
            a classic <Link href="/cameras/dslr" className="font-semibold text-[#E8692A] hover:underline">DSLR</Link>,
            or a high-end <Link href="/cameras/medium-format" className="font-semibold text-[#E8692A] hover:underline">medium format</Link> system,
            every camera in our inventory has been thoroughly tested and graded by our expert team.
          </p>
          <p className="mt-3">
            Popular choices include the{' '}
            <Link href="/cameras?brand=sony" className="font-semibold text-[#E8692A] hover:underline">Sony Alpha</Link> series for versatile mirrorless performance,{' '}
            <Link href="/cameras?brand=canon" className="font-semibold text-[#E8692A] hover:underline">Canon EOS R</Link> bodies for outstanding autofocus,
            and <Link href="/cameras?brand=nikon" className="font-semibold text-[#E8692A] hover:underline">Nikon Z</Link> cameras for exceptional image quality.
            For medium format enthusiasts, we carry{' '}
            <Link href="/cameras?brand=hasselblad" className="font-semibold text-[#E8692A] hover:underline">Hasselblad</Link> and{' '}
            <Link href="/cameras?brand=fujifilm" className="font-semibold text-[#E8692A] hover:underline">Fujifilm GFX</Link> systems at competitive prices.
          </p>
          <p className="mt-3">
            Every camera comes with a detailed condition report, accurate shutter count, and our comprehensive 12-month warranty.
            We offer fast shipping across Europe, secure payments, and easy 14-day returns for online purchases.
            Browse our <Link href="/cameras/compact" className="font-semibold text-[#E8692A] hover:underline">compact cameras</Link>,{' '}
            <Link href="/cameras/rangefinder" className="font-semibold text-[#E8692A] hover:underline">rangefinders</Link>, or{' '}
            <Link href="/cameras/analog-film" className="font-semibold text-[#E8692A] hover:underline">analog film cameras</Link> to find the perfect match for your photography.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Frequently asked questions</h2>
        <Accordion className="w-full">
          {[
            { q: 'What warranty do your cameras come with?', a: 'Every camera comes with a 12-month Camify warranty covering manufacturing defects and mechanical failures. This includes shutter mechanisms, autofocus systems, and sensor issues.' },
            { q: 'How do you determine the condition grade?', a: 'Our team inspects every camera using a standardized checklist. We check cosmetic condition, sensor cleanliness, autofocus accuracy, shutter mechanism, and all buttons and dials. The grade reflects the overall state of the camera.' },
            { q: 'Can I return a camera if I\'m not satisfied?', a: 'Yes. For online purchases you have 14 days after delivery to return the camera, no questions asked. The item must be in the same condition as received. We\'ll arrange a prepaid return label.' },
            { q: 'Are shutter counts accurate?', a: 'Yes. We read shutter counts directly from the camera\'s EXIF data using professional diagnostic tools. For Canon, we use manufacturer service software. The exact count is shown on every listing.' },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-gray-200">
              <AccordionTrigger className="py-4 text-[15px] font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-gray-500">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </div>
  );
}
