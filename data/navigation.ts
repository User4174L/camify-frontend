export interface NavMenuItem {
  label: string;
  href: string;
}

export interface NavMenuColumn {
  title: string;
  titleHref: string;
  items: NavMenuItem[];
  sub?: NavMenuItem[];
}

export interface NavCategory {
  label: string;
  href: string;
  menuCols: number;
  menuClass?: string;
  columns: NavMenuColumn[];
}

export const brands: NavMenuItem[] = [
  { label: 'Canon', href: '/brands/canon' },
  { label: 'Nikon', href: '/brands/nikon' },
  { label: 'Sony', href: '/brands/sony' },
  { label: 'Fujifilm', href: '/brands/fujifilm' },
  { label: 'Leica', href: '/brands/leica' },
  { label: 'Hasselblad', href: '/brands/hasselblad' },
  { label: 'Panasonic', href: '/brands/panasonic' },
  { label: 'Olympus', href: '/brands/olympus' },
  { label: 'Sigma', href: '/brands/sigma' },
  { label: 'Tamron', href: '/brands/tamron' },
  { label: 'Pentax', href: '/brands/pentax' },
  { label: 'Ricoh', href: '/brands/ricoh' },
  { label: 'Blackmagic', href: '/brands/blackmagic' },
  { label: 'RED', href: '/brands/red' },
  { label: 'ARRI', href: '/brands/arri' },
  { label: 'DJI', href: '/brands/dji' },
  { label: 'GoPro', href: '/brands/gopro' },
];

export const navCategories: NavCategory[] = [
  // ── CAMERAS ──
  {
    label: 'Cameras',
    href: '/cameras',
    menuCols: 5,
    columns: [
      {
        title: 'DSLR',
        titleHref: '/cameras/dslr',
        items: [
          { label: 'Canon', href: '/cameras/dslr/canon' },
          { label: 'Nikon', href: '/cameras/dslr/nikon' },
          { label: 'Pentax', href: '/cameras/dslr/pentax' },
          { label: 'Sony', href: '/cameras/dslr/sony' },
          { label: 'Fujifilm', href: '/cameras/dslr/fujifilm' },
          { label: 'Leica', href: '/cameras/dslr/leica' },
          { label: 'Other', href: '/cameras/dslr/other' },
        ],
      },
      {
        title: 'Mirrorless',
        titleHref: '/cameras/mirrorless',
        items: [
          { label: 'Canon EOS-M', href: '/cameras/mirrorless/canon-eos-m' },
          { label: 'Canon R', href: '/cameras/mirrorless/canon-r' },
          { label: 'Nikon 1', href: '/cameras/mirrorless/nikon-1' },
          { label: 'Nikon Z', href: '/cameras/mirrorless/nikon-z' },
          { label: 'Sony E / FE', href: '/cameras/mirrorless/sony-e-fe' },
          { label: 'Fujifilm X', href: '/cameras/mirrorless/fujifilm-x' },
          { label: 'Olympus / OM System', href: '/cameras/mirrorless/olympus-om-system' },
          { label: 'Panasonic G', href: '/cameras/mirrorless/panasonic-g' },
          { label: 'Panasonic S', href: '/cameras/mirrorless/panasonic-s' },
          { label: 'Sigma', href: '/cameras/mirrorless/sigma' },
          { label: 'Leica TL', href: '/cameras/mirrorless/leica-tl' },
          { label: 'Leica SL', href: '/cameras/mirrorless/leica-sl' },
          { label: 'Leica Q', href: '/cameras/mirrorless/leica-q' },
          { label: 'Leica M', href: '/cameras/mirrorless/leica-m' },
          { label: 'Other', href: '/cameras/mirrorless/other' },
        ],
      },
      {
        title: 'Compact & Bridge',
        titleHref: '/cameras/compact-and-bridge',
        items: [
          { label: 'Canon', href: '/cameras/compact-and-bridge/canon' },
          { label: 'Nikon', href: '/cameras/compact-and-bridge/nikon' },
          { label: 'Sony', href: '/cameras/compact-and-bridge/sony' },
          { label: 'Fujifilm', href: '/cameras/compact-and-bridge/fujifilm' },
          { label: 'Olympus / OM System', href: '/cameras/compact-and-bridge/olympus-om-system' },
          { label: 'Panasonic', href: '/cameras/compact-and-bridge/panasonic' },
          { label: 'Sigma', href: '/cameras/compact-and-bridge/sigma' },
          { label: 'Ricoh', href: '/cameras/compact-and-bridge/ricoh' },
          { label: 'Leica', href: '/cameras/compact-and-bridge/leica' },
          { label: 'Other', href: '/cameras/compact-and-bridge/other' },
        ],
      },
      {
        title: 'Medium Format',
        titleHref: '/cameras/medium-format',
        items: [
          { label: 'Fujifilm GFX', href: '/cameras/medium-format/fujifilm-gfx' },
          { label: 'Hasselblad H', href: '/cameras/medium-format/hasselblad-h' },
          { label: 'Hasselblad X', href: '/cameras/medium-format/hasselblad-x' },
          { label: 'Phase One XF', href: '/cameras/medium-format/phase-one-xf' },
          { label: 'Digital Backs', href: '/cameras/medium-format/digital-backs' },
          { label: 'Other', href: '/cameras/medium-format/other' },
        ],
      },
      {
        title: 'Analog / Film',
        titleHref: '/cameras/analog-film',
        items: [
          { label: '35mm SLR', href: '/cameras/analog-film/35mm-slr' },
          { label: '35mm Rangefinder', href: '/cameras/analog-film/35mm-rangefinder' },
          { label: 'Medium Format Film', href: '/cameras/analog-film/medium-format-film' },
          { label: 'Large Format', href: '/cameras/analog-film/large-format' },
          { label: 'Point & Shoot Film', href: '/cameras/analog-film/point-and-shoot' },
          { label: 'Other', href: '/cameras/analog-film/other' },
        ],
      },
    ],
  },

  // ── LENSES ──
  {
    label: 'Lenses',
    href: '/lenses',
    menuCols: 5,
    columns: [
      {
        title: 'DSLR',
        titleHref: '/lenses/dslr',
        items: [
          { label: 'Canon fit', href: '/lenses/dslr/canon' },
          { label: 'Nikon fit', href: '/lenses/dslr/nikon' },
          { label: 'Pentax K fit', href: '/lenses/dslr/pentax-k' },
          { label: 'Sony A fit', href: '/lenses/dslr/sony-a' },
          { label: 'Leica R fit', href: '/lenses/dslr/leica-r' },
          { label: 'Other', href: '/lenses/dslr/other' },
        ],
      },
      {
        title: 'Mirrorless',
        titleHref: '/lenses/mirrorless',
        items: [
          { label: 'Micro Four Thirds fit', href: '/lenses/mirrorless/micro-four-thirds' },
          { label: 'Canon M fit', href: '/lenses/mirrorless/canon-m' },
          { label: 'Canon RF fit', href: '/lenses/mirrorless/canon-rf' },
          { label: 'Nikon 1 fit', href: '/lenses/mirrorless/nikon-1' },
          { label: 'Nikon Z fit', href: '/lenses/mirrorless/nikon-z' },
          { label: 'Sony E / FE fit', href: '/lenses/mirrorless/sony-e-fe' },
          { label: 'Fujifilm X fit', href: '/lenses/mirrorless/fujifilm-x' },
          { label: 'Sigma SA fit', href: '/lenses/mirrorless/sigma-sa' },
          { label: 'L-Mount fit', href: '/lenses/mirrorless/l-mount' },
          { label: 'Leica SL fit', href: '/lenses/mirrorless/leica-sl' },
          { label: 'Leica M fit', href: '/lenses/mirrorless/leica-m' },
          { label: 'Other', href: '/lenses/mirrorless/other' },
        ],
      },
      {
        title: 'Medium Format',
        titleHref: '/lenses/medium-format',
        items: [
          { label: 'Hasselblad H fit', href: '/lenses/medium-format/hasselblad-h' },
          { label: 'Hasselblad X fit', href: '/lenses/medium-format/hasselblad-x' },
          { label: 'Fujifilm G fit', href: '/lenses/medium-format/fujifilm-g' },
          { label: 'Phase One / Mamiya 645 fit', href: '/lenses/medium-format/phase-one-mamiya-645' },
          { label: 'Pentax 645 fit', href: '/lenses/medium-format/pentax-645' },
          { label: 'Other', href: '/lenses/medium-format/other' },
        ],
      },
      {
        title: 'Cine',
        titleHref: '/lenses/cine',
        items: [
          { label: 'Canon fit', href: '/lenses/cine/canon' },
          { label: 'PL Mount', href: '/lenses/cine/pl-mount' },
          { label: 'Nikon fit', href: '/lenses/cine/nikon' },
          { label: 'Sony fit', href: '/lenses/cine/sony' },
          { label: 'Fujifilm X fit', href: '/lenses/cine/fujifilm-x' },
          { label: 'MFT fit', href: '/lenses/cine/mft' },
          { label: 'Broadcast', href: '/lenses/cine/broadcast' },
          { label: 'Other', href: '/lenses/cine/other' },
        ],
      },
      {
        title: 'Analog / Film',
        titleHref: '/lenses/analog-film',
        items: [
          { label: '35mm SLR fit', href: '/lenses/analog-film/35mm-slr' },
          { label: 'Rangefinder fit', href: '/lenses/analog-film/rangefinder' },
          { label: 'Medium Format fit', href: '/lenses/analog-film/medium-format' },
          { label: 'Other', href: '/lenses/analog-film/other' },
        ],
      },
    ],
  },

  // ── VIDEO & CINEMA ──
  {
    label: 'Video & Cinema',
    href: '/cinema',
    menuCols: 4,
    columns: [
      {
        title: 'Digital Cine Cameras',
        titleHref: '/cinema/cameras',
        items: [
          { label: 'Canon EOS Cinema', href: '/cinema/cameras/canon' },
          { label: 'RED Digital Cinema', href: '/cinema/cameras/red' },
          { label: 'ARRI Cinema', href: '/cinema/cameras/arri' },
          { label: 'Blackmagic Design', href: '/cinema/cameras/blackmagic' },
          { label: 'Sony Cinema', href: '/cinema/cameras/sony' },
          { label: 'Panasonic Cinema', href: '/cinema/cameras/panasonic' },
          { label: 'Other', href: '/cinema/cameras/other' },
        ],
      },
      {
        title: 'Camcorders',
        titleHref: '/cinema/camcorders',
        items: [
          { label: 'Canon', href: '/cinema/camcorders/canon' },
          { label: 'Sony', href: '/cinema/camcorders/sony' },
          { label: 'Panasonic', href: '/cinema/camcorders/panasonic' },
          { label: 'JVC', href: '/cinema/camcorders/jvc' },
          { label: 'Other', href: '/cinema/camcorders/other' },
        ],
      },
      {
        title: 'Cine Lenses',
        titleHref: '/lenses/cine',
        items: [],
      },
      {
        title: 'Cine Accessories',
        titleHref: '/accessories/cine',
        items: [],
      },
    ],
  },

  // ── ACTION & DRONES ──
  {
    label: 'Action & Drones',
    href: '/action-drones',
    menuCols: 4,
    columns: [
      {
        title: 'Drones & Aerial',
        titleHref: '/action-drones/drones',
        items: [],
      },
      {
        title: 'VR & 360',
        titleHref: '/action-drones/vr-360',
        items: [],
      },
      {
        title: 'Action Cameras',
        titleHref: '/action-drones/action-cameras',
        items: [],
      },
      {
        title: 'Accessories',
        titleHref: '/action-drones/accessories',
        items: [],
      },
    ],
  },

  // ── PHOTO & VIDEO ACCESSORIES ──
  {
    label: 'Accessories',
    href: '/accessories',
    menuCols: 5,
    menuClass: 'acc',
    columns: [
      {
        title: 'Optics',
        titleHref: '/accessories/optics',
        items: [
          { label: 'Binoculars', href: '/accessories/optics/binoculars' },
          { label: 'Optics Accessories', href: '/accessories/optics/accessories' },
          { label: 'Telescopes', href: '/accessories/optics/telescopes' },
        ],
      },
      {
        title: 'Speedlites / Remotes',
        titleHref: '/accessories/speedlites-remotes',
        items: [
          { label: 'For Nikon', href: '/accessories/speedlites-remotes/nikon' },
          { label: 'For Canon', href: '/accessories/speedlites-remotes/canon' },
          { label: 'For Sony', href: '/accessories/speedlites-remotes/sony' },
          { label: 'For Fujifilm', href: '/accessories/speedlites-remotes/fujifilm' },
          { label: 'For Olympus', href: '/accessories/speedlites-remotes/olympus' },
          { label: 'For Panasonic', href: '/accessories/speedlites-remotes/panasonic' },
          { label: 'For Pentax', href: '/accessories/speedlites-remotes/pentax' },
          { label: 'Other Speedlites', href: '/accessories/speedlites-remotes/other' },
        ],
      },
      {
        title: 'Battery Grips',
        titleHref: '/accessories/battery-grips',
        items: [
          { label: 'For Nikon', href: '/accessories/battery-grips/nikon' },
          { label: 'For Canon', href: '/accessories/battery-grips/canon' },
          { label: 'For Sony', href: '/accessories/battery-grips/sony' },
          { label: 'For Fujifilm', href: '/accessories/battery-grips/fujifilm' },
          { label: 'For Olympus', href: '/accessories/battery-grips/olympus' },
          { label: 'For Panasonic', href: '/accessories/battery-grips/panasonic' },
          { label: 'For Pentax', href: '/accessories/battery-grips/pentax' },
          { label: 'Other Battery Grips', href: '/accessories/battery-grips/other' },
        ],
      },
      {
        title: 'Adapters',
        titleHref: '/accessories/adapters',
        items: [
          { label: 'For Nikon', href: '/accessories/adapters/nikon' },
          { label: 'For Canon', href: '/accessories/adapters/canon' },
          { label: 'For Sony', href: '/accessories/adapters/sony' },
          { label: 'For Fujifilm', href: '/accessories/adapters/fujifilm' },
          { label: 'For Olympus', href: '/accessories/adapters/olympus' },
          { label: 'For Panasonic', href: '/accessories/adapters/panasonic' },
          { label: 'For Pentax', href: '/accessories/adapters/pentax' },
          { label: 'Phase One / Mamiya 645', href: '/accessories/adapters/phase-one-mamiya' },
          { label: 'Other', href: '/accessories/adapters/other' },
        ],
      },
      {
        title: 'Teleconverters',
        titleHref: '/accessories/teleconverters',
        items: [
          { label: 'For Nikon', href: '/accessories/teleconverters/nikon' },
          { label: 'For Canon', href: '/accessories/teleconverters/canon' },
          { label: 'For Sony', href: '/accessories/teleconverters/sony' },
          { label: 'For Fujifilm', href: '/accessories/teleconverters/fujifilm' },
          { label: 'For Olympus', href: '/accessories/teleconverters/olympus' },
          { label: 'For Panasonic', href: '/accessories/teleconverters/panasonic' },
          { label: 'For Pentax', href: '/accessories/teleconverters/pentax' },
          { label: 'Other Teleconverters', href: '/accessories/teleconverters/other' },
        ],
      },
      {
        title: 'Batteries & Chargers',
        titleHref: '/accessories/batteries-chargers',
        items: [],
      },
      {
        title: 'Filters',
        titleHref: '/accessories/filters',
        items: [
          { label: 'UV', href: '/accessories/filters/uv' },
          { label: 'ND', href: '/accessories/filters/nd' },
          { label: 'CPL / Polarising', href: '/accessories/filters/cpl' },
          { label: 'Gradient / GND', href: '/accessories/filters/gradient-gnd' },
          { label: 'Color / Effects', href: '/accessories/filters/color-effects' },
          { label: 'Filter Accessories', href: '/accessories/filters/accessories' },
          { label: 'Other', href: '/accessories/filters/other' },
        ],
      },
      {
        title: 'Memory Cards & Readers',
        titleHref: '/accessories/memory-cards-readers',
        items: [
          { label: 'Card Readers', href: '/accessories/memory-cards-readers/card-readers' },
          { label: 'CFexpress Type A', href: '/accessories/memory-cards-readers/cfexpress-type-a' },
          { label: 'CFexpress Type B', href: '/accessories/memory-cards-readers/cfexpress-type-b' },
          { label: 'SD', href: '/accessories/memory-cards-readers/sd' },
          { label: 'CF', href: '/accessories/memory-cards-readers/cf' },
          { label: 'CFast 2.0', href: '/accessories/memory-cards-readers/cfast' },
          { label: 'SSD', href: '/accessories/memory-cards-readers/ssd' },
          { label: 'XQD', href: '/accessories/memory-cards-readers/xqd' },
          { label: 'Other Storage', href: '/accessories/memory-cards-readers/other' },
        ],
      },
      {
        title: 'Bags & Cases',
        titleHref: '/accessories/bags-cases',
        items: [
          { label: 'Backpack', href: '/accessories/bags-cases/backpack' },
          { label: 'Shoulder Bag', href: '/accessories/bags-cases/shoulder-bag' },
          { label: 'Trolley', href: '/accessories/bags-cases/trolley' },
          { label: 'Peli Case', href: '/accessories/bags-cases/peli-case' },
          { label: 'Other', href: '/accessories/bags-cases/other' },
        ],
      },
      {
        title: 'Tripods, Supports & Rigs',
        titleHref: '/accessories/tripods-supports-rigs',
        items: [
          { label: 'Photo Tripods', href: '/accessories/tripods-supports-rigs/photo-tripods' },
          { label: 'Video Tripods', href: '/accessories/tripods-supports-rigs/video-tripods' },
          { label: 'Tripod Heads', href: '/accessories/tripods-supports-rigs/tripod-heads' },
          { label: 'Monopods', href: '/accessories/tripods-supports-rigs/monopods' },
          { label: 'Shoulder Rigs', href: '/accessories/tripods-supports-rigs/shoulder-rigs' },
          { label: 'Sliders', href: '/accessories/tripods-supports-rigs/sliders' },
          { label: 'Gimbals & Stabilisers', href: '/accessories/tripods-supports-rigs/gimbals' },
          { label: 'Tripod Accessories', href: '/accessories/tripods-supports-rigs/accessories' },
          { label: 'Other', href: '/accessories/tripods-supports-rigs/other' },
        ],
      },
      {
        title: 'Studio Equipment',
        titleHref: '/accessories/studio-equipment',
        items: [
          { label: 'Continuous Lighting', href: '/accessories/studio-equipment/continuous-lighting' },
          { label: 'Studio Strobes', href: '/accessories/studio-equipment/studio-strobes' },
          { label: 'Backgrounds', href: '/accessories/studio-equipment/backgrounds' },
          { label: 'Softboxes & Accessories', href: '/accessories/studio-equipment/softboxes' },
          { label: 'Generators', href: '/accessories/studio-equipment/generators' },
          { label: 'Monitors', href: '/accessories/studio-equipment/monitors' },
          { label: 'Other Studio', href: '/accessories/studio-equipment/other' },
        ],
      },
      {
        title: 'Audio Equipment',
        titleHref: '/accessories/audio-equipment',
        items: [],
      },
      {
        title: 'Other Accessories',
        titleHref: '/accessories/other',
        items: [
          { label: 'Digital Camera Accessories', href: '/accessories/other/digital-camera' },
          { label: 'Lens Accessories', href: '/accessories/other/lens' },
          { label: 'Compact Camera Accessories', href: '/accessories/other/compact-camera' },
          { label: 'Medium Format Accessories', href: '/accessories/other/medium-format' },
          { label: 'Cine Accessories', href: '/accessories/other/cine' },
          { label: 'Other', href: '/accessories/other/misc' },
        ],
      },
    ],
  },
];
