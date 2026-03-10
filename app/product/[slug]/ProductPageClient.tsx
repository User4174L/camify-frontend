'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuickView from '@/components/product/QuickView';
import { products, type Product, type ProductVariant } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { assetPath } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  SEO texts per product slug                                        */
/* ------------------------------------------------------------------ */
const seoTexts: Record<string, string[]> = {
  'nikon-z8': [
    'The Nikon Z8 packs the core technology of Nikon\'s flagship Z9 into a smaller, lighter body — making it one of the most capable all-round mirrorless cameras available today. With a 45.7MP stacked CMOS sensor and the EXPEED 7 processor, it delivers fast burst shooting, reliable autofocus tracking across a wide range of subjects, and strong video performance up to 8K 60p and 4K 120p.',
    'Thanks to its compact form factor and deep grip, the Z8 feels at home in the hands of wildlife, sports, and event photographers who need speed without the bulk of a pro body. The sensor-shift VR system provides up to 6 stops of stabilisation, making it equally suited to handheld landscape and travel work.',
    'Buying a second-hand Nikon Z8 from Camera-tweedehands.nl means every unit has been inspected, graded, and covered by our 12-month warranty. Each listing includes the exact shutter count, a clear condition grade, and detailed photos — so you know precisely what you\'re getting.',
  ],
  'sony-a7-iv': [
    'The Sony A7 IV is widely regarded as the best all-round full-frame mirrorless camera of its generation. Built around a 33MP Exmor R sensor and the BIONZ XR processor, it delivers excellent stills quality, reliable real-time Eye AF for humans, animals, and birds, and advanced 4K 60p video with 10-bit 4:2:2 colour depth.',
    'Its 759-point phase-detection AF system covers roughly 94% of the frame, and the 5-axis in-body stabilisation provides up to 5.5 stops of shake reduction. Combined with a fully articulating screen, dual card slots (CFexpress Type A + SD), and a robust magnesium-alloy body, the A7 IV is a workhorse that adapts to almost any shooting scenario.',
    'Every pre-owned Sony A7 IV in our store has been thoroughly tested and graded. We list the exact shutter count, include detailed photos, and back each sale with a 12-month warranty — giving you confidence in your purchase.',
  ],
  'canon-eos-r5': [
    'The Canon EOS R5 set a new benchmark for hybrid mirrorless cameras when it launched. Its 45MP full-frame CMOS sensor, combined with the DIGIC X processor, enables blistering 20fps electronic shutter bursts and class-leading 8K RAW video recording. For stills shooters, the Dual Pixel CMOS AF II system with deep-learning subject detection is among the most sophisticated available.',
    'In-body image stabilisation works in tandem with IS-equipped RF lenses for up to 8 stops of correction, and the robust weather-sealed body can handle demanding conditions in the field. Dual card slots — CFexpress and SD UHS-II — provide flexible storage options for professionals.',
    'At Camera-tweedehands.nl, each used Canon EOS R5 is inspected by our technicians, graded transparently, and protected by a 12-month warranty. We list the shutter count and included accessories for every unit so there are no surprises.',
  ],
  'fujifilm-x-t4': [
    'The Fujifilm X-T4 combines a 26.1MP X-Trans CMOS 4 sensor with in-body image stabilisation (IBIS) for the first time in the X-T series — making it a significant upgrade over its predecessor. The X-Processor 4 enables fast burst shooting at up to 15fps with the mechanical shutter, while Fujifilm\'s renowned Film Simulation modes deliver stunning colour straight out of the camera.',
    'With a fully articulating touchscreen, 4K 60p video, and a classic analogue-style control layout, the X-T4 appeals to both photographers and videographers who value a tactile shooting experience. The compact APS-C body keeps the overall system light and portable.',
    'Every second-hand Fujifilm X-T4 we sell has been tested, graded, and comes with a 12-month warranty. Check the condition grade, shutter count, and included accessories in each listing — what you see is what you get.',
  ],
  'sony-fe-24-70mm-f28-gm': [
    'The Sony FE 24-70mm f/2.8 GM is the gold-standard professional zoom for Sony E-mount shooters. Its constant f/2.8 aperture delivers beautiful bokeh and low-light capability across the entire zoom range, while the G Master optical design ensures exceptional sharpness and minimal aberrations from corner to corner.',
    'Dust- and moisture-resistant construction, a customisable focus-hold button, and near-silent Direct Drive SSM autofocus make this lens equally at home in the studio and on location. Whether you\'re shooting weddings, portraits, or editorial work, the 24-70 GM is a lens that rarely leaves the bag.',
    'All pre-owned Sony lenses in our store are inspected for optical clarity, AF accuracy, and mechanical condition. Each listing details the included accessories and condition grade, and is covered by a 12-month warranty.',
  ],
  'canon-rf-24-70mm-f28-l-is-usm': [
    'The Canon RF 24-70mm f/2.8L IS USM brings optical image stabilisation to Canon\'s professional standard zoom for the first time. Combined with the EOS R system\'s IBIS, it delivers up to 7 stops of shake correction — a real advantage for handheld shooting in low light and video work.',
    'L-series build quality means a weather-sealed, dust-resistant barrel, while the Nano USM motor provides fast, virtually silent autofocus. Optically, it\'s one of the sharpest 24-70mm f/2.8 zooms on the market, with well-controlled chromatic aberration and pleasing rendering.',
    'Each second-hand Canon RF 24-70mm in our catalogue has been checked for optical and mechanical integrity, graded transparently, and comes with our 12-month warranty.',
  ],
  'sony-a7r-v': [
    'The Sony A7R V raises the bar for high-resolution mirrorless cameras with a 61MP back-illuminated Exmor R sensor and a dedicated AI processing unit that dramatically improves autofocus subject recognition. It can detect and track humans, animals, birds, insects, cars, trains, and aircraft with remarkable accuracy.',
    'For landscape and studio photographers, the level of detail captured by the 61MP sensor is extraordinary, while 8-stop IBIS and Pixel Shift Multi Shooting expand creative possibilities even further. On the video side, 8K 24p and 4K 60p recording with full pixel readout ensure the A7R V is no slouch for motion work either.',
    'Every pre-owned Sony A7R V in our store includes a detailed condition report, exact shutter count, and 12-month warranty — so you can invest in high-resolution imaging with full peace of mind.',
  ],
  'sony-a1': [
    'The Sony A1 is the ultimate do-everything mirrorless camera. A 50.1MP stacked Exmor RS sensor paired with dual BIONZ XR processors enables 30fps blackout-free burst shooting, 8K 30p video, and 4K 120p slow motion — all in a body that weighs just 737 grams.',
    'Its 759-point phase-detection AF system covers 92% of the frame and leverages real-time tracking with AI-based subject recognition. Whether you\'re photographing motorsport, wildlife, or a high-end commercial shoot, the A1 delivers uncompromising performance across the board.',
    'At Camera-tweedehands.nl, each used Sony A1 is fully inspected, graded, and backed by a 12-month warranty. Shutter count, accessories, and detailed condition notes are listed for every unit.',
  ],
  'nikon-zf': [
    'The Nikon Zf pairs a 24.5MP full-frame sensor with a retro-inspired design that echoes Nikon\'s iconic FM2 film camera. Beneath the heritage styling lies modern technology: EXPEED 7 processing, a 299-point hybrid AF system, 4K 30p video, and an impressive 8-stop sensor-shift VR system.',
    'Dedicated analogue dials for shutter speed, ISO, and exposure compensation give the Zf a uniquely tactile shooting experience that appeals to enthusiasts and street photographers alike. The deep grip option keeps it comfortable for longer lenses too.',
    'Every second-hand Nikon Zf in our store has been thoroughly tested, graded transparently, and covered by a 12-month warranty. We include the shutter count and list all accessories — no surprises.',
  ],
  'dji-mavic-2-pro': [
    'The DJI Mavic 2 Pro is a foldable drone built around a 1-inch Hasselblad L1D-20c camera sensor, capable of capturing 20MP stills and 4K 30p video with 10-bit Dlog-M colour. Its adjustable aperture (f/2.8\u2013f/11) gives pilots greater creative control over depth of field and exposure than most consumer drones.',
    'With up to 31 minutes of flight time, OcuSync 2.0 transmission, and omnidirectional obstacle sensing, the Mavic 2 Pro remains a reliable choice for aerial photography and videography — especially at second-hand prices.',
    'When this product becomes available again, it will be fully inspected and covered by our 12-month warranty. Create an alert to be notified the moment a unit arrives.',
  ],
  'hasselblad-x2d-100c': [
    'The Hasselblad X2D 100C is a 100-megapixel medium-format mirrorless camera that combines extraordinary image quality with a surprisingly portable body. Its 44 x 33mm BSI CMOS sensor captures an immense level of detail and dynamic range, while the in-body 7-stop image stabilisation allows handheld shooting in conditions that would typically require a tripod.',
    'Built with Scandinavian precision, the X2D features a 3.6-inch OLED touchscreen, a 5.76M-dot EVF, and a 1TB built-in SSD alongside a CFexpress Type B slot. It is the ultimate tool for landscape, fashion, and fine-art photographers who demand the highest resolving power.',
    'Each pre-owned Hasselblad X2D 100C in our store has been meticulously inspected. We list the shutter count, included accessories, and condition grade, and every sale is protected by our 12-month warranty.',
  ],
  'sony-fe-70-200mm-f28-gm-oss-ii': [
    'The Sony FE 70-200mm f/2.8 GM OSS II is one of the lightest and sharpest professional telephoto zooms ever made. At just 1,045 grams it is roughly 29% lighter than its predecessor, yet delivers improved resolution, faster XD Linear Motor autofocus, and enhanced optical stabilisation.',
    'Four XD Linear Motors provide lightning-fast, near-silent focusing that easily keeps up with fast-moving subjects — making it ideal for sports, wildlife, weddings, and event photography. The constant f/2.8 aperture produces gorgeous background separation across the entire zoom range.',
    'All pre-owned Sony GM lenses in our store are inspected for optical and mechanical integrity, graded transparently, and covered by a 12-month warranty.',
  ],
};

/* ------------------------------------------------------------------ */
/*  FAQ items per product slug                                        */
/* ------------------------------------------------------------------ */
interface FaqItem { q: string; a: string }

const productFaqs: Record<string, FaqItem[]> = {
  'nikon-z8': [
    { q: 'What warranty does a second-hand Nikon Z8 come with?', a: 'Every pre-owned Nikon Z8 sold by Camera-tweedehands.nl includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered. This gives you the same peace of mind as buying new.' },
    { q: 'How is the shutter count determined?', a: 'We read the shutter actuation count directly from the camera\'s EXIF data using professional diagnostic tools. The count listed on each variant is accurate at the time of intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Can I use my Nikon F lenses on the Nikon Z8?', a: 'Yes — with the Nikon FTZ or FTZ II adapter, most Nikon F-mount lenses work on the Z8 with full autofocus and metering support. Native Z-mount lenses will give you the best optical performance.' },
  ],
  'sony-a7-iv': [
    { q: 'What warranty does a second-hand Sony A7 IV come with?', a: 'All pre-owned Sony A7 IV units include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We read the shutter count from the camera\'s internal counter using professional diagnostic software. The figure listed is accurate at the time of intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Can I use my Sony A-mount lenses on the Sony A7 IV?', a: 'Yes — with the Sony LA-EA5 adapter, most A-mount lenses work on the A7 IV with phase-detection AF. Native E-mount lenses will always deliver the best experience.' },
  ],
  'canon-eos-r5': [
    { q: 'What warranty does a second-hand Canon EOS R5 come with?', a: 'Every pre-owned Canon EOS R5 includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We use Canon\'s service tools and EXIF analysis to read the exact shutter actuation count before listing each unit.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Can I use my Canon EF lenses on the EOS R5?', a: 'Yes — Canon\'s EF-EOS R adapter allows full use of EF and EF-S lenses with complete autofocus and IS functionality. Many photographers use the adapter seamlessly for years.' },
  ],
  'fujifilm-x-t4': [
    { q: 'What warranty does a second-hand Fujifilm X-T4 come with?', a: 'All pre-owned Fujifilm X-T4 units include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We extract the shutter count from the camera\'s EXIF data using professional tools. The listed count is accurate at the time of intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Is the Fujifilm X-T4 weather-sealed?', a: 'Yes — the X-T4 features weather and dust resistance with sealing at over 60 points on the body. Paired with a WR-designated Fujifilm lens, it handles light rain and dusty conditions well.' },
  ],
  'sony-fe-24-70mm-f28-gm': [
    { q: 'What warranty does a second-hand Sony 24-70mm GM come with?', a: 'Every pre-owned Sony lens includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How do you check optical quality?', a: 'We inspect every lens for dust, fungus, haze, scratches, and coating damage using a professional loupe and collimated light source. Only lenses that pass our standards are listed.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Is this lens compatible with APS-C Sony cameras?', a: 'Yes — the FE 24-70mm f/2.8 GM works on all Sony E-mount cameras, including APS-C models like the A6700. On APS-C it provides an equivalent 36-105mm field of view.' },
  ],
  'canon-rf-24-70mm-f28-l-is-usm': [
    { q: 'What warranty does a second-hand Canon RF 24-70mm come with?', a: 'All pre-owned Canon lenses include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How do you check optical quality?', a: 'Each lens is inspected for dust, fungus, haze, and scratches using a professional loupe. Only units meeting our quality standards are listed for sale.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Does this lens have image stabilisation?', a: 'Yes — the Canon RF 24-70mm f/2.8L IS USM features optical IS, providing up to 5 stops of stabilisation on its own. Combined with an IBIS-equipped body like the EOS R5, it achieves up to 7 stops.' },
  ],
  'sony-a7r-v': [
    { q: 'What warranty does a second-hand Sony A7R V come with?', a: 'Every pre-owned Sony A7R V includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We read the shutter actuation count directly from the camera using professional diagnostic tools. The listed figure is accurate at intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Can I use my Sony A-mount lenses on the A7R V?', a: 'Yes — with the LA-EA5 adapter, most A-mount lenses work with phase-detection AF on the A7R V. Native E-mount lenses will deliver optimal results.' },
  ],
  'sony-a1': [
    { q: 'What warranty does a second-hand Sony A1 come with?', a: 'All pre-owned Sony A1 units include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We extract the shutter count from the camera\'s EXIF data using professional software. The count is recorded at the time of intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Is the Sony A1 suitable for professional sports photography?', a: 'Absolutely — the A1\'s 30fps blackout-free burst, 759-point AF with real-time tracking, and dual CFexpress/SD card slots make it one of the top choices for sports professionals worldwide.' },
  ],
  'nikon-zf': [
    { q: 'What warranty does a second-hand Nikon Zf come with?', a: 'Every pre-owned Nikon Zf includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We read the shutter actuation count using professional diagnostic tools. The listed count is accurate at intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Can I use my Nikon F lenses on the Nikon Zf?', a: 'Yes — with the Nikon FTZ or FTZ II adapter, most F-mount lenses work on the Zf with autofocus support. Native Z-mount lenses provide the best performance and handling.' },
  ],
  'dji-mavic-2-pro': [
    { q: 'What warranty does a second-hand DJI Mavic 2 Pro come with?', a: 'All pre-owned DJI drones include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How do you test drone condition?', a: 'Each drone is flight-tested and inspected for motor performance, gimbal calibration, battery health, and obstacle-sensor functionality before listing.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Do I need a licence to fly this drone in the Netherlands?', a: 'As of EU drone regulations, you need an A1/A3 open category certificate for drones above 250g. The Mavic 2 Pro weighs 907g, so a certificate is required. Check the EASA / ILT website for current rules.' },
  ],
  'hasselblad-x2d-100c': [
    { q: 'What warranty does a second-hand Hasselblad X2D come with?', a: 'Every pre-owned Hasselblad X2D 100C includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How is the shutter count determined?', a: 'We read the actuation count from the camera\'s internal diagnostics. The figure listed is accurate at the time of intake.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Which lenses are compatible with the X2D 100C?', a: 'The X2D uses Hasselblad\'s XCD mount. All XCD lenses are fully compatible, including autofocus and electronic shutter functionality. There are currently over 10 XCD lenses available.' },
  ],
  'sony-fe-70-200mm-f28-gm-oss-ii': [
    { q: 'What warranty does a second-hand Sony 70-200mm GM II come with?', a: 'All pre-owned Sony lenses include a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
    { q: 'How do you check optical quality?', a: 'Every lens is inspected for dust, fungus, haze, and coating damage using a professional loupe and collimated light source. Only lenses meeting our standards are listed.' },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
    { q: 'Is this lens compatible with teleconverters?', a: 'Yes — the FE 70-200mm f/2.8 GM OSS II is compatible with Sony\'s 1.4x and 2x teleconverters, extending its reach to 280mm f/4 or 400mm f/5.6 while maintaining autofocus.' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helper: derive a "subcategory" for the breadcrumb                 */
/* ------------------------------------------------------------------ */
function getSubcategory(product: { category: string; description?: string }): { label: string; href: string } | null {
  if (product.category === 'cameras') {
    if (product.description?.toLowerCase().includes('mirrorless')) return { label: 'Mirrorless', href: '/cameras/mirrorless' };
    if (product.description?.toLowerCase().includes('dslr')) return { label: 'DSLR', href: '/cameras/dslr' };
    if (product.description?.toLowerCase().includes('medium format')) return { label: 'Medium Format', href: '/cameras/medium-format' };
    if (product.description?.toLowerCase().includes('compact')) return { label: 'Compact & Bridge', href: '/cameras/compact-and-bridge' };
    return { label: 'Mirrorless', href: '/cameras/mirrorless' };
  }
  if (product.category === 'lenses') {
    return { label: 'Mirrorless', href: '/lenses/mirrorless' };
  }
  if (product.category === 'drones') {
    return { label: 'Drones', href: '/action-drones' };
  }
  return null;
}

/* Map brand / specs -> mount system label for breadcrumb */
function getMountLabel(brand: string, specs?: Record<string, string>): { label: string; href: string } | null {
  const mount = specs?.Mount || '';
  if (mount.includes('Nikon Z')) return { label: 'Nikon Z', href: '/cameras/mirrorless/nikon-z' };
  if (mount.includes('Sony E')) return { label: 'Sony E / FE', href: '/cameras/mirrorless/sony-e-fe' };
  if (mount.includes('Canon RF')) return { label: 'Canon R', href: '/cameras/mirrorless/canon-r' };
  if (mount.includes('Fujifilm X')) return { label: 'Fujifilm X', href: '/cameras/mirrorless/fujifilm-x' };
  if (mount.includes('Hasselblad')) return { label: 'Hasselblad', href: '/cameras/mirrorless' };
  if (brand === 'DJI') return null;
  return null;
}

/* ------------------------------------------------------------------ */
/*  Upsell accessories                                                 */
/* ------------------------------------------------------------------ */
const upsellsByBrand: Record<string, { name: string; price: number; image: string }[]> = {
  Sony: [
    { name: 'Sony NP-FZ100 Battery', price: 49, image: 'https://cdn.webshopapp.com/shops/353975/files/461621215/200x200x2/sony-np-fz100-battery.jpg' },
    { name: 'Sony CFexpress Type A 80GB', price: 149, image: 'https://m.media-amazon.com/images/I/71gR1GQ+SQL._AC_SL1500_.jpg' },
    { name: 'Sony GP-VPT2BT Grip', price: 89, image: 'https://m.media-amazon.com/images/I/61FfpTTOURL._AC_SL1200_.jpg' },
  ],
  Canon: [
    { name: 'Canon LP-E6NH Battery', price: 59, image: 'https://m.media-amazon.com/images/I/61+rnZpOi4L._AC_SL1500_.jpg' },
    { name: 'SanDisk CFexpress 128GB', price: 159, image: 'https://m.media-amazon.com/images/I/71tsFoxEOJL._AC_SL1500_.jpg' },
    { name: 'Canon BG-R10 Battery Grip', price: 279, image: 'https://m.media-amazon.com/images/I/71bqx6CANOL._AC_SL1500_.jpg' },
  ],
  Nikon: [
    { name: 'Nikon EN-EL15c Battery', price: 55, image: 'https://m.media-amazon.com/images/I/61M6JUI8pyL._AC_SL1000_.jpg' },
    { name: 'CFexpress Type B 128GB', price: 179, image: 'https://m.media-amazon.com/images/I/71-c5JCHbVL._AC_SL1500_.jpg' },
    { name: 'Nikon MB-N12 Battery Grip', price: 329, image: 'https://m.media-amazon.com/images/I/61bRMnfhUFL._AC_SL1200_.jpg' },
  ],
  Fujifilm: [
    { name: 'Fujifilm NP-W235 Battery', price: 65, image: 'https://m.media-amazon.com/images/I/61rHbMUbURL._AC_SL1200_.jpg' },
    { name: 'SanDisk SD UHS-II 128GB', price: 49, image: 'https://m.media-amazon.com/images/I/617NtexaW2L._AC_SL1500_.jpg' },
  ],
  default: [
    { name: 'SanDisk SD UHS-II 128GB', price: 49, image: 'https://m.media-amazon.com/images/I/617NtexaW2L._AC_SL1500_.jpg' },
    { name: 'Peak Design Slide Strap', price: 65, image: 'https://m.media-amazon.com/images/I/71J5UrFj2SL._AC_SL1500_.jpg' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();
  const { markProductViewed, isVariantViewed } = useRecentlyViewed();

  useEffect(() => {
    if (slug) markProductViewed(slug);
  }, [slug, markProductViewed]);

  const isOosProduct = product ? (product.stock === 0) : false;
  const [openAccordion, setOpenAccordion] = useState<string | null>(isOosProduct ? null : 'specs');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedAccessories, setExpandedAccessories] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-high' | 'price-low' | 'newest'>('price-high');
  const [filterCondition, setFilterCondition] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertCondition, setAlertCondition] = useState('any');
  const [alertMaxShutter, setAlertMaxShutter] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);
  const [quickViewVariant, setQuickViewVariant] = useState<ProductVariant | null>(null);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartVariant, setCartVariant] = useState<ProductVariant | null>(null);

  /* OOS state */
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyConditions, setNotifyConditions] = useState<Record<string, boolean>>({ 'As new': true, 'Excellent': true, 'Good': true, 'Fair': true, 'Used': false, 'Heavily used': false });
  const [notifyMaxShutter, setNotifyMaxShutter] = useState('none');

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Product not found</h1>
        <p style={{ color: 'var(--text-sec)', marginBottom: 24 }}>The product you are looking for does not exist.</p>
        <Link href="/cameras" className="btn btn--primary">Browse Cameras</Link>
      </div>
    );
  }

  // Related products: same category, different product, max 4
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.stock > 0)
    .slice(0, 4);

  const isOos = product.stock === 0;
  const subcategory = getSubcategory(product);
  const mountLabel = getMountLabel(product.brand, product.specs);

  /* Breadcrumb items */
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
  ];
  if (subcategory) breadcrumbItems.push({ label: subcategory.label, href: subcategory.href });
  if (mountLabel) breadcrumbItems.push({ label: mountLabel.label, href: mountLabel.href });
  breadcrumbItems.push({ label: product.title });

  /* Price range */
  const prices = product.variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRangeStr = prices.length > 0
    ? minPrice === maxPrice
      ? `\u20AC${minPrice.toLocaleString('nl-NL')}`
      : `\u20AC${minPrice.toLocaleString('nl-NL')} \u2013 \u20AC${maxPrice.toLocaleString('nl-NL')}`
    : '';

  /* Filter & sort variants */
  let filteredVariants = [...product.variants];
  if (filterCondition) {
    filteredVariants = filteredVariants.filter(v => v.conditionLabel === filterCondition);
  }
  filteredVariants.sort((a, b) => {
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'price-low') return a.price - b.price;
    return 0;
  });

  /* Condition options from variants */
  const conditionOptions = [...new Set(product.variants.map(v => v.conditionLabel))];

  /* SEO & FAQ */
  const seoParas = seoTexts[slug] || [
    `The ${product.title} is a popular choice among photographers looking for quality and reliability. With its ${product.description?.toLowerCase() || 'impressive feature set'}, it continues to be a favourite in the second-hand market.`,
    `Buying a pre-owned ${product.title} from Camera-tweedehands.nl means every unit has been inspected, graded, and covered by our 12-month warranty. Each listing includes detailed condition information and photos — so you know exactly what you're getting.`,
  ];
  const faqs: FaqItem[] = productFaqs[slug] || [
    { q: `What warranty does a second-hand ${product.title} come with?`, a: `Every pre-owned ${product.title} includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.` },
    { q: 'What\'s the difference between condition grades?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
  ];

  const chevronSvg = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>;

  return (
    <div className="container">
      {/* 1. Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* 2. Title section */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="section__title" style={{ marginBottom: 4 }}>{product.title}</h1>
        {!isOos && product.variants.length > 0 && (
          <p style={{ fontSize: 15, color: 'var(--text-sec)', margin: 0 }}>
            {product.variants.length} available used from {priceRangeStr}.
          </p>
        )}
      </div>

      {isOos ? (
        /* ============================================================ */
        /*  OUT OF STOCK VIEW                                           */
        /* ============================================================ */
        <>
          <style>{`
            @media (max-width: 768px) {
              .oos-grid { grid-template-columns: 1fr !important; }
              .oos-usp-strip { flex-wrap: wrap !important; }
            }
          `}</style>
          <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24 }}>Currently out of stock</p>
          <div className="oos-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
            {/* Image */}
            <div style={{ borderRadius: 12, border: '1px solid #e0e0e4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8%', position: 'relative', background: '#fff' }}>
              <img src={assetPath(product.image)} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(1) opacity(0.5)' }} />
              <span style={{ position: 'absolute', bottom: 16, right: 16, background: '#1f2937', color: '#fff', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Out of stock</span>
            </div>

            {/* Notify form */}
            <div>
              {!notifySuccess ? (
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 32 }}>
                  <div style={{ width: 48, height: 48, background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <svg width="24" height="24" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Get notified when available</h2>
                  <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
                    We don&apos;t have a {product.title} in stock right now, but we regularly receive new units. Set your preferences below and we&apos;ll email you the moment one arrives.
                  </p>

                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 20, boxSizing: 'border-box' }}
                  />

                  {/* Minimum condition */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 10 }}>Minimum condition</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {Object.keys(notifyConditions).map(cond => (
                      <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                        <input
                          type="checkbox"
                          checked={notifyConditions[cond]}
                          onChange={() => setNotifyConditions(prev => ({ ...prev, [cond]: !prev[cond] }))}
                          style={{ accentColor: '#22c55e', width: 16, height: 16 }}
                        />
                        {cond}
                      </label>
                    ))}
                  </div>

                  {/* Max shutter count */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 8 }}>Max. shutter count</div>
                  <select
                    value={notifyMaxShutter}
                    onChange={e => setNotifyMaxShutter(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 24, boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="none">No preference</option>
                    <option value="10000">Under 10,000</option>
                    <option value="25000">Under 25,000</option>
                    <option value="50000">Under 50,000</option>
                    <option value="100000">Under 100,000</option>
                  </select>

                  {/* Notify button */}
                  <button
                    onClick={() => { if (notifyEmail.includes('@')) setNotifySuccess(true); }}
                    style={{ width: '100%', padding: '14px 24px', borderRadius: 999, border: 'none', background: '#f97316', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    Notify me
                  </button>
                  <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 12 }}>You&apos;ll receive an email each time a matching item is listed. Unsubscribe anytime.</p>
                </div>
              ) : (
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Alert created!</h2>
                  <p style={{ fontSize: 14, color: '#6b7280' }}>We&apos;ll notify {notifyEmail} when a matching {product.title} arrives.</p>
                </div>
              )}
            </div>
          </div>

          {/* USP strip */}
          <div className="oos-usp-strip" style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: '1px solid #e5e7eb', marginBottom: 32, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' as const }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Min. 12-month warranty</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg> Professionally inspected</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 3 3 12 9 12"/></svg> 14-day returns for online purchases</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> Free shipping NL</span>
          </div>

          {/* Specifications accordion */}
          {product.specs && (
            <div className="accordion" style={{ marginBottom: 24 }}>
              <div className={`accordion__item${openAccordion === 'specs' ? ' is-open' : ''}`}>
                <button className="accordion__trigger" aria-expanded={openAccordion === 'specs'} onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}>
                  Specifications
                  {chevronSvg}
                </button>
                <div className="accordion__body">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 16px 10px 0', fontWeight: 600, fontSize: 14, width: '40%' }}>{key}</td>
                          <td style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-sec)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ============================================================ */
        /*  IN STOCK VIEW                                               */
        /* ============================================================ */
        <>
          {/* 3. Create Alert box */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <svg width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              Can&apos;t find what you&apos;re looking for?{' '}
              <button
                onClick={() => { setShowAlertModal(true); setAlertSuccess(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', textDecoration: 'underline' }}
              >
                Create an alert
              </button>{' '}
              and choose your preferred condition and maximum shutter count — we&apos;ll email you when a matching {product.title} arrives.
            </p>
          </div>

          {/* Alert modal */}
          {showAlertModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowAlertModal(false)}>
              <div style={{ background: '#fff', borderRadius: 'var(--rl)', padding: 32, maxWidth: 440, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowAlertModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: 4 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
                {!alertSuccess ? (
                  <>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create alert for {product.title}</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>We&apos;ll email you when a matching unit arrives.</p>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Email</label>
                    <input type="email" placeholder="your@email.com" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Preferred condition</label>
                    <select value={alertCondition} onChange={e => setAlertCondition(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 16, boxSizing: 'border-box', background: '#fff' }}>
                      <option value="any">Any condition</option>
                      <option value="as-new">As New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="used">Used</option>
                    </select>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Maximum shutter count</label>
                    <input type="number" placeholder="e.g. 50000" value={alertMaxShutter} onChange={e => setAlertMaxShutter(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 24, boxSizing: 'border-box' }} />
                    <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { if (alertEmail.includes('@')) setAlertSuccess(true); }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      Create alert
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Alert created!</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>We&apos;ll notify {alertEmail} when a matching {product.title} arrives.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Filter pills */}
          <div className="filter-bar">
            {/* Condition filter */}
            <div className="filter-dd-wrap">
              <button className="filter-dd-btn" onClick={() => setOpenFilter(openFilter === 'condition' ? null : 'condition')}>
                {filterCondition || 'Cosmetic condition'}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className={`filter-dd${openFilter === 'condition' ? ' is-open' : ''}`}>
                <label style={{ cursor: 'pointer' }} onClick={() => { setFilterCondition(null); setOpenFilter(null); }}>
                  <input type="radio" name="cond" checked={filterCondition === null} readOnly style={{ accentColor: 'var(--accent)' }} /> All
                </label>
                {conditionOptions.map(c => (
                  <label key={c} style={{ cursor: 'pointer' }} onClick={() => { setFilterCondition(c); setOpenFilter(null); }}>
                    <input type="radio" name="cond" checked={filterCondition === c} readOnly style={{ accentColor: 'var(--accent)' }} /> {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter (visual) */}
            <div className="filter-dd-wrap">
              <button className="filter-dd-btn" onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}>
                Price
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className={`filter-dd${openFilter === 'price' ? ' is-open' : ''}`}>
                <p style={{ padding: '8px', fontSize: 13, color: 'var(--text-sec)', margin: 0 }}>{priceRangeStr}</p>
              </div>
            </div>

            {/* Accessories filter (visual) */}
            <div className="filter-dd-wrap">
              <button className="filter-dd-btn" onClick={() => setOpenFilter(openFilter === 'accessories' ? null : 'accessories')}>
                Accessories
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className={`filter-dd${openFilter === 'accessories' ? ' is-open' : ''}`}>
                <p style={{ padding: '8px', fontSize: 13, color: 'var(--text-sec)', margin: 0 }}>Filter by included accessories coming soon.</p>
              </div>
            </div>
          </div>

          {/* 5. Results bar */}
          <div className="results-bar">
            <span>Showing <strong>{filteredVariants.length} of {product.variants.length}</strong> results</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="price-high">Sort by: Price: high &rarr; low</option>
              <option value="price-low">Price: low &rarr; high</option>
              <option value="newest">Newest first</option>
            </select>
          </div>

          {/* 6. Variant cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
            {filteredVariants.map(v => {
              const isHovered = hoveredVariant === v.sku;
              const condColors = (() => {
                const c = v.condition.toLowerCase().replace(/[\s-]/g, '');
                if (c === 'asnew') return { bg: '#dcfce7', color: '#059669' };
                if (c === 'excellent') return { bg: '#dcfce7', color: '#16a34a' };
                if (c === 'good') return { bg: '#fef9c3', color: '#65a30d' };
                if (c === 'used') return { bg: '#fefce8', color: '#ca8a04' };
                return { bg: '#f3f4f6', color: '#6b7280' };
              })();
              const viewed = isVariantViewed(v.sku);
              return (
                <div key={v.sku}>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Image with hover overlay */}
                  <div
                    style={{ position: 'relative', background: '#fff', aspectRatio: '1', overflow: 'hidden', borderRadius: '11px 11px 0 0', isolation: 'isolate' }}
                    onMouseEnter={() => setHoveredVariant(v.sku)}
                    onMouseLeave={() => setHoveredVariant(null)}
                  >
                    <img src={assetPath(v.images[0] || product.image)} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 16 }} />

                    {/* Recently viewed label — top-left, behind orange lines */}
                    {viewed && (
                      <div style={{ position: 'absolute', top: 0, left: 0, background: '#fff7ed', padding: '3px 10px 3px 6px', fontSize: 11, fontWeight: 600, color: '#f97316', zIndex: 2 }}>Recently viewed</div>
                    )}

                    {/* Orange border — continuous curve through corner, fades out */}
                    {viewed && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, width: '65%', height: '55%',
                        borderTop: '2px solid #f97316', borderLeft: '2px solid #f97316',
                        borderBottom: 'none', borderRight: 'none',
                        borderTopLeftRadius: 11, zIndex: 4, pointerEvents: 'none',
                        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
                        WebkitMaskComposite: 'intersect',
                        maskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
                        maskComposite: 'intersect',
                      }} />
                    )}

                    {/* Hover overlay: Quick View + Full View */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: isHovered ? 'auto' : 'none', zIndex: 5 }}>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewVariant(v); }}
                        style={{ background: '#fff', color: '#111', border: 'none', borderRadius: 999, padding: '10px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Quick View
                      </button>
                      <Link href={`/product/${product.slug}/${v.sku}`} style={{ background: '#f97316', color: '#fff', borderRadius: 999, padding: '10px 32px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                        Full View
                      </Link>
                    </div>

                    {/* Badges — top-right */}
                    {v.badges && v.badges.length > 0 && (
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 2 }}>
                        {v.badges.map(badge => (
                          <span key={badge} style={{
                            borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                            background: badge === 'sale' ? '#ef4444' : badge === 'new' ? '#22c55e' : badge === 'outlet' ? '#f97316' : badge === 'vat' ? '#6b7280' : '#6b7280',
                            color: '#fff',
                          }}>
                            {badge === 'sale' ? 'Sale' : badge === 'new' ? 'New' : badge === 'outlet' ? 'Outlet' : badge === 'vat' ? 'Incl. VAT' : badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SKU under photo */}
                  <div style={{ padding: '4px 14px', fontSize: 12, color: '#9ca3af' }}>SKU: {v.sku}</div>

                  {/* Info */}
                  <div style={{ padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Price */}
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>&euro; {v.price.toLocaleString('nl-NL')}</div>
                    {/* Condition and shutter count stacked */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ display: 'inline-flex', alignSelf: 'flex-start', background: condColors.bg, color: condColors.color, borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{v.conditionLabel}</span>
                      {v.shutterCount != null && (
                        <span style={{ fontSize: 12, color: '#374151', fontWeight: 700 }}>Shuttercount: {v.shutterCount.toLocaleString('nl-NL')}</span>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

                    {/* Bottom row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {v.accessories && v.accessories.length > 0 ? (
                        <button
                          className="whats-included-btn"
                          onClick={() => setExpandedAccessories(expandedAccessories === v.sku ? null : v.sku)}
                          style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, fontFamily: 'inherit' }}
                        >
                          What&apos;s included
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: expandedAccessories === v.sku ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                      ) : <span />}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="product-add-to-cart"
                          onClick={() => {
                            addItem({ id: v.sku, sku: v.sku, name: product.title, price: v.price, condition: v.conditionLabel, image: product.image, inclVat: v.inclVat ?? false }, product);
                            setCartVariant(v);
                            setShowCartPopup(true);
                          }}
                          aria-label="Add to cart"
                          style={{ background: '#f97316', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Accessories expandable */}
                    {v.accessories && v.accessories.length > 0 && (
                      <ul className="whats-included-list" style={{ margin: '4px 0 0', padding: '0 0 0 18px', fontSize: 12, color: '#6b7280', listStyle: 'disc', display: expandedAccessories === v.sku ? 'block' : 'none' }}>
                        {v.accessories.map((acc, i) => <li key={i} style={{ marginBottom: 2 }}>{acc}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          {/* Quick View modal for variant */}
          {quickViewVariant && (
            <QuickView
              product={{ ...product, variants: [quickViewVariant] }}
              onClose={() => setQuickViewVariant(null)}
            />
          )}
        </>
      )}

      {/* 7. About the product section */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 40, marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>About the {product.title}</h2>
        {seoParas.map((para, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-sec)', marginBottom: 16 }}>{para}</p>
        ))}
      </div>

      {/* 8. Specifications & Shipping accordions */}
      {product.specs && (
        <div className="accordion" style={{ marginBottom: 24 }}>
            <div className={`accordion__item${openAccordion === 'specs' ? ' is-open' : ''}`}>
              <button className="accordion__trigger" aria-expanded={openAccordion === 'specs'} onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}>
                Specifications
                {chevronSvg}
              </button>
              <div className="accordion__body">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 16px 10px 0', fontWeight: 600, fontSize: 14, width: '40%' }}>{key}</td>
                        <td style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-sec)' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

        </div>
      )}

      {/* 10. Frequently asked questions */}
      {faqs.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
          <div className="accordion">
            {faqs.map((faq, i) => {
              const key = `faq-${i}`;
              return (
                <div key={key} className={`accordion__item${openFaq === key ? ' is-open' : ''}`}>
                  <button className="accordion__trigger" aria-expanded={openFaq === key} onClick={() => setOpenFaq(openFaq === key ? null : key)}>
                    {faq.q}
                    {chevronSvg}
                  </button>
                  <div className="accordion__body">
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 11. You may also like */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 40, marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>You may also like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {relatedProducts.map(rp => (
              <Link key={rp.id} href={`/product/${rp.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#fff',
                  transition: 'border-color .2s, box-shadow .2s',
                }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12%',
                      background: '#fff',
                    }}>
                      <img src={assetPath(rp.image)} alt={rp.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <button
                      onClick={(e) => e.preventDefault()}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: '50%',
                        border: '1.5px solid var(--border)', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </button>
                  </div>
                  <div style={{ padding: '12px 16px 16px' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{rp.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 4 }}>
                      {rp.fromPrice && 'from '}<span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>&euro; {rp.price.toLocaleString('nl-NL')}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                      {rp.stock} available
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ============ CART POPUP ============ */}
      {product && (() => {
        const brand = product.title.split(' ')[0];
        const upsellItems = upsellsByBrand[brand] || upsellsByBrand['default'];
        const cv = cartVariant;
        return (
          <div
            className="cart-popup-overlay"
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 9999, display: showCartPopup ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setShowCartPopup(false)}
          >
            <div
              style={{
                background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440,
                margin: '0 16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px',
                background: '#f0fdf4', borderBottom: '1px solid #dcfce7',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#166534' }}>Added to cart</span>
                <button
                  onClick={() => setShowCartPopup(false)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Product summary */}
              {cv && (
                <div style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', background: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={assetPath(product.image)} alt={product.title} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 2 }}>{product.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{cv.conditionLabel} &middot; SKU {cv.sku}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginTop: 4 }}>&euro; {cv.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              )}

              {/* Upsell accessories */}
              <div style={{ padding: '16px 20px' }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, marginTop: 0 }}>
                  Complete your setup
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {upsellItems.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', border: '1px solid #eeeef2', borderRadius: 10,
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}>
                      <div style={{ width: 48, height: 48, borderRadius: 6, background: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={assetPath(item.image)} alt={item.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1f2937' }}>{item.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>&euro; {item.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</div>
                      </div>
                      <button style={{
                        padding: '6px 14px', borderRadius: 999, border: '1.5px solid #e5e7eb',
                        background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2937',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}>
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
                <button
                  onClick={() => setShowCartPopup(false)}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 999,
                    border: '1.5px solid #e5e7eb', background: '#fff',
                    fontSize: 14, fontWeight: 600, color: '#1f2937', cursor: 'pointer',
                  }}
                >
                  Continue shopping
                </button>
                <Link
                  href="/checkout"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 999,
                    background: '#f97316', color: '#fff', textDecoration: 'none',
                    fontSize: 14, fontWeight: 700,
                  }}
                >
                  Checkout
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
