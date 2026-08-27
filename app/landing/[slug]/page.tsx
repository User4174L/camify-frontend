import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANDING_CONTENT } from '@/data/landing-content';
import LandingClient from './landing-client';
import BannerOpties from '../banner-opties-view';

/**
 * Landingspagina (#387/#534): een categoriepagina met een eigen smalle
 * banner en SEO-tekst onderaan. Inhoud komt per slug uit het
 * content-werkbestand (data/landing-content.ts spiegelt dat bestand).
 */

export function generateStaticParams() {
  return [...Object.keys(LANDING_CONTENT), 'banner-opties'].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'banner-opties') return { title: 'Bannerformat — opties', robots: { index: false } };
  const c = LANDING_CONTENT[slug];
  if (!c) return {};
  return { title: c.seo_title, description: c.seo_description, robots: { index: false } };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'banner-opties') return <BannerOpties />;
  const c = LANDING_CONTENT[slug];
  if (!c) notFound();
  return <LandingClient content={c} />;
}
