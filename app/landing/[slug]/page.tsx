import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANDING_CONTENT } from '@/data/landing-content';
import LandingClient from './landing-client';

/**
 * Landingspagina (#387/#534): identiek aan een categoriepagina (H1 + intro,
 * filters, grid) met alleen SEO-tekst + FAQ onderaan als extra. Inhoud komt
 * per slug uit het content-werkbestand (data/landing-content.ts spiegelt dat).
 */

export function generateStaticParams() {
  return Object.keys(LANDING_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = LANDING_CONTENT[slug];
  if (!c) return {};
  return { title: c.seo_title, description: c.seo_description, robots: { index: false } };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = LANDING_CONTENT[slug];
  if (!c) notFound();
  return <LandingClient content={c} />;
}
