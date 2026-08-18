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
  /* The thesis of the whole page, stated where a visitor lands. It is
   * repeated as the heading of the "Why it matters" section further down —
   * deliberately, and in the same words: the hero asserts it, that section
   * proves it with the number. The supporting detail (no report, no line
   * item) is only spelled out down there, so the two aren't the same
   * paragraph twice. */
  stockout: {
    title: 'The most expensive thing an FBA business does all year is run out of stock.',
    body: 'And it’s the one cost Amazon never invoices you for. Storage, referral, fulfilment and ads are itemised to the cent — an empty listing is billed at nothing and takes more than any of them.',
  },
};

/* ─── Landing: the problem ───
 * Every pain is aimed at what the seller is using TODAY — a spreadsheet, or
 * one of the restock tools — and says so twice over: the `prefix` labels the
 * whole card as being about the competition, and the words underneath keep
 * naming the category, because a problem that reads as generic reads as
 * nobody's.
 *
 * Only one brand is ever named. SoStocked appears twice on this page — the
 * hero subhead and the `credit` note on problem 03 — and no other competitor
 * appears at all; head-to-heads live on /compare/<competitor>. The `credit`
 * note exists because the actionables claim is simply not true of SoStocked,
 * and a visitor who runs it would catch that inside a second. Conceding the
 * point it has earned and drawing the line where it actually falls is worth
 * more than a claim they know to be wrong.
 *
 * Every pain then carries its own `solution` line and the page renders the
 * two together — a problem a visitor has to mentally pair with the product
 * is a problem they scroll past. */
/* The sub stays on configuration, maintenance and the missing intelligence.
 * What these tools don't do at all — liquidation, cashflow — is a later
 * beat on the page and is deliberately kept out of here. */
export const PAINS_HEAD_COPY = {
  eyebrow: 'The problem with the tools you’re using now',
  title: 'Spreadsheet or restock software — you’re still guessing.',
  sub: 'The tools in this category all stop in the same place. Getting one configured takes weeks, keeping it configured never ends — and after all that they run the same math and hand you a number. There’s no intelligence anywhere near the estimate.',
};

export const PAINS_COPY = [
  /* One problem, two halves. `parts` renders as problem → answer, twice,
   * under a single heading: setup and maintenance are the same complaint
   * either side of go-live, so splitting them into two numbered problems
   * overstated the count — but running them together in one paragraph made
   * both harder to follow. */
  {
    key: 'configuration',
    demo: 'onboard',
    prefix: 'Competitors',
    title: 'Setup is a project, and it never ends',
    parts: [
      {
        label: 'Setup',
        body: 'Restock software wants supplier tables, lead-time rules and an import wizard per column before it gives you one useful number back. Most sellers never finish.',
        solution: 'Paste a link to the costs sheet you already keep. Claude maps it to your SKUs, fills the gaps, and asks about anything it can’t work out — 10 minutes, not a weekend.',
      },
      {
        label: 'Maintenance',
        body: 'Then it needs maintaining forever. Costs drift, lead times slip, a new SKU launches with nothing filled in — so the tool forecasts on numbers no one has checked in months. A spreadsheet is worse: it’s wrong the moment you save it.',
        solution: 'It does the chasing, not you. When a new SKU lands with no COGS on file, or a lead time looks nothing like what that supplier is actually delivering, DragonRestock asks you for it in Claude — and you answer in the chat. Nothing to remember, nothing to go and update.',
      },
    ],
  },
  {
    key: 'calculator',
    prefix: 'Competitors',
    title: 'The engine is a calculator. Your business isn’t',
    body: 'Every tool in the category runs the same math: velocity × lead time + a buffer. None of them has heard of Hormuz closing on your freight, your supplier shutting for Chinese New Year, or a Prime Day spike that was a promo, not demand.',
    solution: 'It’s fed what’s happening outside your account — the Strait of Hormuz flaring up and putting your freight two weeks late, this year’s Prime Day dates — and reasons with it. And it keeps an AI knowledge base of your own: your supplier’s factory holidays, their blackout days, whatever you know. Tell it once and it’s in every recommendation after, with the reason written in a line you can read.',
  },
  /* Problem 03 is the old "Clear actionables" section turned inside out. It
   * used to sit further down the page as a solution pitch; as a problem it
   * does more work, and the restock board and the three ANSWERS_COPY cards
   * come up the page with it as the answer. */
  {
    key: 'actionables',
    prefix: 'Competitors',
    title: 'Filters, alerts and reports. Never an instruction',
    body: 'Everything most of these tools produce ends the same way — with you still having to decide. Which SKU, how many units, from which supplier, by when. A red badge is not a decision, and a report is just work in a nicer font.',
    credit: {
      title: 'Credit where it’s due: SoStocked is the exception.',
      body: 'It does hand you a quantity and a date — it’s the one tool in the category that ends on an action rather than a chart. But the number arrives bare. There’s no reasoning attached, nothing that knows why this quarter isn’t last quarter, and no AI anywhere in it.',
    },
    solution: 'It does the deciding and hands you the instruction: the SKU, the quantity, the supplier, and the date the order has to go out. Expand any row and the whole calculation is sitting underneath it.',
    demoCaption: 'Expand any row to see the quantity justified — lead-time legs, seasonality, and seven windows of velocity.',
  },
];

/* The fourth beat of the problem section, and the one nobody else in the
 * category answers at all: reordering is a third of inventory management.
 * Kept as a band rather than a fourth card because it carries two products
 * (liquidation and cashflow) and needs the room to name both. */
export const BEYOND_REORDER_COPY = {
  /* `prefix` matches problems 01–03: the amber "Competitors:" that labels
   * the whole card as being about the tools the visitor pays for today. */
  prefix: 'Competitors',
  title: 'Reordering is all they do, and it’s a third of the job',
  /* `lead` renders with its last clause bold — the one question the whole
   * category answers — so the two it ignores land as a contrast. */
  lead: 'Every tool in this category answers one question:',
  leadEmphasis: 'when to buy more.',
  leadAfter: 'That leaves other important aspects of inventory that decide whether the business actually works.',
  /* The answer half of problem 04, and the only one in the band: the two
   * rows underneath are the screens, not another argument. `bullets` render
   * inside the answer as the two dashboards being named. */
  solution: 'It ships the other two as dashboards of their own, beside the restock plan and running on the same numbers:',
  bullets: [
    { label: 'Liquidation', text: 'what to dispose or discount' },
    { label: 'Cashflow', text: 'how you fund any of it' },
  ],
  /* The two screens, once the pair above has made the argument. No problem →
   * answer of their own: the charge was made once for the whole band, and
   * repeating it per row turns one point into three.
   *
   * `demoCaption` says what a visitor is looking at in the frozen state —
   * the panels are not clickable here, so nothing in them can explain
   * itself on demand. */
  items: [
    {
      key: 'liquidation',
      title: 'Liquidation: what to dispose or discount',
      body: 'Which SKUs to discount and to exactly which price, which to hold because they’re seasonal rather than dead, and which to clear out — with the monthly profit worked out on every option, not a badge that says “aging”.',
      demoCaption: 'Four price tiers tested on the same overstocked tee, each priced per month net of fees — and the row below it says hold, because seasonal stock isn’t dead stock.',
      href: '/demo#liquidation',
    },
    {
      key: 'cashflow',
      title: 'Cashflow: how you fund any of it',
      body: 'Supplier invoices matched to their PO, deposits and balances run against your real Amazon payout dates and bank balances — so a timing squeeze shows up weeks before you’ve wired anything.',
      demoCaption: 'The new invoice has already matched itself to PO SHIRT#191 and posted to Xero. The line that matters is at the bottom: the month nets out positive and there’s still a day you can’t cover.',
      href: '/demo#cashflow',
    },
  ],
  ctaLabel: 'Open it in the live demo',
  kicker: 'Buy, clear and fund in one place. That’s managing an inventory business — not running a reorder queue.',
};

/* The evidence that closes the problem section. `lead` is the join: without
 * it the lost-sales figure reads as a separate feature pitch instead of the
 * bill for everything above it. */
export const LOST_SALES_COPY = {
  /* Matches the nav label that points here — a visitor who clicks "Why it
   * matters" should land on a section wearing the same name. */
  eyebrow: 'Why it matters',
  lead: 'And every one of those problems ends in the same place.',
  title: '💸 See your lost sales, in dollars.',
  /* One paragraph, and it has three jobs: name the cost, say why nobody
   * sees it, and get out of the way of the panel. The panel is the
   * argument here — anything longer is the page explaining a screen the
   * visitor could just be looking at. */
  sub: 'Stockouts cost more than any fee Amazon charges you, and they’re the only one that never reaches your P&L. DragonRestock prices every one in your history — then carries the chart past today, so the next one arrives with a date on it.',
  /* The panel here is live, unlike every other demo on this page — this
   * line is what tells a visitor that, because a screen that looks like a
   * screenshot gets treated like one. */
  caption: 'Live, on a sample seller’s catalogue — open any product and scroll its chart past Today.',
};

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
  /* This pillar leads with the forecast half on purpose. The screen does
   * both — it reconstructs the year behind you and carries the same chart
   * past today — but a stockout already had is a bill you can't pay, and
   * the one still coming is the only half a visitor can act on. */
  {
    id: 'lost-sales',
    eyebrow: 'Lost sales analysis',
    title: 'Every stockout priced — including the one you haven’t had yet.',
    body: 'DragonRestock reconstructs a year of inventory state per SKU and lays your daily sales over it — red where you were out, amber where you were low. Then it keeps going past today: forecast demand against the stock actually on hand and the PO actually on the water, so the next stockout sits on the same chart as the last one, with a date and a price on it.',
    bullets: [
      'One chart per product, history and forecast on the same spine',
      'Days out of stock ahead, and the revenue that falls inside them',
      'Revenue and profit both priced, net of referral and FBA fees',
      'What another week of waiting adds, so the order-by date has a number on it',
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
