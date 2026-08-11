/* ──────────────────────────────────────────────────────────────
   THE STORY — one fictional seller, used everywhere on this site.

   Every demo, screenshot, chat transcript, and mockup pulls from
   this file. A visitor who scrolls the whole page should feel like
   they've been watching one real account the entire time, not six
   unrelated screenshots.

   The seller:  Ridgeline Apparel — sells shirts and hats on Amazon.
   Two suppliers, one product line each, so any supplier-scoped
   visual is instantly readable:

     Lianfa Textiles     (Ningbo)    → shirts only
     Dongfeng Headwear   (Dongguan)  → hats only

   SKUs are deliberately guessable at a glance:
     SHIRT-RED-M · SHIRT-BLU-L · SHIRT-GRN-S
     HAT-BLK-OS  · HAT-NVY-OS  · HAT-RED-OS

   Product art lives in /public/products/*.svg — flat, single-color
   silhouettes so the color alone identifies the SKU in a table.
   ────────────────────────────────────────────────────────────── */

export const BRAND = 'Ridgeline Apparel';

/* Lead times are uniform across every demo on the site — 25 + 45 + 7
   = 77 days door to door — so a reader can check the arithmetic in
   their head and have it come out right wherever they look. */
export const LEAD = { production: 25, freight: 45, checkin: 7 };
export const LEAD_LEGS = '25d production · 45d freight · 7d check-in';

export const SUPPLIERS = {
  lianfa: {
    key: 'lianfa',
    name: 'Lianfa Textiles',
    city: 'Ningbo, China',
    contact: 'Wei',
    line: 'Shirts',
    leadDays: 25,
    terms: '30% deposit / 70% on completion',
    moq: 500,
  },
  dongfeng: {
    key: 'dongfeng',
    name: 'Dongfeng Headwear',
    city: 'Dongguan, China',
    contact: 'Mei',
    line: 'Hats',
    leadDays: 25,
    terms: '30% deposit / 70% before shipping',
    moq: 400,
  },
};

/* The seller's two teammates. They exist so the "shared across your
   team" and "who approves a PO" arguments have actual people in them.
   Roles are always stated on first mention. */
export const TEAM = {
  priya: { name: 'Priya', role: 'VA', scope: 'Day-to-day ordering and supplier follow-up' },
  dana: { name: 'Dana', role: 'Logistics manager', scope: 'Freight, liquidation, and anything over $10k' },
};

export const PRODUCTS = [
  {
    sku: 'SHIRT-RED-M', name: 'Crew Tee · Red · M', img: '/products/shirt-red.svg',
    color: '#DC2626', supplier: 'lianfa', cogs: 3.90,
  },
  {
    sku: 'SHIRT-BLU-L', name: 'Crew Tee · Blue · L', img: '/products/shirt-blue.svg',
    color: '#2563EB', supplier: 'lianfa', cogs: 3.90,
  },
  {
    sku: 'SHIRT-GRN-S', name: 'Crew Tee · Green · S', img: '/products/shirt-green.svg',
    color: '#16A34A', supplier: 'lianfa', cogs: 3.90,
  },
  {
    sku: 'HAT-BLK-OS', name: 'Dad Cap · Black · OS', img: '/products/hat-black.svg',
    color: '#2B2B2B', supplier: 'dongfeng', cogs: 2.80,
  },
  {
    sku: 'HAT-NVY-OS', name: 'Dad Cap · Navy · OS', img: '/products/hat-navy.svg',
    color: '#1E3A5F', supplier: 'dongfeng', cogs: 2.80,
  },
  {
    sku: 'HAT-RED-OS', name: 'Dad Cap · Red · OS', img: '/products/hat-red.svg',
    color: '#DC2626', supplier: 'dongfeng', cogs: 2.80,
  },
  /* The July 4th pair. These two exist to carry one specific point:
     a product whose demand is driven by a date the seller never
     configured. They spike for ~2 weeks and die on July 5th. */
  {
    sku: 'SHIRT-USA-M', name: 'Flag Tee · Stars & Stripes · M', img: '/products/shirt-usa.svg',
    color: '#1E3A8A', supplier: 'lianfa', cogs: 4.20, event: 'July 4th',
  },
  {
    sku: 'HAT-USA-OS', name: 'Flag Cap · Stars & Stripes · OS', img: '/products/hat-usa.svg',
    color: '#1E3A8A', supplier: 'dongfeng', cogs: 3.10, event: 'July 4th',
  },
];

export const bySku = Object.fromEntries(PRODUCTS.map(p => [p.sku, p]));
