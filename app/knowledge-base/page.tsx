'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface KBArticle {
  id: string;
  brand: string;
  title: string;
  desc: string;
  tags: string[];
  content: string[];
}

const kbTopics: KBArticle[] = [
  {
    id: 'shutter-count',
    brand: 'Guide',
    title: 'How to Check Shutter Count on Any Camera',
    desc: 'Learn the exact methods to find shutter count on Sony, Canon, Nikon, and Fujifilm cameras',
    tags: ['Guide', 'Buying'],
    content: [
      'Shutter count is one of the most important metrics when buying a used camera. It tells you how many times the mechanical shutter has fired, giving you a rough idea of how much life the camera has left. Think of it like the odometer on a car — it\'s not the whole story, but it\'s a great starting point.',
      'For Sony cameras, checking the shutter count is straightforward. Take a photo with the camera and upload the JPEG file to a free tool like Camera Shutter Count (camerashuttercount.com). The shutter actuations are embedded in the EXIF data of every image. This works for most Sony Alpha bodies including the A7 series, A6000 series, and A9 models.',
      'Nikon makes it equally easy. The shutter count is stored in the EXIF data of every photo, so the same online tools work perfectly. Just upload a recent, unedited JPEG straight from the camera. For Canon, it\'s a bit trickier — Canon doesn\'t store shutter count in standard EXIF data. You\'ll need dedicated software like EOSInfo (for older models) or the Magic Lantern firmware hack. At Camify, we use Canon\'s official service software to pull accurate counts for every Canon body we sell.',
      'Fujifilm cameras also embed the count in EXIF data, so online tools work well. As a general rule, entry-level DSLRs and mirrorless cameras are rated for around 100,000–150,000 actuations, while professional bodies can handle 300,000–500,000+. A camera at 30% of its rated shutter life is considered low usage. At Camify, we list the exact shutter count on every camera product page so there are never any surprises.',
    ],
  },
  {
    id: 'condition-grades',
    brand: 'Guide',
    title: 'Understanding Camera Condition Grades',
    desc: 'What As New, Excellent, Good, Used, and Heavily Used actually mean — with real examples',
    tags: ['Guide', 'Buying'],
    content: [
      'When you buy a used camera, condition grading is everything. But vague labels like "good" or "excellent" can mean different things depending on who\'s selling. At Camify, we use a standardized five-tier grading system so you always know exactly what to expect. Every grade is backed by real product photos showing the actual item you\'ll receive.',
      '"As New" means the item looks and functions like it just came out of the box. There are virtually no signs of use — no marks on the body, no scratches on the screen, and an extremely low shutter count. These are often cameras that were purchased but barely used. "Excellent" means there may be one or two very faint cosmetic marks that you\'d have to look closely to notice, but the camera looks and performs beautifully. This is the sweet spot for most buyers — near-perfect gear at a meaningful discount.',
      '"Good" is our most common grade and represents a camera that\'s been used regularly but well cared for. You\'ll see light signs of wear — small marks on the body, maybe a faint hairline on the LCD — but nothing that affects functionality or image quality. Everything works perfectly. "Used" means the camera shows clear signs of regular use: visible wear on high-contact areas like the grip, dial markings, or body edges. Despite the cosmetic wear, the camera is fully functional and takes great photos.',
      '"Heavily Used" is reserved for items with significant cosmetic wear — think brassing on metal parts, visible scratches, or worn rubber grips. These cameras still work 100% and have been tested by our technicians, but they\'ve clearly lived a full life. They\'re priced accordingly and are a great option if you prioritize function over appearance. No matter the grade, every item we sell has been professionally inspected and tested.',
    ],
  },
  {
    id: 'mirrorless-vs-dslr',
    brand: 'Comparison',
    title: 'Mirrorless vs DSLR: Which Should You Buy Used?',
    desc: 'A practical comparison guide to help you decide between mirrorless and DSLR systems',
    tags: ['Comparison', 'Buying'],
    content: [
      'This is one of the most common questions we get at Camify, and the honest answer is: it depends on what you shoot and how you shoot it. Both mirrorless and DSLR cameras can produce stunning images — the "best" choice is really about which trade-offs matter most to you. Let\'s break it down.',
      'Mirrorless cameras have a lot going for them on the used market right now. They\'re typically smaller and lighter, offer real-time exposure preview through the electronic viewfinder (EVF), and usually have superior video capabilities. Autofocus systems on modern mirrorless bodies (especially Sony and Canon\'s eye-AF) are genuinely remarkable. The downside? Battery life tends to be shorter than DSLRs, and if you\'re buying older mirrorless models (say, first-gen Sony A7), the autofocus and EVF experience may feel dated.',
      'DSLRs, on the other hand, offer incredible value on the used market right now. Because many photographers are switching to mirrorless, prices on DSLR bodies and lenses have dropped significantly — which means you can get professional-grade gear at very accessible prices. A used Nikon D750 or Canon 5D Mark III still delivers exceptional image quality. DSLRs also have superior battery life (often 800–1,000+ shots per charge), a massive selection of affordable lenses, and an optical viewfinder that some photographers simply prefer.',
      'Our recommendation? If you\'re buying your first serious camera and plan to keep it for years, mirrorless is the future — that\'s where all the new lenses and innovation are happening. If you want the best bang for your buck right now and don\'t mind buying into a mature system, a used DSLR gives you astonishing value. At Camify, we carry both, and our team is always happy to help you figure out what\'s right for your needs.',
    ],
  },
  {
    id: 'best-full-frame-under-1500',
    brand: 'Guide',
    title: 'Best Entry-Level Full Frame Cameras Under €1,500',
    desc: 'Our top picks for affordable full-frame cameras on the used market',
    tags: ['Guide', 'Buying'],
    content: [
      'Full frame used to mean "expensive," but the used market has changed that completely. Today, you can get a fantastic full-frame camera body for well under €1,500 — and some of the best options are cameras that were flagship models just a few years ago. Here are our top picks.',
      'The Sony A7 III is arguably the best all-rounder in this price range. With a 24.2MP sensor, excellent autofocus with eye-AF, 10fps burst shooting, and great video capabilities, it does everything well. Used prices typically sit between €900 and €1,200 depending on condition and shutter count. If you want to stay in the Sony ecosystem, the A7 II is an even more affordable entry point around €500–700, though you\'ll miss out on the significantly better autofocus and battery life of the Mark III.',
      'For Canon shooters, the EOS RP is a mirrorless full-frame body that can be found used for around €600–800. It\'s compact, lightweight, and gives you access to Canon\'s growing RF lens lineup (plus EF lenses with an adapter). The Canon 6D Mark II is another great DSLR option around €600–750 — its image quality is excellent and the fully articulating screen is a nice bonus. Nikon fans should look at the Z5, which offers in-body stabilization, dual card slots, and solid autofocus for around €800–1,100 used. The Nikon D750, a DSLR legend, can now be found for €500–700 and still delivers professional results.',
      'When shopping in this price range, pay attention to shutter count (aim for under 50,000 for the best longevity), check for sensor dust or scratches, and make sure all buttons, dials, and ports work. At Camify, we test and grade every camera thoroughly, so you can buy with confidence. Any of these cameras will serve you well for years to come.',
    ],
  },
  {
    id: 'inspect-used-lens',
    brand: 'Tips',
    title: 'How to Inspect a Used Lens Before Buying',
    desc: 'Essential checks for glass clarity, autofocus, image stabilization, and more',
    tags: ['Tips', 'Buying'],
    content: [
      'Buying a used lens can save you a lot of money, but it\'s important to know what to look for. A lens with internal issues might look perfectly fine on the outside but produce soft images or unreliable autofocus. Here\'s what our technicians check on every lens that comes through Camify — and what you should look for too.',
      'Start with the glass elements. Hold the lens up to a bright light and look through it from both ends. You\'re checking for fungus (looks like spiderweb-like tendrils), haze (a cloudy, milky coating), and scratches. Small dust particles inside the lens are completely normal and almost never affect image quality. Fungus, however, can spread and etch into the coating over time, so avoid lenses with any sign of it. Haze can reduce contrast and cause flare. A few light cleaning marks on the front element are usually harmless, but deep scratches on the rear element can affect image quality.',
      'Next, test the autofocus. Mount the lens on a camera and focus on different subjects at various distances. Listen for unusual grinding or clicking sounds. The AF should be smooth, accurate, and consistent. Try it in both good light and lower light conditions. If the lens has image stabilization (IS, VR, OIS, or OSS depending on brand), turn it on and check that the viewfinder image stabilizes when you half-press the shutter. You should hear a quiet hum — any loud rattling or clicking is a red flag.',
      'Finally, check the physical condition. Rotate the zoom and focus rings — they should be smooth with no catching or excessive looseness. Inspect the mount for signs of wear or cross-threading. Look at the contacts (the gold pins on the mount) for corrosion or scratches. Check that the filter thread isn\'t dented, as this can make it impossible to attach filters. At Camify, we document all of this in our product listings with real photos and detailed condition notes, so you can make an informed decision.',
    ],
  },
  {
    id: 'sensor-sizes',
    brand: 'Guide',
    title: 'Sensor Size Explained: Full Frame vs APS-C vs Micro Four Thirds',
    desc: 'Understanding how sensor size affects image quality, lens choice, and camera size',
    tags: ['Guide', 'Comparison'],
    content: [
      'Sensor size is one of the most fundamental differences between camera systems, and it affects everything from image quality to lens size and price. If you\'re shopping for a used camera, understanding sensor sizes will help you make a much smarter purchase. Let\'s demystify the three most common formats.',
      'Full frame sensors (36 x 24mm) are the largest commonly used sensor size in consumer cameras. They capture more light, which means better performance in low-light conditions, more dynamic range, and a shallower depth of field (that beautiful background blur). Full frame cameras and lenses tend to be larger and heavier, and they\'re generally more expensive — though the used market has made them much more accessible. Popular full frame systems include Sony A7 series, Canon EOS R series, and Nikon Z series.',
      'APS-C sensors (roughly 23 x 15mm) apply a 1.5x crop factor (1.6x for Canon). This means a 50mm lens on an APS-C camera gives you a field of view equivalent to 75mm on full frame. This is actually an advantage for wildlife and sports photographers, as you get extra "reach" from your lenses. APS-C cameras are generally smaller, lighter, and more affordable, with excellent image quality. Great used APS-C options include the Fujifilm X-T series, Sony A6000 series, and Nikon D7500.',
      'Micro Four Thirds sensors (17 x 13mm) have a 2x crop factor and are used by Olympus (OM System) and Panasonic. The biggest advantage is the incredibly compact and lightweight camera and lens system — ideal for travel and hiking. The lens selection is outstanding, and modern M43 sensors produce excellent image quality up to around ISO 3200. Where they fall behind is in extreme low-light performance and maximum background blur compared to larger sensors. For many photographers, the portability trade-off is absolutely worth it.',
    ],
  },
  {
    id: 'top-5-checks',
    brand: 'Tips',
    title: 'Top 5 Things to Check When Buying a Used Camera',
    desc: 'A quick checklist so you never miss a critical issue when buying pre-owned gear',
    tags: ['Tips', 'Buying'],
    content: [
      'Buying a used camera doesn\'t have to be risky — you just need to know what to look for. Whether you\'re buying from Camify (where we do these checks for you) or elsewhere, here are the five most important things to verify before spending your money.',
      'First, check the shutter count. This tells you how many photos the camera has taken and is the best indicator of mechanical wear. Entry-level cameras are rated for about 100,000–150,000 actuations, while pro bodies can handle 300,000+. A camera with 20,000 shots is barely broken in; one with 180,000 is nearing the end of its rated life. Second, inspect the sensor. Set the camera to its smallest aperture (f/22), take a photo of a plain white surface, and zoom in on the image. Dark spots indicate dust on the sensor — minor dust can be cleaned, but stubborn spots might indicate a deeper issue.',
      'Third, test the autofocus system. Use single-point AF and focus on a high-contrast target at different distances. The camera should lock focus quickly and accurately. Also test continuous AF by tracking a moving subject. Inconsistent or slow AF can indicate a worn-out motor or misaligned sensor. Fourth, examine the LCD screen and viewfinder. Look for dead pixels (show up as bright dots on a black screen), scratches, or discoloration. On mirrorless cameras, check the EVF for any burn-in or uneven brightness.',
      'Fifth, check all the physical controls and ports. Press every button, rotate every dial, and make sure they all respond correctly. Open the battery door, memory card slot, and port covers — check for damage or loose hinges. Pop-up flashes should deploy smoothly. Hot shoe contacts should be clean. These little things are easy to overlook but expensive to repair. At Camify, every camera goes through a comprehensive 30-point inspection covering all of these areas and more, so you can shop with confidence.',
    ],
  },
  {
    id: 'cleaning-maintenance',
    brand: 'Maintenance',
    title: 'How to Clean and Maintain Your Camera Gear',
    desc: 'Practical tips to keep your cameras and lenses performing at their best for years',
    tags: ['Maintenance', 'Tips'],
    content: [
      'Taking good care of your camera gear isn\'t just about keeping it looking nice — it directly affects performance, image quality, and resale value. The good news is that basic camera maintenance is easy and doesn\'t require expensive tools. Here\'s how to keep your gear in top shape.',
      'For your camera body, start with a rocket blower (the rubber bulb kind) to blow away loose dust and debris. Never use compressed air cans — they can spray propellant onto your sensor. Wipe down the body with a slightly damp microfiber cloth to remove oils and grime. For the sensor, use the camera\'s built-in sensor cleaning function regularly. If you notice persistent dust spots in your photos, a sensor swab kit with proper cleaning fluid is safe to use — just follow the instructions carefully and match the swab size to your sensor format.',
      'Lens care is equally important. Always use a rear lens cap and a body cap when your lens is off the camera. A UV or clear protective filter on the front element is cheap insurance against scratches. To clean the front and rear elements, use a rocket blower first to remove particles, then a lens pen or microfiber cloth with a drop of lens cleaning fluid. Always clean in gentle circular motions from the center outward. Never use your shirt, tissue paper, or household glass cleaner — these can scratch the lens coating.',
      'Storage matters more than most people realize. Keep your gear in a dry environment — humidity is the number one enemy, as it promotes fungus growth inside lenses. A simple dry cabinet or airtight container with silica gel packets works wonders. If you live in a humid climate, this is non-negotiable. When traveling, always use a padded camera bag and remove batteries during long-term storage to prevent corrosion. Following these simple practices will keep your gear performing — and holding its value — for years to come.',
    ],
  },
];

const brandFilters = ['All', 'Guide', 'Tips', 'Comparison', 'Maintenance'];

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
            {article.content.map((paragraph, idx) => (
              <p key={idx} style={{ marginTop: idx > 0 ? 16 : 0 }}>{paragraph}</p>
            ))}
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

      <section style={{ background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 50%, #1E2133 100%)', color: '#fff', borderRadius: 'var(--rl)', padding: '48px 40px', marginBottom: 32, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, left: -20, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)' }} />
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 16, position: 'relative' }}>Knowledge Base</h1>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
          Browse our collection of guides and articles about buying, selling, and maintaining camera equipment. From understanding condition grades to choosing the right lens — we&apos;ve got you covered.
        </p>
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
