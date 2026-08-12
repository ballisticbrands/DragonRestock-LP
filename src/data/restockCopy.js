/* Text-only page copy, in a JSX-free module so BOTH the React pages and the
 * build-time prerender (scripts/postbuild-spa-routes.mjs) read the SAME strings.
 *
 * ⚠️ WHY THIS FILE EXISTS: the prerender can only import JSX-free data. On
 * DragonRefunds the page copy lived inside the page component next to icon
 * components, so crawlers saw a 46-WORD homepage — and Google Ads scored
 * landing page experience BELOW_AVERAGE on 24 of 27 keywords, pinning Quality
 * Score at 2/10. Per-route <title>s were necessary and nowhere near enough: a
 * 46-word page cannot earn a decent score however well it is tagged. Ad Rank =
 * bid × Quality Score, so this inflates CPC on every click AND suppresses
 * impressions, and it makes Google index every route as a duplicate.
 *
 * RULE: page copy lives HERE (plain strings); the JSX supplies icons, demos
 * and layout only. Never inline new marketing copy directly in a component —
 * the prerender cannot see it and the page silently goes thin again.
 *
 * `key` / `id` fields exist so the JSX can attach an icon or a demo component
 * to an entry without the text having to know anything about React. */

export const HERO_COPY = {
  h1: 'Your restock plan, ready to approve.',
  sub: 'It works out what to order and when, lays out the reasoning, and waits for one click. All the granularity of SoStocked, with AI doing the thinking behind the scenes.',
  badges: [
    'Trained on your full seller history',
    'Set up in 10 minutes',
    'Every marketplace & warehouse',
  ],
  reassurances: ['Free 30-day trial', 'No credit card', 'Your data syncs in hours'],
};

/* ─── Landing: the problem ─── */
export const PAINS_COPY = [
  {
    key: 'spreadsheet',
    title: 'A spreadsheet that’s wrong the moment you save it',
    body: 'Velocity, lead times, in-transit units, restock limits — all hand-maintained across tabs. One stale number and you either stock out or tie up cash in inventory you can’t sell.',
  },
  {
    key: 'lead-times',
    title: 'Lead times you can’t see around',
    body: 'By the time the dashboard says “low”, your supplier still needs 30 days, the boat needs 40, and Amazon needs a week to check it in. The decision was due months ago.',
  },
  {
    key: 'software',
    title: 'Software you’re not on top of',
    body: 'Owning a tool isn’t the same as running one. Stale lead times, an unreconciled shipment, a supplier nobody chased — the recommendation was fine, the operation around it wasn’t.',
  },
];

/* ─── Landing: the 10-minute setup ─── */
export const SETUP_STEPS_COPY = [
  {
    key: 'amazon',
    n: '01',
    title: 'Connect Amazon',
    body: 'One click through Seller Central. DragonRestock pulls your entire sales history, inventory, shipments, and fees — every marketplace, every brand.',
  },
  {
    key: 'claude',
    n: '02',
    title: 'Connect Claude',
    body: 'DragonRestock runs as an MCP server, so Claude can read and write your inventory directly. From here on you can do everything by asking.',
  },
  {
    key: 'costs',
    n: '03',
    title: 'Drop in your costs',
    body: 'Paste a Google Sheet link or upload a CSV — costs, lead times, MOQs, and suppliers. It maps the rows to your SKUs itself. No import wizard, no column mapping, no forms.',
  },
];

/* The three ways the ten-minute setup stops being ten minutes. Named plainly,
 * because a seller who quietly thinks "mine won't work" won't ask. */
export const SETUP_HELP_COPY = [
  {
    key: 'new-to-claude',
    title: 'You’ve never used Claude',
    body: 'Nothing to learn up front. Write to us and we’ll get you set up on it — account, connection, first plan — and you can go back to asking in plain English from there.',
  },
  {
    key: 'nonstandard',
    title: 'Your setup isn’t the standard one',
    body: 'Several entities, a 3PL nobody integrates with, kits and bundles, costs living in four different sheets. Tell us how you actually run it and we’ll do the mapping with you.',
  },
  {
    key: 'invoices',
    title: 'Your supplier invoices are their own thing',
    body: 'Per-container pricing, deposits split across POs, tooling and freight folded into a unit cost, a format only your supplier uses. Send us a real one and we’ll get it reading correctly.',
  },
];

/* ─── Landing: clear actionables ─── */
export const ANSWERS_COPY = [
  {
    key: 'instruction',
    title: 'An instruction, not an alert',
    body: '“Order 1,200 units of SHIRT-RED-M from Lianfa today.” A SKU, a quantity, a supplier, and a hard order-by date — not a red badge you have to go interpret.',
  },
  {
    key: 'reasoning',
    title: 'The reasoning, if you want it',
    body: 'Every number opens up: velocity, each leg of the lead time — production, freight, and Amazon check-in — and the seasonal multiplier behind it. Auditable when you care, invisible when you don’t.',
  },
  {
    key: 'next-step',
    title: 'The next step already taken',
    body: 'The PO is drafted at the right quantity — MOQs, case packs, and container fill already respected — priced, and checked against your cash. You approve, or you don’t.',
  },
];

/* ─── Landing: the platform, in full ───
 * Order matters: everything with a live demo first, matching /demo. */
export const PLATFORM_COPY = [
  { key: 'restock', title: 'Restock recommendations', desc: 'Order quantities and order-by dates from velocity, lead time and safety stock. Ranked by urgency.', href: '/demo#restock' },
  { key: 'lost-sales', title: 'Lost sales analysis', desc: 'Stockout days detected, lost units and revenue priced per SKU. The invisible number, made visible.', href: '/demo#lost-sales' },
  { key: 'forecasting', title: 'Demand forecasting', desc: 'Baseline velocity, seasonal multipliers and inventory-adjusted projections — with events kept out of the baseline.', href: '/demo#forecasting' },
  { key: 'purchase-orders', title: 'Purchase orders', desc: 'Plan in grid, Kanban or calendar. Track every PO from deposit through to check-in.', href: '/demo#inventory' },
  { key: 'reconciliation', title: 'Shipment reconciliation', desc: 'Landed FBA and AWD shipments matched back to the PO that sent them, with short-receipts flagged.', href: '/demo#inventory' },
  { key: 'knowledge', title: 'AI Knowledge Center', desc: 'Everything you know about your suppliers and SKUs, written down once and read by every teammate’s Claude.', href: '/demo#knowledge' },
  { key: 'liquidation', title: 'Liquidation & price tiers', desc: 'What to discount and to exactly what price, what to hold, and what to clear — with the profit math on each.', href: '/demo#liquidation' },
  { key: 'cashflow', title: 'Cashflow planner', desc: 'Invoices matched to their PO and run against Amazon payouts and bank balances, so timing gaps surface early.', href: '/demo#cashflow' },
  { key: 'low-inventory-fee', title: 'Low-inventory fee forecast', desc: 'The per-unit fee Amazon charges under 28 days of cover and never itemises — reconstructed, projected, and priced against the send-in that stops it.', href: '/demo#low-inventory-fee' },

  // and the rest of the platform, which the walkthrough doesn't cover
  { key: 'inventory', title: 'Inventory tracking', desc: 'FBA, AWD, 3PL and your own warehouses in one view, by SKU, ASIN or parent.' },
  { key: '3pl', title: '3PL manager', desc: 'Off-site stock beside your FBA counts, with send-in plans so it becomes cover instead of sitting there.' },
  { key: 'suppliers', title: 'Suppliers', desc: 'Contacts, payment terms, MOQs, case packs — and the lead times each supplier actually delivers on.' },
];

/* ─── /demo: the feature pillars ─── */
export const PILLARS_COPY = [
  {
    id: 'restock',
    eyebrow: 'Restock recommendations',
    title: 'It tells you what to do. Not what to look at.',
    body: 'Filters, alerts, and reports are just work in a nicer font — every one of them ends with you still having to decide. DragonRestock does the deciding and hands you the instruction: which SKU, how many units, which supplier, and the date the order has to go out.',
    bullets: [
      'An instruction, not an alert — SKU, quantity, supplier, order-by date',
      'Expand any row for velocity, lead-time legs and the seasonal multiplier',
      'MOQs, case packs and container fill already respected in the quantity',
      'Tick a subset and the supplier order reprices to your selection',
    ],
    shot: 'Restock recommendations',
  },
  {
    id: 'lost-sales',
    eyebrow: 'Lost sales analysis',
    title: 'Every stockout you’ve had, priced.',
    body: 'DragonRestock reconstructs a year of inventory state per SKU and lays your daily sales over it — red where you were out, amber where you were low. The flat line inside every red band is the money that didn’t happen.',
    bullets: [
      'Open a product for its full year of sales against inventory state',
      'Hover any day for units sold, expected baseline, and what it cost',
      'Revenue and profit loss both priced, net of referral and FBA fees',
      'Low-stock days counted too — you don’t have to hit zero to lose sales',
    ],
    shot: 'Lost sales analysis',
  },
  {
    id: 'forecasting',
    eyebrow: 'Forecasting',
    title: 'A forecast that knows your Q4 isn’t your July.',
    body: 'Velocity alone is a bad predictor. Prime Day triples your units for 48 hours — most tools read that as demand and have you order against a spike that was never coming back. DragonRestock separates real trend from event lift and forecasts off the baseline that’s actually yours.',
    bullets: [
      'Seasonality learned from your own sales history, not a category average',
      'Prime Day, Big Deal Days, and Black Friday modeled as events — not trend',
      'Stockout and suppressed-listing days excluded — no forecasting off zeros',
      'Lightning Deals, coupons, and PPC pushes flagged, not baked in',
    ],
    shot: 'Demand forecast with seasonality bands',
  },
  {
    id: 'inventory',
    eyebrow: 'Complete inventory overview',
    title: 'Every PO tracked, every shipment matched back to it.',
    body: 'Your real coverage isn’t what FBA shows. DragonRestock follows every purchase order from deposit to check-in — grid, board, or calendar — and when a shipment lands at FBA or AWD, it works out which PO it belongs to and tells you what came up short.',
    bullets: [
      'Grid, Kanban, and calendar views of every open PO',
      'AI matches landed shipments back to the PO that shipped them',
      'Short-received units flagged instead of quietly disappearing',
      'FBA, AWD, 3PL, and your own warehouses in one number',
    ],
    shot: 'Order tracker with AI shipment reconciliation',
  },
  {
    id: 'knowledge',
    eyebrow: 'AI Knowledge Center',
    title: 'The half of your operation that isn’t in any system.',
    body: 'Lianfa shuts for three weeks around Chinese New Year. The red tee needs a fatter buffer than everything else. Nothing over $10k goes out without Dana in logistics signing it. Right now that lives in your head — tell DragonRestock once and it’s written down, and drop in the spreadsheets you already run on so those land there too.',
    bullets: [
      'Say it once — it holds across every chat and every teammate',
      'Import the spreadsheets your business already runs on',
      'Your VA’s Claude reads the same entries yours does',
      'Nothing walks out the door when someone leaves',
    ],
    shot: 'AI Knowledge Center',
  },
];

/* ─── /demo: the differentiator bands ─── */
export const DIFFERENTIATORS_COPY = {
  liquidation: {
    eyebrow: 'Liquidation',
    title: 'Your dead stock is a decision, not an alert.',
    body: 'Other tools flag a SKU as aging and stop there — a badge, and the decision still sitting with you. But healthy inventory isn’t only about what you buy. DragonRestock recommends what to stop carrying too: which SKUs to discount and to exactly which price tier, which to hold because they’re seasonal rather than dead, and which to clear out — with the monthly profit worked out on every option.',
    bullets: [
      'A priced decision on every aging SKU, not a warning badge',
      'Discount tiers tested for real — it finds the price that moves units',
      'Monthly profit compared across every tier before you commit',
      'Knows when to hold: seasonal stock isn’t dead stock',
    ],
    shotLabel: 'Liquidation dashboard',
  },
  cashflow: {
    eyebrow: 'Cashflow',
    title: 'Know if you can afford the buy before you place it.',
    body: 'A restock plan you can’t fund isn’t a plan. Drop in a supplier invoice and DragonRestock reads it, works out which PO it belongs to, and lines the deposit and balance up against your Amazon payouts and the cash sitting in Wise and Payoneer — so you see the squeeze before you’re in it.',
    bullets: [
      'Upload an invoice — it matches itself to the right PO',
      'Amazon payouts and reimbursements, Wise and Payoneer balances, supplier terms — one timeline',
      'Deposits and balances tracked against the dates they actually fall due',
      'Catches timing gaps a monthly total hides completely',
      'Post the bill straight to Xero or QuickBooks — one click, no double entry',
    ],
    shotLabel: 'Cashflow planner',
  },
  'low-inventory-fee': {
    eyebrow: 'Low-inventory fee',
    title: 'The fee Amazon never shows you on a line of its own.',
    body: 'Run a SKU under 28 days of cover and Amazon charges you up to $1.36 a unit for it — folded into the fulfilment fee, itemised nowhere. DragonRestock replays the decision week by week to work out what you’ve already paid, projects the next quarter off your real velocity and your inbound POs, and sizes the send-in that makes it stop.',
    bullets: [
      'What you were charged, reconstructed — Amazon never itemises it',
      'Both windows checked, because the fee needs both to be under 28',
      'Projected forward with your inbound POs and transfers already in it',
      'Ends in a send-in — quantity, date, and the dollars it saves',
    ],
    shotLabel: 'Low-inventory fee forecast',
  },
};

/* ─── /pricing ─── */
export const PRICING_FAQS = [
  {
    q: 'What counts as an order?',
    a: 'A customer order synced from Seller Central, counted once no matter how many units or line items it contains. Purchase orders you place with suppliers don’t count — only sales.',
  },
  {
    q: 'What happens if I go over my plan?',
    a: 'Nothing breaks. Orders past your allowance bill at $0.05 each, and we’ll tell you when moving up a tier would work out cheaper. Enterprise has no overage at all.',
  },
  {
    q: 'Are features limited on the cheaper plans?',
    a: 'No. Forecasting, reconciliation, liquidation, cashflow, the Knowledge Center and MCP access are on every plan including Starter. The tier only sets your order allowance.',
  },
  {
    q: 'Do I need a card to start?',
    a: 'No. The 30-day trial needs no card. Connect Amazon, let DragonRestock train on your history, and look at a real restock plan before deciding.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Any time, in both directions. Upgrades take effect immediately and we prorate the difference; downgrades apply at your next billing date.',
  },
  {
    q: 'Do you charge per SKU, user, or marketplace?',
    a: 'None of them. SKUs, team members, suppliers, warehouses and marketplaces are unlimited on every plan.',
  },
];
