/* Head-to-head comparison pages — /compare/<slug>.
 *
 * JSX-free like restockCopy.js, and for the same reason: the build-time
 * prerender (scripts/postbuild-spa-routes.mjs) imports these strings so each
 * comparison route ships real crawler-visible copy. Comparison pages are
 * bought traffic ("sostocked alternative") as often as organic, so a thin one
 * costs twice — see the header of that script.
 *
 * ⚠️ TWO RULES FOR EVERY ENTRY HERE
 *
 * 1. A new competitor starts at `live: false` and stays there until the copy
 *    below is complete. The footer renders a non-live entry as muted text
 *    rather than a link, and the prerender skips it entirely — because a
 *    competitor linked in the footer but missing from the prerender map is a
 *    soft 404, the exact defect the postbuild guard exists to catch. Write the
 *    copy, flip the flag, and the route, the link and the prerender all
 *    appear together. (All five are live today; the flag stays for the next
 *    one.)
 *
 * 2. Every number about a competitor carries a `sources` line naming where it
 *    came from and when it was checked. Prices move; an unsourced price on a
 *    comparison page is a claim we cannot stand behind.
 *
 * Cell `tone` drives the icon, not the argument: 'yes' (has it), 'part'
 * (partly, or with a caveat), 'no' (doesn't). Concede honestly — a visitor
 * who runs the competitor spots a dishonest row instantly and stops
 * believing the other twelve.
 */

/* ─── The five, in the order the footer lists them ───
 * Order is deliberate: the two we win most clearly first, then the two big
 * suites, then the legacy tool. */
export const COMPARISONS = [
  {
    slug: 'sostocked',
    name: 'SoStocked',
    live: true,

    /* <head> */
    title: 'SoStocked alternative — DragonRestock vs SoStocked | DragonRestock',
    description:
      'SoStocked starts at $175/mo and takes weeks to configure. DragonRestock starts at $79, gives you a restock plan the same day you connect Amazon, and shows the reasoning behind every quantity.',

    eyebrow: 'DragonRestock vs SoStocked',
    h1: 'SoStocked’s granularity,',
    h1Accent: 'without the setup or the price.',
    sub: 'SoStocked is the one tool in this category that ends on an instruction instead of a chart. It also starts at $175 a month and takes weeks to configure. DragonRestock hands you the same decision from $79 — ten minutes after you connect Amazon, with the math written underneath it.',

    /* The concession, first, and meant. It matches the credit note on the
     * landing page; contradicting ourselves between the two would be worse
     * than making no claim at all. */
    credit: {
      title: 'Credit where it’s due',
      body: 'SoStocked was built for Amazon inventory from day one, not bolted onto a profit dashboard. It’s deeply configurable, it ends on a quantity and a date, and sellers who commit to it get a lot back. Nothing here argues it’s a weak tool.',
    },

    gaps: {
      eyebrow: 'Where they differ',
      title: 'Four differences that actually decide it.',
      cards: [
        {
          key: 'price',
          title: '$79 to start, against $175',
          body: 'DragonRestock is priced on order volume from $79/mo — $66 on annual. SoStocked’s listed plan starts at $175. Same job, under half the entry price.',
        },
        {
          key: 'setup',
          title: 'Ten minutes, not a project',
          body: 'No import wizard, no column mapping. Connect Seller Central, paste the costs sheet you already keep, and Claude maps it to your SKUs — then asks about whatever it can’t work out.',
        },
        {
          key: 'reasoning',
          title: 'The number, and why it’s that number',
          body: 'SoStocked hands you a quantity. DragonRestock hands you the quantity and opens it: velocity windows, each leg of the lead time, the seasonal multiplier, the events it kept out.',
        },
        {
          key: 'scope',
          title: 'Reordering is a third of the job',
          body: 'Liquidation priced per tier, a cashflow planner that tells you whether you can fund the buy, and the low-inventory fee Amazon never itemises — beside the restock plan, on the same numbers.',
        },
      ],
    },

    table: {
      title: 'DragonRestock vs SoStocked, side by side',
      caption: 'Capability comparison: DragonRestock vs SoStocked',
      rows: [
        {
          label: 'Starting price',
          us: { tone: 'yes', text: 'From $79/mo on order volume. 30-day trial, no card.' },
          them: { tone: 'part', text: '$175/mo listed entry price.' },
        },
        {
          label: 'Time to first recommendation',
          us: { tone: 'yes', text: 'Same day — connect Amazon, paste a costs sheet.' },
          them: { tone: 'part', text: 'Configuration first; 1-on-1 onboarding included.' },
        },
        {
          label: 'What you get at the end',
          us: { tone: 'yes', text: 'SKU, quantity, supplier, order-by date.' },
          them: { tone: 'yes', text: 'A quantity and a date too — the one competitor that ends on an action.' },
        },
        {
          label: 'Reasoning behind the quantity',
          us: { tone: 'yes', text: 'Expand any row: velocity windows, lead-time legs, seasonal multiplier.' },
          them: { tone: 'no', text: 'The number arrives bare.' },
        },
        {
          label: 'Events kept out of the baseline',
          us: { tone: 'yes', text: 'Prime Day, BFCM and stockout days excluded automatically.' },
          them: { tone: 'part', text: 'Seasonality profiles you configure and maintain.' },
        },
        {
          label: 'Anything outside your account',
          us: { tone: 'yes', text: 'Freight disruption, Chinese New Year, your supplier’s blackout dates.' },
          them: { tone: 'no', text: 'Your own data only.' },
        },
        {
          label: 'Keeping the inputs current',
          us: { tone: 'yes', text: 'It chases you in chat for missing COGS and drifting lead times.' },
          them: { tone: 'part', text: 'Tables you maintain yourself.' },
        },
        {
          label: 'Runs inside Claude (MCP)',
          us: { tone: 'yes', text: 'Ask in plain English from Claude desktop, web or Code.' },
          them: { tone: 'no', text: 'No MCP server — the data stays in the dashboard.' },
        },
        {
          label: 'Business memory your team’s AI reads',
          us: { tone: 'yes', text: 'AI Knowledge Center — one entry, every teammate’s Claude.' },
          them: { tone: 'no', text: 'Notes and tags, not memory an AI can read.' },
        },
        {
          label: 'Liquidation decisions',
          us: { tone: 'yes', text: 'Price tiers tested and compared on monthly profit.' },
          them: { tone: 'part', text: 'Aging and overstock dashboards — flags, not priced options.' },
        },
        {
          label: 'Cashflow planning',
          us: { tone: 'yes', text: 'Invoices matched to POs, run against payouts and bank balances.' },
          them: { tone: 'no', text: 'Profit dashboards, but no cash timeline.' },
        },
        {
          label: 'Low-inventory fee',
          us: { tone: 'yes', text: 'Reconstructed, projected, and sized against the send-in that stops it.' },
          them: { tone: 'part', text: 'Capacity and storage-fee dashboards; the fee itself isn’t rebuilt.' },
        },
        {
          label: 'Multi-warehouse visibility',
          us: { tone: 'yes', text: 'FBA, AWD, 3PL and your own warehouses in one view.' },
          them: { tone: 'yes', text: 'Multi-location planning — a genuine strength.' },
        },
        {
          label: 'Configuration depth',
          us: { tone: 'part', text: 'Sensible defaults with the real levers exposed.' },
          them: { tone: 'yes', text: 'Deeper — work orders, carton math, tag-driven dashboards.' },
        },
      ],
    },

    fairness: {
      title: 'The honest trade',
      body: 'SoStocked buys you configuration depth for a higher price and a longer runway before the tool is useful. DragonRestock buys you a decision the same day, the reasoning under every number, and the two thirds of inventory management that reordering isn’t — for under half the entry price. If you actively use SoStocked’s depth, that’s a real thing to weigh rather than something to talk you out of.',
    },

    switchers: {
      title: 'Who tends to switch',
      items: [
        'Sellers who bought SoStocked, never finished configuring it, and are paying $175 a month for a half-built setup.',
        'Private-label brands doing $250K–$5M who want the reorder decision without an onboarding marathon.',
        'Teams where one person learned the tool and everyone else avoids it.',
        'Operators who want the reasoning attached to the number, not just the number.',
      ],
    },

    sources:
      'SoStocked pricing on this page is the entry price publicly listed on sostocked.com/pricing, checked August 2026. Capability notes come from SoStocked’s own published feature and pricing pages. Pricing and features change — confirm current terms with the vendor before you buy.',

    faqs: [
      {
        q: 'How much cheaper is DragonRestock than SoStocked?',
        a: 'DragonRestock starts at $79/mo, or $66/mo billed annually. SoStocked lists $175/mo. Because we bill on order volume rather than a flat tier, compare against your real monthly orders — but the entry gap is more than 2×.',
      },
      {
        q: 'Is it actually faster to set up?',
        a: 'That’s the main design difference. There’s no import wizard: you connect Seller Central and paste a link to the costs sheet you already keep, and Claude maps it to your SKUs and asks about the gaps. Most sellers are looking at a real restock plan the same day.',
      },
      {
        q: 'Does DragonRestock do everything SoStocked does?',
        a: 'The core job, yes — forecasting, restock quantities that respect lead time, MOQ and case packs, multi-warehouse visibility, POs and reconciliation. SoStocked exposes more configuration surface, like work orders and carton math. DragonRestock adds what it doesn’t have: liquidation pricing, cashflow, the low-inventory fee, and the whole thing running inside Claude.',
      },
      {
        q: 'Can I move my SoStocked data across?',
        a: 'Yes. Export your costs, lead times, MOQs and suppliers and send the file over — we map it to your SKUs with you. If your setup is non-standard (several entities, a 3PL nobody integrates with, kits and bundles), that’s the case we do hands-on.',
      },
      {
        q: 'Is my Amazon data secure?',
        a: 'DragonRestock meets Amazon’s Selling Partner API security requirements: encryption in transit and at rest, least-privilege access and audit logging. Full detail is in the privacy policy.',
      },
    ],

    cta: {
      title: 'See your own restock plan before you pay for anything.',
      sub: 'Connect Seller Central and watch DragonRestock build the plan against your real velocity. 30 days free, no card.',
    },
  },

  {
    slug: 'helium-10-inventory',
    name: 'Helium 10',
    label: 'Helium 10 Inventory',
    live: true,

    title: 'Helium 10 inventory alternative — DragonRestock vs Helium 10 | DragonRestock',
    description:
      'Helium 10 is a research suite where inventory is one tab, capped at 40 SKUs on Platinum. DragonRestock does the restock decision and nothing else — unlimited SKUs on every plan, from $79/mo.',

    eyebrow: 'DragonRestock vs Helium 10 Inventory',
    h1: 'Inventory is one tab of thirty.',
    h1Accent: 'Here it’s the whole product.',
    sub: 'Helium 10 is a genuinely strong research suite. Inventory Management is a module inside it — capped at 40 SKUs on Platinum, 500 on Diamond — competing for roadmap attention with keywords, PPC, listings and alerts. DragonRestock does one job: the reorder decision, on every SKU you sell.',

    credit: {
      title: 'Credit where it’s due',
      body: 'For keyword research, listing optimisation and competitor intelligence, Helium 10 is excellent, and DragonRestock does none of those things. Most sellers who move their inventory planning here keep paying for Helium 10. This is an argument about focus, not quality.',
    },

    gaps: {
      eyebrow: 'Where they differ',
      title: 'A module and a product are different things.',
      cards: [
        {
          key: 'skus',
          title: 'The inventory tab stops at 40 SKUs',
          body: 'Helium 10 caps Inventory Management at 40 SKUs on Platinum and 500 on Diamond. DragonRestock has no SKU limit on any plan, including the $79 Starter — you’re billed on orders, not catalogue size.',
        },
        {
          key: 'focus',
          title: 'A side feature gets side-feature attention',
          body: 'Forecasting, lead-time math and fee exposure are the parts of the job where a thin tool quietly costs you five figures. In a thirty-tool suite, that isn’t where the roadmap goes.',
        },
        {
          key: 'reasoning',
          title: 'The number, and why it’s that number',
          body: 'Expand any DragonRestock row and the calculation is underneath it: seven windows of velocity, each leg of the lead time, the seasonal multiplier, the events it kept out of the baseline.',
        },
        {
          key: 'scope',
          title: 'Reordering is a third of the job',
          body: 'Liquidation priced per tier, a cashflow planner that says whether you can fund the buy, and the low-inventory fee Amazon never itemises — on the same numbers as the restock plan.',
        },
      ],
    },

    table: {
      title: 'DragonRestock vs Helium 10, side by side',
      caption: 'Capability comparison: DragonRestock vs Helium 10 Inventory Management',
      rows: [
        { label: 'Starting price',
          us: { tone: 'yes', text: 'From $79/mo on order volume. 30-day trial, no card.' },
          them: { tone: 'part', text: '$129/mo Platinum, $359/mo Diamond. Lower on annual billing.' } },
        { label: 'SKUs the inventory tool covers',
          us: { tone: 'yes', text: 'Unlimited, on every plan.' },
          them: { tone: 'no', text: '40 on Platinum, 500 on Diamond.' } },
        { label: 'What you’re buying',
          us: { tone: 'yes', text: 'Inventory and restock planning, and nothing else.' },
          them: { tone: 'part', text: 'A research suite; inventory is one module of many.' } },
        { label: 'Keyword and listing research',
          us: { tone: 'no', text: 'Not offered — DragonRestock isn’t a research tool.' },
          them: { tone: 'yes', text: 'Deep and mature. The reason most people buy it.' } },
        { label: 'What you get at the end',
          us: { tone: 'yes', text: 'SKU, quantity, supplier, order-by date, PO drafted.' },
          them: { tone: 'part', text: 'Reorder figures and alerts you act on yourself.' } },
        { label: 'Reasoning behind the quantity',
          us: { tone: 'yes', text: 'Expand any row: velocity windows, lead-time legs, seasonal multiplier.' },
          them: { tone: 'no', text: 'The workings aren’t shown.' } },
        { label: 'Events kept out of the baseline',
          us: { tone: 'yes', text: 'Prime Day, BFCM and stockout days excluded automatically.' },
          them: { tone: 'part', text: 'Forecasting exists; event separation isn’t its focus.' } },
        { label: 'Anything outside your account',
          us: { tone: 'yes', text: 'Freight disruption, Chinese New Year, supplier blackout dates.' },
          them: { tone: 'no', text: 'Your own data only.' } },
        { label: 'Runs inside Claude (MCP)',
          us: { tone: 'yes', text: 'Ask in plain English from Claude desktop, web or Code.' },
          them: { tone: 'no', text: 'No MCP server — the data stays in the dashboard.' } },
        { label: 'Business memory your team’s AI reads',
          us: { tone: 'yes', text: 'AI Knowledge Center — one entry, every teammate’s Claude.' },
          them: { tone: 'no', text: 'No persistent memory of how you run the business.' } },
        { label: 'Liquidation decisions',
          us: { tone: 'yes', text: 'Price tiers tested and compared on monthly profit.' },
          them: { tone: 'no', text: 'Not part of the inventory module.' } },
        { label: 'Cashflow planning',
          us: { tone: 'yes', text: 'Invoices matched to POs, run against payouts and bank balances.' },
          them: { tone: 'no', text: 'Profit reporting, but no cash timeline.' } },
        { label: 'Low-inventory fee',
          us: { tone: 'yes', text: 'Reconstructed, projected, and sized against the send-in that stops it.' },
          them: { tone: 'no', text: 'Not reconstructed or projected.' } },
        { label: 'Warehouses beyond FBA',
          us: { tone: 'yes', text: 'FBA, AWD, 3PL and your own warehouses in one view.' },
          them: { tone: 'part', text: 'Centred on FBA within the suite.' } },
      ],
    },

    fairness: {
      title: 'The honest trade',
      body: 'If you use the research half of Helium 10, keep it — nothing here replaces Cerebro or Magnet, and we’re not going to pretend otherwise. The question is narrower: whether the inventory tab bundled alongside it is what you want making a five-figure purchase-order decision, particularly once you’re past 40 SKUs. Most sellers who switch don’t cancel Helium 10; they stop using its inventory module.',
    },

    switchers: {
      title: 'Who tends to switch',
      items: [
        'Sellers past the 40-SKU cap who don’t want to pay $359 a month for the inventory tab.',
        'Anyone who bought Helium 10 for research and inherited its inventory module by default.',
        'Operators who want the reasoning behind a reorder quantity, not just the quantity.',
        'Sellers holding stock in AWD, a 3PL or their own warehouse as well as FBA.',
      ],
    },

    sources:
      'Helium 10 prices and the Inventory Management SKU limits (40 on Platinum, 500 on Diamond) are taken from helium10.com/pricing, checked August 2026; monthly rates are shown and annual billing is lower. Plans, limits and prices change — confirm current terms with the vendor.',

    faqs: [
      { q: 'Do I have to cancel Helium 10 to use DragonRestock?',
        a: 'No, and most people don’t. They keep Helium 10 for research and stop using its inventory tab. The two answer different questions, and DragonRestock doesn’t do keywords, listings or competitor tracking at all.' },
      { q: 'Is DragonRestock cheaper than Helium 10?',
        a: 'On the sticker, yes — $79/mo against $129 for Platinum or $359 for Diamond. But if you actively use the research suite you aren’t comparing like for like. The cleaner comparison is what the inventory tab costs you once you’re past 40 SKUs and have to move to Diamond.' },
      { q: 'What does DragonRestock do that the inventory tab doesn’t?',
        a: 'Unlimited SKUs, the reasoning under every quantity, AWD, 3PL and your own warehouses in one position, liquidation pricing, cashflow, the low-inventory fee — and the whole thing runs inside Claude, so you ask instead of navigating.' },
      { q: 'What does Helium 10 do that DragonRestock doesn’t?',
        a: 'Product and keyword research, listing optimisation, PPC management, review requests and refund recovery. None of that is on our roadmap — it’s a different product category.' },
      { q: 'Is my Amazon data secure?',
        a: 'DragonRestock meets Amazon’s Selling Partner API security requirements: encryption in transit and at rest, least-privilege access and audit logging. Full detail is in the privacy policy.' },
    ],

    cta: {
      title: 'See the restock decision on every SKU, not your first 40.',
      sub: 'Connect Seller Central and watch DragonRestock build the plan against your real velocity. 30 days free, no card.',
    },
  },

  {
    slug: 'sellerboard',
    name: 'Sellerboard',
    live: true,

    title: 'Sellerboard alternative for inventory — DragonRestock vs Sellerboard | DragonRestock',
    description:
      'Sellerboard is a good, cheap profit dashboard that looks backward at your margin. DragonRestock makes the forward decision — what to order, how many, from whom, by when — with the reasoning attached.',

    eyebrow: 'DragonRestock vs Sellerboard',
    h1: 'Sellerboard tells you what happened.',
    h1Accent: 'This tells you what to do next.',
    sub: 'Sellerboard is a good profit dashboard and it’s cheap — $19 to $79 a month. It’s also backward-looking by design: it reconciles margin you’ve already made or lost. Deciding what to order next quarter is a different question, and it’s the whole of what DragonRestock does.',

    credit: {
      title: 'Credit where it’s due',
      body: 'Sellerboard’s P&L is genuinely good and genuinely cheap — real profit after every fee, refund and PPC dollar, on a dashboard that loads. DragonRestock is not a P&L tool and isn’t trying to become one. Running both is a sensible stack, not a compromise.',
    },

    gaps: {
      eyebrow: 'Where they differ',
      title: 'Backward and forward are different jobs.',
      cards: [
        {
          key: 'direction',
          title: 'Accounting isn’t planning',
          body: 'Reconciling last month’s margin and deciding next quarter’s order quantity need different math and different inputs. Sellerboard is built, well, for the first one.',
        },
        {
          key: 'price',
          title: 'We’re not the cheaper tool',
          body: 'Sellerboard starts at $19 and DragonRestock at $79. If what you need is profit accounting, buy Sellerboard — it’s better at that than we are, and cheaper. This page is only about the reorder decision.',
        },
        {
          key: 'supply',
          title: 'The supply side has to be first-class',
          body: 'Lead-time legs, MOQs, case packs and container fill decide whether a quantity survives contact with your supplier. A reorder estimate bolted to a profit dashboard doesn’t carry them.',
        },
        {
          key: 'scope',
          title: 'Reordering is a third of the job',
          body: 'What to clear and at which price, and whether the cash is there to fund the buy at all — beside the restock plan, running on the same numbers.',
        },
      ],
    },

    table: {
      title: 'DragonRestock vs Sellerboard, side by side',
      caption: 'Capability comparison: DragonRestock vs Sellerboard',
      rows: [
        { label: 'Starting price',
          us: { tone: 'part', text: 'From $79/mo on order volume. 30-day trial, no card.' },
          them: { tone: 'yes', text: '$19–$79/mo. The cheaper tool, plainly.' } },
        { label: 'The job it’s built for',
          us: { tone: 'yes', text: 'The forward decision: what to order, how many, by when.' },
          them: { tone: 'part', text: 'Backward: what your margin actually was.' } },
        { label: 'Profit and loss accounting',
          us: { tone: 'no', text: 'Not a P&L dashboard.' },
          them: { tone: 'yes', text: 'Detailed and real-time, after every fee and refund.' } },
        { label: 'What you get at the end',
          us: { tone: 'yes', text: 'SKU, quantity, supplier, order-by date, PO drafted.' },
          them: { tone: 'part', text: 'Reorder estimates and stock alerts sitting on the dashboard.' } },
        { label: 'Supplier constraints in the quantity',
          us: { tone: 'yes', text: 'Lead-time legs, MOQ, case packs and container fill.' },
          them: { tone: 'part', text: 'Lighter on supply-side constraints.' } },
        { label: 'Reasoning behind the quantity',
          us: { tone: 'yes', text: 'Expand any row: velocity windows, lead-time legs, seasonal multiplier.' },
          them: { tone: 'no', text: 'The workings aren’t shown.' } },
        { label: 'Events kept out of the baseline',
          us: { tone: 'yes', text: 'Prime Day, BFCM and stockout days excluded automatically.' },
          them: { tone: 'part', text: 'Velocity windows you pick yourself.' } },
        { label: 'Anything outside your account',
          us: { tone: 'yes', text: 'Freight disruption, Chinese New Year, supplier blackout dates.' },
          them: { tone: 'no', text: 'Your own data only.' } },
        { label: 'POs and shipment reconciliation',
          us: { tone: 'yes', text: 'Every PO from deposit to check-in; short-receipts flagged.' },
          them: { tone: 'no', text: 'Not a purchase-order workflow.' } },
        { label: 'Liquidation decisions',
          us: { tone: 'yes', text: 'Price tiers tested and compared on monthly profit.' },
          them: { tone: 'part', text: 'Reports aging stock; the pricing call stays with you.' } },
        { label: 'Cashflow planning',
          us: { tone: 'yes', text: 'Invoices matched to POs, run against payouts and bank balances.' },
          them: { tone: 'part', text: 'Cash reporting, not invoices lined up against payout dates.' } },
        { label: 'Low-inventory fee',
          us: { tone: 'yes', text: 'Reconstructed, projected, and sized against the send-in that stops it.' },
          them: { tone: 'no', text: 'Reported once charged, not projected.' } },
        { label: 'Runs inside Claude (MCP)',
          us: { tone: 'yes', text: 'Ask in plain English from Claude desktop, web or Code.' },
          them: { tone: 'no', text: 'No MCP server — the data stays in the dashboard.' } },
        { label: 'Business memory your team’s AI reads',
          us: { tone: 'yes', text: 'AI Knowledge Center — one entry, every teammate’s Claude.' },
          them: { tone: 'no', text: 'No persistent memory of how you run the business.' } },
        { label: 'Warehouses beyond FBA',
          us: { tone: 'yes', text: 'FBA, AWD, 3PL and your own warehouses in one view.' },
          them: { tone: 'part', text: 'Inventory view is organised around profit, not locations.' } },
      ],
    },

    fairness: {
      title: 'The honest trade',
      body: 'If your problem is “I don’t really know what I made”, buy Sellerboard. It’s cheaper than us and better at that than us. If your problem is “I keep running out, or ordering too much”, that’s a forecasting and supply problem, and no profit dashboard solves it however good the dashboard is. A lot of sellers end up running both, and that’s a perfectly good answer.',
    },

    switchers: {
      title: 'Who tends to add DragonRestock',
      items: [
        'Sellers whose P&L is under control but who still stocked out twice this year.',
        'Anyone whose reorder decision still happens in a spreadsheet next to the profit dashboard.',
        'Operators with real supplier constraints — MOQs, case packs, container fill, split lead times.',
        'Teams who want the buy, the clearance and the cash in one place rather than three.',
      ],
    },

    sources:
      'Sellerboard pricing shown is the publicly listed monthly range on sellerboard.com, checked August 2026; annual billing is lower. Capability notes reflect Sellerboard’s own published feature pages. Pricing and features change — confirm current terms with the vendor.',

    faqs: [
      { q: 'Is DragonRestock more expensive than Sellerboard?',
        a: 'Yes. Sellerboard starts at $19/mo and DragonRestock at $79. They’re different products: one reconciles the margin you already made, the other decides the order you haven’t placed yet. Judge the $79 against the cost of one stockout, not against the $19.' },
      { q: 'Should I cancel Sellerboard if I get DragonRestock?',
        a: 'Not necessarily. DragonRestock isn’t a P&L dashboard, and Sellerboard is a cheap, good one. Plenty of sellers keep it for profit reporting and use DragonRestock for the forward decision.' },
      { q: 'Doesn’t Sellerboard already do restock?',
        a: 'It has reorder estimates and stock alerts, and for a simple catalogue they may be all you need. What they don’t carry is the supply side — split lead times, MOQs, case packs, container fill — or the reasoning behind the number, or the PO and reconciliation workflow after it.' },
      { q: 'Does DragonRestock know my true profit per unit?',
        a: 'It works on landed cost — COGS, freight, duty and Amazon’s fees — because liquidation pricing and cashflow need it. That’s profit math in service of a decision rather than a P&L report you read monthly.' },
      { q: 'Is my Amazon data secure?',
        a: 'DragonRestock meets Amazon’s Selling Partner API security requirements: encryption in transit and at rest, least-privilege access and audit logging. Full detail is in the privacy policy.' },
    ],

    cta: {
      title: 'Your margin report can’t stop the next stockout.',
      sub: 'Connect Seller Central and see what DragonRestock would have had you order. 30 days free, no card.',
    },
  },

  {
    slug: 'jungle-scout',
    name: 'Jungle Scout',
    live: true,

    title: 'Jungle Scout alternative for inventory — DragonRestock vs Jungle Scout | DragonRestock',
    description:
      'Jungle Scout’s Inventory Manager is a module inside a research suite, and only from the $49 plan up. DragonRestock is built entirely around the restock decision — and it drafts the purchase order.',

    eyebrow: 'DragonRestock vs Jungle Scout',
    h1: 'Their Inventory Manager is a module.',
    h1Accent: 'This is the whole product.',
    sub: 'Jungle Scout is a research platform. Its Inventory Manager — built on the Forecastly technology it acquired — does solid forecasting, but you only get it from the $49 Growth Accelerator plan up, and it stops at the label rather than the order. DragonRestock starts where it stops.',

    credit: {
      title: 'Credit where it’s due',
      body: 'Jungle Scout is excellent at what it was built for: finding products, sizing demand, tracking competitors. Its Inventory Manager is a real forecasting tool rather than a token tab — clear Reorder Soon and Order Now labels with estimated dates and quantities. DragonRestock does no research whatsoever.',
    },

    gaps: {
      eyebrow: 'Where they differ',
      title: 'A forecasting module, and a tool that places the order.',
      cards: [
        {
          key: 'bundle',
          title: 'You buy the suite to get the module',
          body: 'Inventory Manager isn’t on the $29 Starter plan. It arrives with Growth Accelerator at $49 and Brand Owner at $129 — research platforms, priced as research platforms, with one seat included.',
        },
        {
          key: 'stops',
          title: 'It stops at the label',
          body: '“Reorder Soon” is a flag. DragonRestock drafts the PO at the right quantity — MOQs, case packs and container fill already respected — priced, and checked against your cash.',
        },
        {
          key: 'basis',
          title: 'Your history, not a rank model',
          body: 'Jungle Scout’s modelling heritage is rank-based estimation. DragonRestock forecasts off your own order history, with promo spikes and stockout days taken out of the baseline first.',
        },
        {
          key: 'scope',
          title: 'Reordering is a third of the job',
          body: 'Liquidation priced per tier, a cashflow planner that says whether you can fund the buy, and the low-inventory fee Amazon never itemises — on the same numbers as the restock plan.',
        },
      ],
    },

    table: {
      title: 'DragonRestock vs Jungle Scout, side by side',
      caption: 'Capability comparison: DragonRestock vs Jungle Scout Inventory Manager',
      rows: [
        { label: 'Starting price',
          us: { tone: 'yes', text: 'From $79/mo on order volume, everything included.' },
          them: { tone: 'part', text: '$29 Starter (no Inventory Manager), $49 Growth Accelerator, $129 Brand Owner.' } },
        { label: 'Team seats',
          us: { tone: 'yes', text: 'Unlimited team members on every plan.' },
          them: { tone: 'no', text: 'One seat on Starter and Growth Accelerator; extras $49/mo each.' } },
        { label: 'Trying it before you pay',
          us: { tone: 'yes', text: '30-day free trial, no card.' },
          them: { tone: 'part', text: 'No free trial; a 7-day money-back guarantee.' } },
        { label: 'What you’re buying',
          us: { tone: 'yes', text: 'A dedicated inventory and restock tool.' },
          them: { tone: 'part', text: 'A research suite with an inventory module inside it.' } },
        { label: 'Product and keyword research',
          us: { tone: 'no', text: 'Not offered — DragonRestock isn’t a research tool.' },
          them: { tone: 'yes', text: 'Best-in-class. The reason most people buy it.' } },
        { label: 'Where the workflow ends',
          us: { tone: 'yes', text: 'A drafted PO at the right quantity, priced and cash-checked.' },
          them: { tone: 'part', text: 'Reorder labels with estimated dates and quantities.' } },
        { label: 'What the forecast is built on',
          us: { tone: 'yes', text: 'Your own order history; events and stockout days excluded.' },
          them: { tone: 'part', text: 'Automated forecasting; estimates lean on rank modelling.' } },
        { label: 'Reasoning behind the quantity',
          us: { tone: 'yes', text: 'Expand any row: velocity windows, lead-time legs, seasonal multiplier.' },
          them: { tone: 'no', text: 'The workings aren’t shown.' } },
        { label: 'Anything outside your account',
          us: { tone: 'yes', text: 'Freight disruption, Chinese New Year, supplier blackout dates.' },
          them: { tone: 'no', text: 'Your own data only.' } },
        { label: 'POs and shipment reconciliation',
          us: { tone: 'yes', text: 'Every PO from deposit to check-in; short-receipts flagged.' },
          them: { tone: 'part', text: 'Supplier tracking, but not end-to-end PO reconciliation.' } },
        { label: 'Runs inside Claude (MCP)',
          us: { tone: 'yes', text: 'Ask in plain English from Claude desktop, web or Code.' },
          them: { tone: 'no', text: 'No MCP server — the data stays in the dashboard.' } },
        { label: 'Business memory your team’s AI reads',
          us: { tone: 'yes', text: 'AI Knowledge Center — one entry, every teammate’s Claude.' },
          them: { tone: 'no', text: 'No persistent memory of how you run the business.' } },
        { label: 'Liquidation decisions',
          us: { tone: 'yes', text: 'Price tiers tested and compared on monthly profit.' },
          them: { tone: 'no', text: 'Not part of the inventory module.' } },
        { label: 'Cashflow planning',
          us: { tone: 'yes', text: 'Invoices matched to POs, run against payouts and bank balances.' },
          them: { tone: 'no', text: 'Not offered.' } },
        { label: 'Warehouses beyond FBA',
          us: { tone: 'yes', text: 'FBA, AWD, 3PL and your own warehouses in one view.' },
          them: { tone: 'part', text: 'Centred on Amazon within the suite.' } },
      ],
    },

    fairness: {
      title: 'The honest trade',
      body: 'Jungle Scout earns its place for research, and the Inventory Manager is a decent forecasting module — if your catalogue is simple and your suppliers are easy, it may be all the inventory tooling you need. The gap shows up when the constraints get real: split lead times, MOQs and case packs, stock in three places, a PO that has to be funded. That’s where a module inside a research suite runs out and a dedicated tool keeps going.',
    },

    switchers: {
      title: 'Who tends to switch',
      items: [
        'Sellers paying for Growth Accelerator mostly to get at the Inventory Manager.',
        'Teams hitting the one-seat limit who don’t want to add $49 a month per person.',
        'Operators who want the PO drafted, not a “reorder soon” label.',
        'Anyone whose stock sits in AWD or a 3PL as well as FBA.',
      ],
    },

    sources:
      'Jungle Scout plan names, prices, seat limits and the plans that include Inventory Manager are from junglescout.com/pricing, checked August 2026; monthly rates shown and annual billing is lower. Pricing and packaging change — confirm current terms with the vendor.',

    faqs: [
      { q: 'Do I have to cancel Jungle Scout to use DragonRestock?',
        a: 'No. If you use it for product research, keep it — DragonRestock doesn’t do research at all. What usually happens is that the Inventory Manager stops being the thing making the reorder call.' },
      { q: 'Is DragonRestock cheaper than Jungle Scout?',
        a: 'Not on the sticker: Growth Accelerator is $49 against our $79. But that plan is one seat and inventory is one module of it. Compare on the whole cost of the job — seats, the constraints it can’t model, and the PO you still assemble by hand.' },
      { q: 'What does DragonRestock do that Inventory Manager doesn’t?',
        a: 'It drafts the purchase order rather than flagging a reorder, shows the reasoning behind every quantity, holds AWD, 3PL and your own warehouses beside FBA, prices liquidation, plans cashflow, and runs inside Claude so you can just ask.' },
      { q: 'Is the forecasting actually different?',
        a: 'It’s built on a different input. Jungle Scout’s heritage is rank-based sales estimation, which is what makes its research tools good. DragonRestock forecasts off your own order history and strips promo spikes and stockout days out of the baseline before it does.' },
      { q: 'Is my Amazon data secure?',
        a: 'DragonRestock meets Amazon’s Selling Partner API security requirements: encryption in transit and at rest, least-privilege access and audit logging. Full detail is in the privacy policy.' },
    ],

    cta: {
      title: 'Stop assembling the PO the module didn’t finish.',
      sub: 'Connect Seller Central and see the drafted order against your real velocity. 30 days free, no card.',
    },
  },

  {
    slug: 'restockpro',
    name: 'RestockPro',
    live: true,

    title: 'RestockPro alternative — DragonRestock vs RestockPro | DragonRestock',
    description:
      'RestockPro is a dependable FBA-only workhorse with honest volume pricing. DragonRestock adds AWD, 3PL and your own warehouses, the reasoning under every quantity, and liquidation, cashflow and the low-inventory fee.',

    eyebrow: 'DragonRestock vs RestockPro',
    h1: 'The same honest pricing.',
    h1Accent: 'A decade newer everywhere else.',
    sub: 'RestockPro has been a dependable FBA workhorse, and it prices the way we do — by order volume, with every feature on every tier. It’s also FBA-only, its interface shows its age, and there’s no reasoning or AI anywhere in it.',

    credit: {
      title: 'Credit where it’s due',
      body: 'RestockPro gets things right that newer tools don’t: transparent volume-based pricing with no feature gating, reorder quantities broken out by supplier, and real kitting and bundle support. If you’re FBA-only and it’s working for you, staying put is a defensible decision.',
    },

    gaps: {
      eyebrow: 'Where they differ',
      title: 'Where sellers outgrow it.',
      cards: [
        {
          key: 'fba-only',
          title: 'FBA-only is a ceiling',
          body: 'Add AWD, a 3PL or your own warehouse and RestockPro stops being the whole picture. DragonRestock holds all of them in one position, with send-in plans that turn off-site stock into actual cover.',
        },
        {
          key: 'reasoning',
          title: 'The number arrives bare',
          body: 'Expand any DragonRestock row and the calculation is underneath: seven windows of velocity, each leg of the lead time, the seasonal multiplier, the events it kept out.',
        },
        {
          key: 'world',
          title: 'Nothing in it knows about the world',
          body: 'Chinese New Year, a freight lane going long, this year’s Prime Day dates, your supplier’s blackout weeks. DragonRestock reasons with all of it and writes the reason into the recommendation.',
        },
        {
          key: 'scope',
          title: 'Reordering is a third of the job',
          body: 'Liquidation priced per tier, a cashflow planner that says whether you can fund the buy, and the low-inventory fee Amazon never itemises — on the same numbers as the restock plan.',
        },
      ],
    },

    table: {
      title: 'DragonRestock vs RestockPro, side by side',
      caption: 'Capability comparison: DragonRestock vs RestockPro',
      rows: [
        { label: 'Starting price',
          us: { tone: 'part', text: 'From $79/mo on order volume. 30-day trial, no card.' },
          them: { tone: 'yes', text: '$49–$249/mo on FBA order volume, every feature on every tier.' } },
        { label: 'Channels and warehouses',
          us: { tone: 'yes', text: 'FBA, AWD, 3PL and your own warehouses in one position.' },
          them: { tone: 'no', text: 'FBA-only.' } },
        { label: 'Kits and bundles',
          us: { tone: 'part', text: 'Handled — and we map a non-standard setup with you.' },
          them: { tone: 'yes', text: 'A long-standing strength.' } },
        { label: 'POs, shipments and receiving',
          us: { tone: 'yes', text: 'Deposit to check-in, with landed shipments matched back and short-receipts flagged.' },
          them: { tone: 'yes', text: 'Solid PO, shipment and kitting workflow.' } },
        { label: 'Interface',
          us: { tone: 'yes', text: 'Single-purpose and readable without training.' },
          them: { tone: 'part', text: 'Functional but dated — the most common note in public reviews.' } },
        { label: 'Data freshness',
          us: { tone: 'yes', text: 'Current Seller Central data.' },
          them: { tone: 'part', text: 'Sync speed is a recurring theme in public reviews.' } },
        { label: 'Reasoning behind the quantity',
          us: { tone: 'yes', text: 'Expand any row: velocity windows, lead-time legs, seasonal multiplier.' },
          them: { tone: 'no', text: 'The workings aren’t shown.' } },
        { label: 'Events kept out of the baseline',
          us: { tone: 'yes', text: 'Prime Day, BFCM and stockout days excluded automatically.' },
          them: { tone: 'part', text: 'Velocity windows you configure yourself.' } },
        { label: 'Anything outside your account',
          us: { tone: 'yes', text: 'Freight disruption, Chinese New Year, supplier blackout dates.' },
          them: { tone: 'no', text: 'Your own data only.' } },
        { label: 'Runs inside Claude (MCP)',
          us: { tone: 'yes', text: 'Ask in plain English from Claude desktop, web or Code.' },
          them: { tone: 'no', text: 'No MCP server — the data stays in the dashboard.' } },
        { label: 'Business memory your team’s AI reads',
          us: { tone: 'yes', text: 'AI Knowledge Center — one entry, every teammate’s Claude.' },
          them: { tone: 'no', text: 'No persistent memory of how you run the business.' } },
        { label: 'Liquidation decisions',
          us: { tone: 'yes', text: 'Price tiers tested and compared on monthly profit.' },
          them: { tone: 'part', text: 'Aging stock flagged; the pricing call stays with you.' } },
        { label: 'Cashflow planning',
          us: { tone: 'yes', text: 'Invoices matched to POs, run against payouts and bank balances.' },
          them: { tone: 'no', text: 'Not offered.' } },
        { label: 'Low-inventory fee',
          us: { tone: 'yes', text: 'Reconstructed, projected, and sized against the send-in that stops it.' },
          them: { tone: 'no', text: 'Not reconstructed or projected.' } },
      ],
    },

    fairness: {
      title: 'The honest trade',
      body: 'RestockPro’s pricing philosophy is the one we copied — volume-based, no feature gating, no cut of your sales — and its PO and kitting workflow has kept FBA sellers running for years. If you’re FBA-only, comfortable in the interface, and don’t need the reasoning or the two thirds of the job beyond reordering, there’s no urgent reason to move. The case for switching is about scope and age, not about it being bad at what it does.',
    },

    switchers: {
      title: 'Who tends to switch',
      items: [
        'Sellers who’ve added AWD, a 3PL or their own warehouse and now run two systems.',
        'Anyone making today’s reorder call and wanting today’s numbers behind it.',
        'Operators who want the reasoning attached to the quantity, not just the quantity.',
        'Teams who want liquidation, cashflow and the low-inventory fee in the same place as the buy.',
      ],
    },

    sources:
      'RestockPro pricing ($49–$249 per month by FBA order volume, all features on every tier) is from ecomengine.com, checked August 2026. Notes on interface age and sync speed summarise recurring themes in public user reviews on sites such as G2 and Capterra rather than our own testing. Confirm current terms with the vendor.',

    faqs: [
      { q: 'Is DragonRestock cheaper than RestockPro?',
        a: 'Not at the entry tier — RestockPro starts at $49 for up to 1,000 FBA orders against our $79. Both price on volume with every feature included, so compare at your actual order count rather than at the bottom of the table.' },
      { q: 'I’m FBA-only. Is there a reason to move?',
        a: 'Less of one, honestly. The case is the reasoning behind each quantity, forecasting that separates events from trend, and the parts of the job RestockPro doesn’t cover — liquidation pricing, cashflow and the low-inventory fee. If none of that is a problem for you today, stay.' },
      { q: 'Can I move my data across?',
        a: 'Yes. Export your costs, lead times, MOQs and suppliers and send the file over — we map it to your SKUs with you. Kits, bundles and multi-entity setups are the cases we do hands-on.' },
      { q: 'What about kitting and bundles?',
        a: 'They’re handled, and RestockPro’s support for them is genuinely mature. If your kits are complicated, send us how they’re actually built and we’ll set the mapping up with you rather than leaving you to a wizard.' },
      { q: 'Is my Amazon data secure?',
        a: 'DragonRestock meets Amazon’s Selling Partner API security requirements: encryption in transit and at rest, least-privilege access and audit logging. Full detail is in the privacy policy.' },
    ],

    cta: {
      title: 'Your stock isn’t only in FBA. Your planning shouldn’t be either.',
      sub: 'Connect Seller Central and see FBA, AWD and 3PL in one restock plan. 30 days free, no card.',
    },
  },
];

export const LIVE_COMPARISONS = COMPARISONS.filter(c => c.live);

export const getComparison = (slug) => COMPARISONS.find(c => c.slug === slug && c.live);

/* Footer label — "vs SoStocked", mirroring how the compare column reads. */
export const compareLabel = (c) => `vs ${c.label ?? c.name}`;
