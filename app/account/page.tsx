'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Award, Trophy, Medal, Crown, Gem, Rocket, Star, Flame, Target,
  Package, Repeat, ShieldCheck, Camera, Aperture, Sparkles, Lock, Check,
  ChevronRight, MapPin, User, Bell, KeyRound, LogOut, ShoppingBag,
  FileText, Archive, Plus, Pencil, Trash2, X, ArrowLeft, Calendar,
  Building2, Phone, Mail, Hash, Receipt,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Design tokens (in lijn met admin dashboard + globals.css)          */
/* ------------------------------------------------------------------ */
const ACCENT     = '#E8692A';
const ACCENT_BG  = '#FFF0E8';
const BORDER     = '#EEEEF2';
const SURFACE    = '#F8F8FA';
const DARK       = '#1E2133';
const GREY       = '#6B7280';
const GREY_LIGHT = '#9CA3AF';
const GREEN      = '#22C55E';
const GREEN_BG   = '#ECFDF5';
const BLUE       = '#3B82F6';
const BLUE_BG    = '#EFF6FF';
const AMBER      = '#F59E0B';
const AMBER_BG   = '#FFFBEB';
const RED        = '#EF4444';
const RED_BG     = '#FEF2F2';
const WHITE      = '#FFFFFF';

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
type SectionKey =
  | 'overview' | 'orders' | 'quotes' | 'vault'
  | 'addresses' | 'personal' | 'achievements' | 'newsletter';

const NAV_GROUPS: { label: string; items: { key: SectionKey; label: string; Icon: React.ComponentType<{ size?: number }>; badge?: number }[] }[] = [
  {
    label: 'Mijn activiteit',
    items: [
      { key: 'overview',     label: 'Overzicht',        Icon: User },
      { key: 'orders',       label: 'Mijn orders',      Icon: ShoppingBag, badge: 2 },
      { key: 'quotes',       label: 'Mijn quotes',      Icon: FileText, badge: 1 },
      { key: 'vault',        label: 'Mijn producten',   Icon: Archive },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'addresses',    label: 'Adressen',         Icon: MapPin },
      { key: 'personal',     label: 'Persoonsgegevens', Icon: User },
      { key: 'achievements', label: 'Level & badges',   Icon: Trophy },
      { key: 'newsletter',   label: 'Nieuwsbrief',      Icon: Bell },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_USER = {
  firstName: 'Alex',
  lastName: 'Mark',
  email: 'alex.mark@camify.nl',
  phone: '+31 6 1234 5678',
  twoFactor: true,
  newsletter: true,
  memberSince: '2023-04-12',
  totalSpent: 18_450,
  totalSold: 6_220,
  ordersCount: 14,
  quotesCount: 7,
};

type OrderStatus = 'Nieuw' | 'In behandeling' | 'Verzonden' | 'Afgerond' | 'Geannuleerd';
type PayStatus   = 'Betaald' | 'Openstaand' | 'Geretourneerd';

type OrderLine = {
  sku: string;
  title: string;
  condition: string;
  qty: number;
  price: number;
  image?: string;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  payStatus: PayStatus;
  payMethod: string;
  total: number;
  lines: OrderLine[];
  shipping: { name: string; address: string };
  invoiceUrl: string;
  trackingCode?: string;
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'CT028945', date: '2026-03-09', status: 'Verzonden', payStatus: 'Betaald', payMethod: 'iDEAL', total: 3448,
    lines: [
      { sku: '257962', title: 'Sony A7 IV Body',              condition: 'Als nieuw',  qty: 1, price: 1749 },
      { sku: '21305',  title: 'Canon RF 24-70mm f/2.8L IS',   condition: 'Uitstekend', qty: 1, price: 1549 },
      { sku: 'ACC-12', title: 'Peak Design Slide camera strap', condition: 'Nieuw',    qty: 1, price: 150 },
    ],
    shipping: { name: 'Alex Mark', address: 'Meeuwenhof 23, 5103 KD Dongen' },
    invoiceUrl: '#', trackingCode: '3SKABA1234567',
  },
  {
    id: 'CT028912', date: '2026-02-21', status: 'In behandeling', payStatus: 'Betaald', payMethod: 'Pin',
    total: 599, lines: [
      { sku: '30712', title: 'Sigma 35mm f/1.4 DG DN Art', condition: 'Als nieuw', qty: 1, price: 599 },
    ],
    shipping: { name: 'Alex Mark', address: 'Meeuwenhof 23, 5103 KD Dongen' },
    invoiceUrl: '#',
  },
  {
    id: 'CT028876', date: '2026-01-15', status: 'Afgerond', payStatus: 'Betaald', payMethod: 'iDEAL', total: 4899,
    lines: [{ sku: '50891', title: 'Leica Q3', condition: 'Als nieuw', qty: 1, price: 4899 }],
    shipping: { name: 'Alex Mark', address: 'Herengracht 45, 1015 BA Amsterdam' },
    invoiceUrl: '#', trackingCode: '3SKABA9988776',
  },
  {
    id: 'CT028801', date: '2025-12-04', status: 'Afgerond', payStatus: 'Geretourneerd', payMethod: 'iDEAL', total: 1399,
    lines: [{ sku: '04400', title: 'Sony A7 III Body', condition: 'Goed', qty: 1, price: 1399 }],
    shipping: { name: 'Alex Mark', address: 'Meeuwenhof 23, 5103 KD Dongen' },
    invoiceUrl: '#',
  },
];

type QuoteStatus = 'Open' | 'Geaccepteerd' | 'Vervallen' | 'Afgewezen';
type Quote = {
  id: string;
  date: string;
  status: QuoteStatus;
  expiresAt: string;
  total: number;
  type: 'Inkoop' | 'Trade-in';
  items: { title: string; condition: string; price: number }[];
};

const MOCK_QUOTES: Quote[] = [
  {
    id: 'Q-2026-031', date: '2026-03-12', status: 'Open',         expiresAt: '2026-03-26', total: 1850, type: 'Inkoop',
    items: [
      { title: 'Canon EOS R5 Body',          condition: 'Uitstekend', price: 1650 },
      { title: 'Canon RF 50mm f/1.2L USM',   condition: 'Goed',       price: 200 },
    ],
  },
  {
    id: 'Q-2026-018', date: '2026-02-08', status: 'Geaccepteerd', expiresAt: '2026-02-22', total: 950,  type: 'Trade-in',
    items: [{ title: 'Sony A7 III Body', condition: 'Goed', price: 950 }],
  },
  {
    id: 'Q-2025-241', date: '2025-11-19', status: 'Vervallen',    expiresAt: '2025-12-03', total: 420,  type: 'Inkoop',
    items: [{ title: 'Sigma 24-70mm f/2.8 Art', condition: 'Gebruikt', price: 420 }],
  },
];

type Address = {
  id: string;
  label: string;
  type: 'shipping' | 'billing' | 'both';
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  name: string;
  company?: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1', label: 'Thuis', type: 'both', isDefaultShipping: true, isDefaultBilling: true,
    name: 'Alex Mark', street: 'Meeuwenhof', houseNumber: '23',
    postalCode: '5103 KD', city: 'Dongen', country: 'Nederland',
  },
  {
    id: 'addr-2', label: 'Studio Amsterdam', type: 'shipping', isDefaultShipping: false, isDefaultBilling: false,
    name: 'Alex Mark', company: 'Mark Photography',
    street: 'Herengracht', houseNumber: '45',
    postalCode: '1015 BA', city: 'Amsterdam', country: 'Nederland',
  },
];

type VaultItem = {
  id: string;
  title: string;
  brand: string;
  category: 'camera' | 'lens' | 'accessory';
  serial: string;
  purchaseDate: string;
  warrantyUntil?: string;
  shop: string;
  shutterCount?: number;
  notes?: string;
  image?: string;
};

const MOCK_VAULT: VaultItem[] = [
  {
    id: 'v-1', title: 'Sony A7 IV Body', brand: 'Sony', category: 'camera',
    serial: '4250412', purchaseDate: '2026-03-09', warrantyUntil: '2028-03-09',
    shop: 'Camify', shutterCount: 12_400,
  },
  {
    id: 'v-2', title: 'Sigma 35mm f/1.4 DG DN Art', brand: 'Sigma', category: 'lens',
    serial: '55217803', purchaseDate: '2026-02-21', warrantyUntil: '2028-02-21',
    shop: 'Camify',
  },
  {
    id: 'v-3', title: 'Canon EOS R5 Body', brand: 'Canon', category: 'camera',
    serial: '093021000234', purchaseDate: '2024-08-14', warrantyUntil: '2026-08-14',
    shop: 'Cameraland', shutterCount: 58_300,
    notes: 'Origineel gekocht — overweeg inkoop',
  },
];

/* Mock catalog voor "voeg toe uit DB" picker */
const CATALOG_PICK = [
  { title: 'Sony A7 IV',                  brand: 'Sony',   category: 'camera' as const },
  { title: 'Canon EOS R5',                brand: 'Canon',  category: 'camera' as const },
  { title: 'Nikon Z6 III',                brand: 'Nikon',  category: 'camera' as const },
  { title: 'Fujifilm X-T5',               brand: 'Fujifilm', category: 'camera' as const },
  { title: 'Leica Q3',                    brand: 'Leica',  category: 'camera' as const },
  { title: 'Sigma 35mm f/1.4 DG DN Art',  brand: 'Sigma',  category: 'lens'   as const },
  { title: 'Canon RF 50mm f/1.2L USM',    brand: 'Canon',  category: 'lens'   as const },
  { title: 'Sony FE 70-200mm f/2.8 GM II',brand: 'Sony',   category: 'lens'   as const },
  { title: 'Peak Design Slide strap',     brand: 'Peak Design', category: 'accessory' as const },
];

/* Seller / Buyer level + badges (Figma-geïnspireerd) */
type SellerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
const SELLER_TIERS: { name: SellerTier; min: number; color: string; bg: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { name: 'Bronze',   min: 0,   color: '#A16A3A', bg: '#FBF3EA', Icon: Medal },
  { name: 'Silver',   min: 5,   color: '#8B97A6', bg: '#F3F4F6', Icon: Medal },
  { name: 'Gold',     min: 15,  color: '#D4A22E', bg: '#FEF6DE', Icon: Trophy },
  { name: 'Platinum', min: 35,  color: '#5B7C9D', bg: '#EEF2F7', Icon: Gem },
  { name: 'Diamond',  min: 75,  color: '#3DA5C9', bg: '#E6F4F9', Icon: Crown },
];

type Badge = {
  key: string;
  label: string;
  description: string;
  Icon: React.ComponentType<{ size?: number }>;
  unlocked: boolean;
  progress?: { current: number; goal: number };
};

const MOCK_BADGES: Badge[] = [
  { key: 'first-sale',    label: 'Eerste verkoop',  description: 'Sluit je eerste verkoop af',                 Icon: Sparkles,    unlocked: true },
  { key: 'bronze',        label: 'Bronze seller',   description: 'Verkoop 5 producten',                         Icon: Medal,       unlocked: true },
  { key: 'silver',        label: 'Silver seller',   description: 'Verkoop 15 producten',                        Icon: Medal,       unlocked: true },
  { key: 'gold',          label: 'Gold seller',     description: 'Verkoop 35 producten',                        Icon: Trophy,      unlocked: false, progress: { current: 21, goal: 35 } },
  { key: 'platinum',      label: 'Platinum seller', description: 'Verkoop 75 producten',                        Icon: Gem,         unlocked: false },
  { key: 'power-trader',  label: 'Power trader',    description: '10 trade-ins in een jaar',                    Icon: Repeat,      unlocked: false, progress: { current: 4, goal: 10 } },
  { key: 'quick-flip',    label: 'Quick flip',      description: 'Verkoop binnen 7 dagen na inkoop',            Icon: Rocket,      unlocked: false },
  { key: 'steady',        label: 'Steady seller',   description: '6 maanden op rij verkopen',                   Icon: Target,      unlocked: false, progress: { current: 3, goal: 6 } },
  { key: 'cinema',        label: 'Cinema expert',   description: 'Verkoop een cinema-camera of cine-lens',      Icon: Camera,      unlocked: true },
  { key: 'gear-mogul',    label: 'Gear mogul',      description: 'Vault met 10+ items',                         Icon: Aperture,    unlocked: false, progress: { current: 3, goal: 10 } },
  { key: 'verified',      label: 'Verified seller', description: 'Identiteit geverifieerd',                     Icon: ShieldCheck, unlocked: true },
  { key: 'top-streak',    label: 'Hot streak',      description: '5 reviews ≥ 4★ op rij',                       Icon: Flame,       unlocked: false, progress: { current: 2, goal: 5 } },
];

/* ------------------------------------------------------------------ */
/*  Small UI helpers                                                   */
/* ------------------------------------------------------------------ */
function Card({ children, padding = 20, style }: { children: React.ReactNode; padding?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, action }: { icon?: React.ComponentType<{ size?: number }>; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 700, color: DARK, margin: 0 }}>
        {Icon && <Icon size={18} />}
        {title}
      </h2>
      {action}
    </div>
  );
}

function Pill({ children, color = GREY, bg = SURFACE }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, color, background: bg,
    }}>{children}</span>
  );
}

function statusPill(s: OrderStatus | PayStatus | QuoteStatus) {
  const map: Record<string, { color: string; bg: string }> = {
    'Nieuw':           { color: BLUE,  bg: BLUE_BG },
    'In behandeling':  { color: AMBER, bg: AMBER_BG },
    'Verzonden':       { color: BLUE,  bg: BLUE_BG },
    'Afgerond':        { color: GREEN, bg: GREEN_BG },
    'Geannuleerd':     { color: RED,   bg: RED_BG },
    'Betaald':         { color: GREEN, bg: GREEN_BG },
    'Openstaand':      { color: AMBER, bg: AMBER_BG },
    'Geretourneerd':   { color: GREY,  bg: SURFACE },
    'Open':            { color: AMBER, bg: AMBER_BG },
    'Geaccepteerd':    { color: GREEN, bg: GREEN_BG },
    'Vervallen':       { color: GREY,  bg: SURFACE },
    'Afgewezen':       { color: RED,   bg: RED_BG },
  };
  const t = map[s] || { color: GREY, bg: SURFACE };
  return <Pill color={t.color} bg={t.bg}>{s}</Pill>;
}

function Button({
  children, onClick, variant = 'primary', size = 'md', icon: Icon, disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: React.ComponentType<{ size?: number }>;
  disabled?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: ACCENT, color: WHITE, border: `1px solid ${ACCENT}` },
    secondary: { background: WHITE,  color: DARK,  border: `1px solid ${BORDER}` },
    ghost:     { background: 'transparent', color: DARK, border: '1px solid transparent' },
    danger:    { background: WHITE, color: RED, border: `1px solid ${BORDER}` },
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '9px 16px', fontSize: 13 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant], ...sizes[size],
        display: 'inline-flex', alignItems: 'center', gap: 6,
        borderRadius: 8, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontFamily: 'inherit', transition: 'all .15s',
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Field({ label, value, action }: { label: string; value: string | React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', border: `1px solid ${BORDER}`, borderRadius: 10, gap: 12,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: GREY, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: DARK, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
      </div>
      {action}
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
      <div style={{ flex: 1, height: 6, background: SURFACE, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: ACCENT, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11, color: GREY, fontWeight: 600, minWidth: 38, textAlign: 'right' }}>
        {value}/{max}
      </span>
    </div>
  );
}

const fmtEUR = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */
function OverviewSection({ onNav }: { onNav: (k: SectionKey) => void }) {
  const tier = SELLER_TIERS[2]; // Gold
  const next = SELLER_TIERS[3]; // Platinum
  const TierIcon = tier.Icon;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card padding={24}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>👋</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: DARK, margin: 0 }}>
            Welkom terug, {MOCK_USER.firstName}!
          </h1>
        </div>
        <p style={{ fontSize: 14, color: GREY, margin: 0, lineHeight: 1.6 }}>
          Hier vind je je bestellingen, quotes en gear. Je bent klant sinds {fmtDate(MOCK_USER.memberSince)}.
        </p>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Orders',           value: MOCK_USER.ordersCount, sub: 'totaal',            Icon: ShoppingBag, click: 'orders' as SectionKey },
          { label: 'Open quotes',      value: MOCK_QUOTES.filter(q => q.status === 'Open').length, sub: 'wachten op je', Icon: FileText, click: 'quotes' as SectionKey },
          { label: 'In vault',         value: MOCK_VAULT.length, sub: 'jouw gear',             Icon: Archive,    click: 'vault' as SectionKey },
          { label: 'Totaal besteed',   value: fmtEUR(MOCK_USER.totalSpent), sub: 'lifetime',   Icon: Receipt,    click: 'orders' as SectionKey },
        ].map(s => {
          const SIcon = s.Icon;
          return (
            <button key={s.label} onClick={() => onNav(s.click)} style={{
              background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: 18, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: GREY, fontWeight: 500 }}>{s.label}</span>
                <SIcon size={16} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: DARK }}>{s.value}</div>
              <div style={{ fontSize: 11, color: GREY_LIGHT }}>{s.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Seller level card */}
      <Card padding={0}>
        <div style={{ padding: 20, background: tier.bg, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: WHITE,
            display: 'grid', placeItems: 'center', color: tier.color, boxShadow: '0 2px 6px rgba(0,0,0,.06)',
          }}>
            <TierIcon size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: GREY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Huidig seller level
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: DARK }}>
              {tier.name} seller
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNav('achievements')}>
            Bekijk details
          </Button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: DARK, fontWeight: 600 }}>
              <Lock size={14} />
              Volgend level: {next.name}
            </div>
            <span style={{ fontSize: 12, color: GREY }}>Nog 14 verkopen te gaan</span>
          </div>
          <ProgressBar value={21} max={35} />
        </div>
      </Card>

      {/* Recente orders */}
      <Card>
        <SectionTitle icon={ShoppingBag} title="Recente orders" action={
          <Button variant="ghost" size="sm" onClick={() => onNav('orders')}>Alles bekijken <ChevronRight size={14} /></Button>
        } />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK_ORDERS.slice(0, 3).map(o => (
            <div key={o.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', border: `1px solid ${BORDER}`, borderRadius: 10, gap: 10,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{o.id}</div>
                <div style={{ fontSize: 12, color: GREY }}>{fmtDate(o.date)} · {o.lines.length} {o.lines.length === 1 ? 'product' : 'producten'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {statusPill(o.status)}
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, minWidth: 70, textAlign: 'right' }}>
                  {fmtEUR(o.total)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OrdersSection({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <SectionTitle icon={ShoppingBag} title="Mijn orders" />
      <Card padding={0}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {MOCK_ORDERS.map((o, i) => (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: 16,
                padding: '16px 20px', border: 'none', background: 'transparent',
                borderBottom: i < MOCK_ORDERS.length - 1 ? `1px solid ${BORDER}` : 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 4 }}>{o.id}</div>
                <div style={{ fontSize: 12, color: GREY }}>
                  {fmtDate(o.date)} · {o.lines.length} {o.lines.length === 1 ? 'product' : 'producten'} · {o.payMethod}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {statusPill(o.payStatus)}
                {statusPill(o.status)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK, minWidth: 80, textAlign: 'right' }}>
                {fmtEUR(o.total)}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OrderDetailSection({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const o = MOCK_ORDERS.find(x => x.id === orderId) || MOCK_ORDERS[0];
  return (
    <div>
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>Terug naar orders</Button>
      <div style={{ height: 12 }} />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0, marginBottom: 4 }}>Order {o.id}</h2>
            <div style={{ fontSize: 13, color: GREY }}>Geplaatst op {fmtDate(o.date)}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statusPill(o.payStatus)}
            {statusPill(o.status)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          <Field label="Bezorgadres" value={<>{o.shipping.name}<br /><span style={{ color: GREY, fontWeight: 400 }}>{o.shipping.address}</span></>} />
          <Field label="Betaalmethode" value={o.payMethod} />
          {o.trackingCode && (
            <Field label="Track & trace" value={<a href="#" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>{o.trackingCode}</a>} />
          )}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>Producten</div>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
          {o.lines.map((l, i) => (
            <div key={l.sku} style={{
              display: 'grid', gridTemplateColumns: '56px 1fr auto auto', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderBottom: i < o.lines.length - 1 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: SURFACE, display: 'grid', placeItems: 'center', color: GREY_LIGHT }}>
                <Camera size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{l.title}</div>
                <div style={{ fontSize: 12, color: GREY }}>SKU {l.sku} · {l.condition}</div>
              </div>
              <div style={{ fontSize: 12, color: GREY }}>×{l.qty}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: DARK, minWidth: 80, textAlign: 'right' }}>{fmtEUR(l.price)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '14px 16px', background: SURFACE, borderRadius: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Totaal</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{fmtEUR(o.total)}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          <Button icon={Receipt} variant="secondary">Download factuur</Button>
          <Button icon={Repeat} variant="secondary">Bestel opnieuw</Button>
          <Button icon={FileText} variant="ghost">Vraag hulp</Button>
        </div>
      </Card>
    </div>
  );
}

function QuotesSection() {
  return (
    <div>
      <SectionTitle icon={FileText} title="Mijn quotes" action={
        <Button icon={Plus} size="sm">Nieuwe inkoop-quote</Button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_QUOTES.map(q => (
          <Card key={q.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{q.id}</span>
                  <Pill color={GREY} bg={SURFACE}>{q.type}</Pill>
                  {statusPill(q.status)}
                </div>
                <div style={{ fontSize: 12, color: GREY }}>
                  Aangevraagd {fmtDate(q.date)}
                  {q.status === 'Open' && <> · vervalt {fmtDate(q.expiresAt)}</>}
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: DARK }}>{fmtEUR(q.total)}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {q.items.map((it, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', background: SURFACE, borderRadius: 8,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: DARK }}>{it.title}</div>
                    <div style={{ fontSize: 11, color: GREY }}>Staat: {it.condition}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{fmtEUR(it.price)}</span>
                </div>
              ))}
            </div>

            {q.status === 'Open' && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button icon={Check}>Accepteer quote</Button>
                <Button variant="secondary">Stel vraag</Button>
                <Button variant="ghost">Afwijzen</Button>
              </div>
            )}
            {q.status === 'Geaccepteerd' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button icon={Package} variant="secondary">Bekijk verzendinstructies</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function VaultSection({ items, setItems }: { items: VaultItem[]; setItems: (v: VaultItem[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedTitle, setPickedTitle] = useState('');
  const [pickedBrand, setPickedBrand] = useState('');
  const [pickedCategory, setPickedCategory] = useState<'camera' | 'lens' | 'accessory'>('camera');
  const [serial, setSerial] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyUntil, setWarrantyUntil] = useState('');
  const [shop, setShop] = useState('Camify');

  const reset = () => {
    setPickedTitle(''); setPickedBrand(''); setPickedCategory('camera');
    setSerial(''); setPurchaseDate(''); setWarrantyUntil(''); setShop('Camify');
    setAdding(false); setPickerOpen(false);
  };

  const save = () => {
    if (!pickedTitle || !serial) return;
    const item: VaultItem = {
      id: `v-${Date.now()}`,
      title: pickedTitle, brand: pickedBrand, category: pickedCategory,
      serial, purchaseDate, warrantyUntil, shop,
    };
    setItems([item, ...items]);
    reset();
  };

  const remove = (id: string) => setItems(items.filter(i => i.id !== id));

  const iconFor = (c: VaultItem['category']) =>
    c === 'camera' ? Camera : c === 'lens' ? Aperture : Package;

  return (
    <div>
      <SectionTitle icon={Archive} title="Mijn producten (Vault)" action={
        <Button icon={Plus} onClick={() => setAdding(true)}>Voeg toe</Button>
      } />

      <Card style={{ marginBottom: 16, background: ACCENT_BG, border: `1px solid ${ACCENT}33` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Sparkles size={20} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>
              Hou je gear bij op één plek
            </div>
            <div style={{ fontSize: 12, color: GREY, lineHeight: 1.5 }}>
              Bewaar serienummers, koopdatum en garantie. Items uit je vault kun je in één klik aan een nieuwe inkoop-quote toevoegen.
            </div>
          </div>
        </div>
      </Card>

      {adding && (
        <Card style={{ marginBottom: 16, borderColor: ACCENT }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>Nieuw item toevoegen</h3>
            <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GREY }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: GREY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Product</div>
            {pickedTitle ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, background: SURFACE,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>
                  {pickedTitle}
                  <span style={{ color: GREY, fontWeight: 400, marginLeft: 6 }}>· {pickedBrand}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setPickedTitle(''); setPickerOpen(true); }}>Wijzig</Button>
              </div>
            ) : !pickerOpen ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>Kies uit Camify-catalogus</Button>
                <Button variant="ghost" size="sm" onClick={() => setPickedTitle('Eigen item')}>Of voer handmatig in</Button>
              </div>
            ) : (
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
                {CATALOG_PICK.map(c => {
                  const I = c.category === 'camera' ? Camera : c.category === 'lens' ? Aperture : Package;
                  return (
                    <button
                      key={c.title}
                      onClick={() => { setPickedTitle(c.title); setPickedBrand(c.brand); setPickedCategory(c.category); setPickerOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer',
                        textAlign: 'left', fontFamily: 'inherit', borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <I size={16} />
                      <span style={{ fontSize: 13, color: DARK, fontWeight: 500 }}>{c.title}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: GREY }}>{c.brand}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <InputField label="Serienummer" value={serial} onChange={setSerial} placeholder="bv. 4250412" />
            <InputField label="Koopdatum" value={purchaseDate} onChange={setPurchaseDate} type="date" />
            <InputField label="Garantie tot" value={warrantyUntil} onChange={setWarrantyUntil} type="date" />
            <InputField label="Winkel" value={shop} onChange={setShop} placeholder="Camify, Cameraland, MPB…" />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Button onClick={save} disabled={!pickedTitle || !serial}>Toevoegen aan vault</Button>
            <Button variant="ghost" onClick={reset}>Annuleer</Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {items.map(it => {
          const I = iconFor(it.category);
          const inWarranty = it.warrantyUntil && new Date(it.warrantyUntil) > new Date();
          return (
            <Card key={it.id} padding={0}>
              <div style={{ padding: 18, display: 'flex', gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, background: SURFACE,
                  display: 'grid', placeItems: 'center', color: ACCENT, flexShrink: 0,
                }}>
                  <I size={24} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 2 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: GREY, marginBottom: 8 }}>{it.brand}</div>
                  {inWarranty ? (
                    <Pill color={GREEN} bg={GREEN_BG}><ShieldCheck size={11} /> In garantie</Pill>
                  ) : it.warrantyUntil ? (
                    <Pill color={GREY} bg={SURFACE}>Garantie verlopen</Pill>
                  ) : null}
                </div>
              </div>
              <div style={{ padding: '0 18px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <Meta label="Serienr." value={it.serial} icon={Hash} />
                <Meta label="Gekocht" value={fmtDate(it.purchaseDate)} icon={Calendar} />
                <Meta label="Winkel" value={it.shop} icon={ShoppingBag} />
                {it.warrantyUntil && <Meta label="Garantie t/m" value={fmtDate(it.warrantyUntil)} icon={ShieldCheck} />}
                {it.shutterCount !== undefined && (
                  <Meta label="Shuttercount" value={it.shutterCount.toLocaleString('nl-NL')} icon={Camera} />
                )}
              </div>
              <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 12px', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button variant="ghost" size="sm" icon={FileText}>Aan quote</Button>
                <Button variant="ghost" size="sm" icon={Pencil}>Wijzig</Button>
                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => remove(it.id)}>Verwijder</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Meta({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: GREY, fontWeight: 500, marginBottom: 2 }}>
        <Icon size={11} /> {label}
      </div>
      <div style={{ color: DARK, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: GREY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8,
          fontSize: 13, color: DARK, fontFamily: 'inherit', outline: 'none', background: WHITE,
        }}
      />
    </div>
  );
}

function AddressesSection({ addresses, setAddresses }: { addresses: Address[]; setAddresses: (a: Address[]) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const remove = (id: string) => setAddresses(addresses.filter(a => a.id !== id));
  const setDefault = (id: string, kind: 'shipping' | 'billing') =>
    setAddresses(addresses.map(a => ({
      ...a,
      isDefaultShipping: kind === 'shipping' ? a.id === id : a.isDefaultShipping,
      isDefaultBilling:  kind === 'billing'  ? a.id === id : a.isDefaultBilling,
    })));

  return (
    <div>
      <SectionTitle icon={MapPin} title="Adressen" action={
        <Button icon={Plus} onClick={() => setAdding(true)}>Nieuw adres</Button>
      } />

      {(adding || editing) && (
        <Card style={{ marginBottom: 16, borderColor: ACCENT }}>
          <AddressForm
            initial={editing ? addresses.find(a => a.id === editing) : undefined}
            onCancel={() => { setAdding(false); setEditing(null); }}
            onSave={(addr) => {
              if (editing) {
                setAddresses(addresses.map(a => a.id === editing ? { ...addr, id: editing } : a));
              } else {
                setAddresses([...addresses, { ...addr, id: `addr-${Date.now()}` }]);
              }
              setAdding(false); setEditing(null);
            }}
          />
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
        {addresses.map(a => (
          <Card key={a.id} padding={0}>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{a.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {a.isDefaultShipping && <Pill color={ACCENT} bg={ACCENT_BG}>Std. verzend</Pill>}
                  {a.isDefaultBilling && <Pill color={ACCENT} bg={ACCENT_BG}>Std. factuur</Pill>}
                </div>
              </div>
              <div style={{ fontSize: 13, color: DARK, lineHeight: 1.6 }}>
                {a.name}<br />
                {a.company && <>{a.company}<br /></>}
                {a.street} {a.houseNumber}<br />
                {a.postalCode} {a.city}<br />
                {a.country}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, padding: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(a.id)}>Wijzig</Button>
              {!a.isDefaultShipping && (
                <Button variant="ghost" size="sm" onClick={() => setDefault(a.id, 'shipping')}>Maak std. verzend</Button>
              )}
              {!a.isDefaultBilling && (
                <Button variant="ghost" size="sm" onClick={() => setDefault(a.id, 'billing')}>Maak std. factuur</Button>
              )}
              <Button variant="ghost" size="sm" icon={Trash2} onClick={() => remove(a.id)}>Verwijder</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddressForm({ initial, onSave, onCancel }: {
  initial?: Address;
  onSave: (a: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label || '');
  const [name, setName] = useState(initial?.name || '');
  const [company, setCompany] = useState(initial?.company || '');
  const [street, setStreet] = useState(initial?.street || '');
  const [houseNumber, setHouseNumber] = useState(initial?.houseNumber || '');
  const [postalCode, setPostalCode] = useState(initial?.postalCode || '');
  const [city, setCity] = useState(initial?.city || '');
  const [country, setCountry] = useState(initial?.country || 'Nederland');
  const [defaultShipping, setDefaultShipping] = useState(initial?.isDefaultShipping || false);
  const [defaultBilling, setDefaultBilling] = useState(initial?.isDefaultBilling || false);

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: '0 0 14px' }}>
        {initial ? 'Adres wijzigen' : 'Nieuw adres'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        <InputField label="Label" value={label} onChange={setLabel} placeholder="Thuis, werk, studio…" />
        <InputField label="Naam" value={name} onChange={setName} />
        <InputField label="Bedrijf (optioneel)" value={company} onChange={setCompany} />
        <InputField label="Land" value={country} onChange={setCountry} />
        <InputField label="Straat" value={street} onChange={setStreet} />
        <InputField label="Huisnr." value={houseNumber} onChange={setHouseNumber} />
        <InputField label="Postcode" value={postalCode} onChange={setPostalCode} />
        <InputField label="Plaats" value={city} onChange={setCity} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 13, color: DARK }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={defaultShipping} onChange={(e) => setDefaultShipping(e.target.checked)} />
          Standaard verzendadres
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={defaultBilling} onChange={(e) => setDefaultBilling(e.target.checked)} />
          Standaard factuuradres
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button onClick={() => onSave({
          label, name, company: company || undefined, street, houseNumber, postalCode, city, country,
          isDefaultShipping: defaultShipping, isDefaultBilling: defaultBilling,
          type: defaultBilling && defaultShipping ? 'both' : defaultBilling ? 'billing' : 'shipping',
        })} disabled={!label || !name || !street || !city}>
          Opslaan
        </Button>
        <Button variant="ghost" onClick={onCancel}>Annuleer</Button>
      </div>
    </div>
  );
}

function PersonalSection() {
  return (
    <div>
      <SectionTitle icon={User} title="Persoonsgegevens" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field
          label="Naam"
          value={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
          action={<Button variant="secondary" size="sm" icon={Pencil}>Wijzig</Button>}
        />
        <Field
          label="E-mailadres"
          value={MOCK_USER.email}
          action={<Button variant="secondary" size="sm" icon={Pencil}>Wijzig</Button>}
        />
        <Field
          label="Telefoonnummer"
          value={MOCK_USER.phone}
          action={<Button variant="secondary" size="sm" icon={Pencil}>Wijzig</Button>}
        />
        <Field
          label="Twee-staps-verificatie"
          value={
            <>
              {MOCK_USER.twoFactor ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Authenticator app <Pill color={GREEN} bg={GREEN_BG}><Check size={11} /> Actief</Pill>
                </span>
              ) : 'Niet ingesteld'}
            </>
          }
          action={<Button variant="secondary" size="sm">Wijzig methode</Button>}
        />
        <Field
          label="Wachtwoord"
          value="••••••••••"
          action={<Button variant="secondary" size="sm" icon={KeyRound}>Wijzig</Button>}
        />
      </div>

      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 12 }}>Gevarenzone</h3>
        <Card style={{ borderColor: '#FEE2E2', background: '#FEF2F2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 4 }}>Verwijder mijn account</div>
              <div style={{ fontSize: 12, color: GREY }}>
                Je gegevens worden binnen 30 dagen volledig verwijderd. Lopende orders blijven afgehandeld.
              </div>
            </div>
            <Button variant="danger" size="sm" icon={Trash2}>Verwijder account</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AchievementsSection() {
  const sellerTier = SELLER_TIERS[2]; // Gold
  const next = SELLER_TIERS[3];
  const SI = sellerTier.Icon;
  const NI = next.Icon;
  return (
    <div>
      <SectionTitle icon={Trophy} title="Level & badges" />

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        <Card padding={0}>
          <div style={{ padding: 18, background: sellerTier.bg, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: WHITE, display: 'grid', placeItems: 'center', color: sellerTier.color }}>
              <SI size={24} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: GREY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Huidig level</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{sellerTier.name} seller</div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: GREY, fontWeight: 600 }}>
                <Lock size={11} style={{ verticalAlign: '-1px' }} /> Volgend: {next.name}
              </span>
              <span style={{ fontSize: 12, color: GREY }}>60%</span>
            </div>
            <ProgressBar value={21} max={35} />
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: 18, background: SURFACE, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: WHITE, display: 'grid', placeItems: 'center', color: GREY }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: GREY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Buyer rating</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: DARK }}>Platinum buyer</div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: GREY, marginBottom: 8 }}>14 orders · {fmtEUR(MOCK_USER.totalSpent)} lifetime</div>
            <ProgressBar value={14} max={20} />
          </div>
        </Card>
      </div>

      {/* Tier ladder */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon={Star} title="Tier-overzicht" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {SELLER_TIERS.map((t, i) => {
            const TI = t.Icon;
            const isCurrent = t.name === sellerTier.name;
            const isPast = i < SELLER_TIERS.findIndex(x => x.name === sellerTier.name);
            return (
              <div key={t.name} style={{
                padding: 14, borderRadius: 12, background: isCurrent ? t.bg : SURFACE,
                border: isCurrent ? `2px solid ${t.color}` : `1px solid ${BORDER}`,
                textAlign: 'center', position: 'relative',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: WHITE,
                  display: 'grid', placeItems: 'center', color: t.color,
                  margin: '0 auto 8px', opacity: isPast || isCurrent ? 1 : 0.4,
                }}>
                  <TI size={20} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{t.name}</div>
                <div style={{ fontSize: 11, color: GREY, marginTop: 2 }}>{t.min}+ verkopen</div>
                {isCurrent && <div style={{ fontSize: 10, color: t.color, fontWeight: 700, marginTop: 4 }}>JIJ NU</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Badge grid */}
      <Card>
        <SectionTitle icon={Award} title="Alle achievements" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {MOCK_BADGES.map(b => {
            const BI = b.Icon;
            return (
              <div key={b.key} style={{
                padding: 14, borderRadius: 12,
                background: b.unlocked ? GREEN_BG : SURFACE,
                border: `1px solid ${b.unlocked ? '#BBF7D0' : BORDER}`,
                opacity: b.unlocked ? 1 : 0.95, textAlign: 'center', position: 'relative',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: WHITE,
                  display: 'grid', placeItems: 'center', margin: '0 auto 8px',
                  color: b.unlocked ? ACCENT : GREY_LIGHT,
                }}>
                  <BI size={22} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{b.label}</div>
                <div style={{ fontSize: 10, color: GREY, lineHeight: 1.4, marginTop: 4, minHeight: 26 }}>
                  {b.description}
                </div>
                <div style={{ marginTop: 8 }}>
                  {b.unlocked ? (
                    <Pill color={GREEN} bg={WHITE}><Check size={10} /> Behaald</Pill>
                  ) : b.progress ? (
                    <ProgressBar value={b.progress.current} max={b.progress.goal} />
                  ) : (
                    <Pill color={GREY} bg={WHITE}><Lock size={10} /> Locked</Pill>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function NewsletterSection({ subscribed, setSubscribed }: { subscribed: boolean; setSubscribed: (b: boolean) => void }) {
  return (
    <div>
      <SectionTitle icon={Bell} title="Nieuwsbrief" />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 4 }}>
              Camify Nieuwsbrief
            </div>
            <div style={{ fontSize: 13, color: GREY, lineHeight: 1.5, maxWidth: 480 }}>
              Tips van fotografie-enthousiastelingen, nieuwe binnenkomers en exclusieve outlet-deals.
              Eens per twee weken, geen spam.
            </div>
          </div>
          <button
            onClick={() => setSubscribed(!subscribed)}
            aria-pressed={subscribed}
            style={{
              width: 48, height: 28, borderRadius: 999,
              background: subscribed ? ACCENT : '#D1D5DB',
              border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background .2s',
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: subscribed ? 23 : 3,
              width: 22, height: 22, borderRadius: '50%', background: WHITE,
              transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
            }} />
          </button>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}`, fontSize: 12, color: GREY }}>
          Status: {subscribed ? <strong style={{ color: GREEN }}>Aangemeld</strong> : <strong style={{ color: GREY }}>Niet aangemeld</strong>}
          {subscribed && ' — laatste e-mail verstuurd op 18 mei 2026.'}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [active, setActive] = useState<SectionKey>('overview');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [vault, setVault] = useState<VaultItem[]>(MOCK_VAULT);
  const [subscribed, setSubscribed] = useState(MOCK_USER.newsletter);

  // ?view= deep link for Pages export
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = new URLSearchParams(window.location.search).get('view');
    if (v && ['overview','orders','quotes','vault','addresses','personal','achievements','newsletter'].includes(v)) {
      setActive(v as SectionKey);
    }
    if (v === 'order-detail') { setActive('orders'); setSelectedOrder(MOCK_ORDERS[0].id); }
  }, []);

  const handleNav = (k: SectionKey) => {
    setActive(k);
    setSelectedOrder(null);
    setSidebarOpen(false);
  };

  const tier = SELLER_TIERS[2];
  const TI = tier.Icon;
  const displayName = user?.username || `${MOCK_USER.firstName} ${MOCK_USER.lastName}`;

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Mobile toggle */}
      <div className="account-mobile-toggle" style={{
        display: 'none', padding: '12px 16px',
        borderBottom: `1px solid ${BORDER}`, background: WHITE,
      }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'inherit', color: DARK,
          }}
        >
          ☰ Mijn account
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar */}
        <aside
          className="account-sidebar"
          style={{
            width: 280, minWidth: 280, background: WHITE,
            borderRight: `1px solid ${BORDER}`, display: 'flex',
            flexDirection: 'column', padding: '24px 0', position: 'relative',
          }}
        >
          {/* User card */}
          <div style={{ padding: '0 20px 20px', borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: ACCENT_BG,
                display: 'grid', placeItems: 'center', color: ACCENT,
                fontSize: 18, fontWeight: 700, flexShrink: 0,
              }}>
                {MOCK_USER.firstName.charAt(0)}{MOCK_USER.lastName.charAt(0)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 8px', background: tier.bg, color: tier.color,
                    borderRadius: 999, fontSize: 10, fontWeight: 700,
                  }}>
                    <TI size={10} /> {tier.name} seller
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1 }}>
            {NAV_GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom: 16 }}>
                <div style={{
                  padding: '0 20px 6px', fontSize: 10, fontWeight: 600,
                  textTransform: 'uppercase', color: GREY_LIGHT, letterSpacing: '.5px',
                }}>
                  {group.label}
                </div>
                {group.items.map(item => {
                  const Icon = item.Icon;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNav(item.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '9px 20px', border: 'none',
                        borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                        background: isActive ? ACCENT_BG : 'transparent',
                        color: isActive ? ACCENT : DARK,
                        fontSize: 13, fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                        transition: 'all .15s',
                      }}
                    >
                      <Icon size={16} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span style={{
                          background: ACCENT, color: WHITE, fontSize: 10, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 999, minWidth: 18, textAlign: 'center',
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}` }}>
            <button
              onClick={() => { logout(); router.push('/'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 0', border: 'none', background: 'transparent',
                color: GREY, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <LogOut size={16} />
              Uitloggen
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{
          flex: 1, background: SURFACE, padding: 28,
          overflowY: 'auto', minWidth: 0,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Section views — all in DOM, toggled with display for Pages-export friendliness */}
            <div style={{ display: active === 'overview' && !selectedOrder ? 'block' : 'none' }}>
              <OverviewSection onNav={handleNav} />
            </div>
            <div style={{ display: active === 'orders' && !selectedOrder ? 'block' : 'none' }}>
              <OrdersSection onSelect={(id) => setSelectedOrder(id)} />
            </div>
            <div style={{ display: active === 'orders' && selectedOrder ? 'block' : 'none' }}>
              <OrderDetailSection orderId={selectedOrder || MOCK_ORDERS[0].id} onBack={() => setSelectedOrder(null)} />
            </div>
            <div style={{ display: active === 'quotes' ? 'block' : 'none' }}>
              <QuotesSection />
            </div>
            <div style={{ display: active === 'vault' ? 'block' : 'none' }}>
              <VaultSection items={vault} setItems={setVault} />
            </div>
            <div style={{ display: active === 'addresses' ? 'block' : 'none' }}>
              <AddressesSection addresses={addresses} setAddresses={setAddresses} />
            </div>
            <div style={{ display: active === 'personal' ? 'block' : 'none' }}>
              <PersonalSection />
            </div>
            <div style={{ display: active === 'achievements' ? 'block' : 'none' }}>
              <AchievementsSection />
            </div>
            <div style={{ display: active === 'newsletter' ? 'block' : 'none' }}>
              <NewsletterSection subscribed={subscribed} setSubscribed={setSubscribed} />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .account-mobile-toggle { display: block !important; }
          .account-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: ${sidebarOpen ? '0' : '-300px'} !important;
            height: 100vh !important;
            z-index: 1000 !important;
            box-shadow: ${sidebarOpen ? '4px 0 20px rgba(0,0,0,.1)' : 'none'} !important;
            transition: left .3s ease !important;
          }
        }
      `}</style>
    </div>
  );
}
