/* ──────────────────────────────────────────────────────────────
   Pricing.

   Priced on orders per month rather than SKUs — the work the system
   does scales with order volume, not catalogue size, and a seller
   with 4,000 SKUs and light sales shouldn't pay like a high-volume
   one. Every plan carries every feature; the tier only sets the
   order allowance.

   Annual billing is 17% off: the yearly figure divided by twelve is
   the "billed annually" monthly rate, e.g. $790 / 12 = $66 against a
   $79 month-to-month rate.
   ────────────────────────────────────────────────────────────── */

export const ANNUAL_DISCOUNT = 17;

export const PLANS = [
  {
    name: 'Starter',
    monthly: 79,
    annual: 790,
    orders: '1,000',
    overage: '$0.05',
    tagline: 'For sellers just getting started',
    cta: 'Start free trial',
  },
  {
    name: 'Pro',
    monthly: 199,
    annual: 1990,
    orders: '5,000',
    overage: '$0.05',
    tagline: 'Most popular for growing brands',
    highlight: true,
    cta: 'Start free trial',
  },
  {
    name: 'Expert',
    monthly: 399,
    annual: 3990,
    orders: '20,000',
    overage: '$0.05',
    tagline: 'For high-volume operations',
    cta: 'Start free trial',
  },
  {
    name: 'Enterprise',
    monthly: 799,
    annual: 7990,
    orders: 'Unlimited',
    overage: null,
    tagline: 'For large-scale sellers',
    cta: 'Start free trial',
  },
];

/* Identical on every plan — the tier buys volume, not features. */
export const INCLUDED = [
  { title: 'Restock recommendations', desc: 'Order-by dates and quantities per SKU, recalculated daily.' },
  { title: 'AI demand forecasting', desc: 'Seasonality, Q4 lift, and events like Prime Day kept out of the baseline.' },
  { title: 'Shipment reconciliation', desc: 'Landed shipments matched back to the PO, short-receipts flagged.' },
  { title: 'Liquidation & price tiers', desc: 'What to discount, what to hold, what to clear — with the profit math.' },
  { title: 'Cashflow planner', desc: 'Invoices matched to POs, run against payouts and bank balances.' },
  { title: 'AI Knowledge Center', desc: 'Your operating knowledge, written down and shared with the team.' },
  { title: 'MCP access', desc: 'Run the whole thing from Claude, in plain English.' },
  { title: 'Unlimited everything else', desc: 'SKUs, users, suppliers, marketplaces, and warehouses.' },
];

export const TRIAL = ['30-day free trial', 'No credit card required', 'Secure checkout via Stripe'];
