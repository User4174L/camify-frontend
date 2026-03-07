'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const kbTopics = [
  { id: 'canon-serial', brand: 'Canon', title: 'Canon Serial Number Lookup', desc: 'How to find and decode your Canon camera serial number', tags: ['Canon', 'Serial'] },
  { id: 'nikon-serial', brand: 'Nikon', title: 'Nikon Serial Number Lookup', desc: 'Find your Nikon serial number and check production date', tags: ['Nikon', 'Serial'] },
  { id: 'sony-naming', brand: 'Sony', title: 'Sony Lens Naming Conventions', desc: 'Understanding Sony lens names: G, GM, ZA, OSS explained', tags: ['Sony', 'Lenses'] },
  { id: 'shutter-count', brand: 'General', title: 'Understanding Shutter Count', desc: 'What shutter count means and how it affects camera value', tags: ['General', 'Buying'] },
  { id: 'sensor-cleaning', brand: 'Maintenance', title: 'Sensor Cleaning Guide', desc: 'Step-by-step guide to safely clean your camera sensor', tags: ['Maintenance', 'Cleaning'] },
  { id: 'lens-care', brand: 'Maintenance', title: 'Lens Maintenance and Care', desc: 'Tips for keeping your lenses in top condition', tags: ['Maintenance', 'Lenses'] },
  { id: 'mount-adapters', brand: 'Compatibility', title: 'Mount Adapter Compatibility Guide', desc: 'Which adapters work with which camera and lens combinations', tags: ['Compatibility', 'Adapters'] },
  { id: 'fuji-xtrans', brand: 'Fujifilm', title: 'Fujifilm X-Trans Sensor Guide', desc: 'Understanding the unique X-Trans sensor technology', tags: ['Fujifilm', 'Sensor'] },
  { id: 'memory-cards', brand: 'Compatibility', title: 'Memory Card Compatibility', desc: 'Which memory cards work with your camera', tags: ['Compatibility', 'Memory'] },
  { id: 'leica-serial', brand: 'Leica', title: 'Leica Serial Number Lookup', desc: 'Decode your Leica serial number to find production year', tags: ['Leica', 'Serial'] },
  { id: 'battery-compat', brand: 'Compatibility', title: 'Battery Compatibility Guide', desc: 'Find the right battery for your camera model', tags: ['Compatibility', 'Battery'] },
  { id: 'calibration', brand: 'General', title: 'Camera Calibration Basics', desc: 'When and how to calibrate your camera and lenses', tags: ['General', 'Calibration'] },
];

const brandFilters = ['All', 'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'General', 'Maintenance', 'Compatibility'];

export default function KnowledgeBasePage() {
  const [activeBrand, setActiveBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filtered = kbTopics.filter(t => {
    const brandMatch = activeBrand === 'All' || t.brand === activeBrand;
    const searchMatch = searchQuery.length === 0 || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return brandMatch && searchMatch;
  });

  if (openArticle) {
    const article = kbTopics.find(t => t.id === openArticle);
    if (!article) return null;

    return (
      <div className="container">
        <Breadcrumb items={[
          { label: 'Knowledge Base', href: '/knowledge-base' },
          { label: article.title },
        ]} />
        <button onClick={() => setOpenArticle(null)} style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          Back to Knowledge Base
        </button>
        <div style={{ maxWidth: 720, paddingBottom: 64 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{article.brand}</span>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, marginTop: 4 }}>{article.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, marginBottom: 24 }}>{article.desc}</p>
          <div style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
            <p>This is a placeholder article. In the full version, this would contain detailed information about {article.title.toLowerCase()}.</p>
            <p style={{ marginTop: 16 }}>Our knowledge base is constantly updated with new articles and guides to help you get the most out of your camera equipment.</p>
          </div>
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Related Articles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {kbTopics.filter(t => t.id !== openArticle).slice(0, 4).map(t => (
                <div key={t.id} onClick={() => setOpenArticle(t.id)} style={{
                  padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--rl)',
                  cursor: 'pointer', transition: 'all .2s',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>{t.brand}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{t.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Knowledge Base' }]} />

      <section style={{ background: 'var(--dark)', color: '#fff', borderRadius: 'var(--rl)', padding: '48px 40px', marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 16 }}>Knowledge Base</h1>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
      </section>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {brandFilters.map(b => (
          <button
            key={b}
            className={`filter-tab${activeBrand === b ? ' filter-tab--active' : ''}`}
            onClick={() => setActiveBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingBottom: 64 }}>
        {filtered.map(topic => (
          <div
            key={topic.id}
            onClick={() => setOpenArticle(topic.id)}
            style={{
              padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--rl)',
              cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{topic.brand}</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 4, marginBottom: 6 }}>{topic.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5, marginBottom: 12 }}>{topic.desc}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {topic.tags.map(tag => (
                <span key={tag} style={{ padding: '3px 10px', background: 'var(--surface)', borderRadius: 50, fontSize: 11, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
