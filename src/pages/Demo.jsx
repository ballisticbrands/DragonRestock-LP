import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Check, TrendingDown, Boxes, LineChart, Globe, Layers,
  Wallet, Recycle, SlidersHorizontal, Users, Percent, BookOpen, ListChecks,
  Building2, Gauge, ArrowLeftRight, Container, Timer,
} from 'lucide-react';
import Nav from '../components/landing/Nav';
import SiteFooter from '../components/landing/SiteFooter';
import Eyebrow from '../components/landing/Eyebrow';
import SectionHead from '../components/landing/SectionHead';
import ScreenshotSlot from '../components/landing/ScreenshotSlot';
import RestockBoardDemo from '../components/landing/RestockBoardDemo';
import LostSalesDemo from '../components/landing/LostSalesDemo';
import ForecastDemo from '../components/landing/ForecastDemo';
import OrderTrackerDemo from '../components/landing/OrderTrackerDemo';
import KnowledgeCenterDemo from '../components/landing/KnowledgeCenterDemo';
import LiquidationDemo from '../components/landing/LiquidationDemo';
import CashflowDemo from '../components/landing/CashflowDemo';
import LowInventoryFeeDemo from '../components/landing/LowInventoryFeeDemo';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL } from '../config';

/* ──────────────────────────────────────────────────────────────
   /demo — every feature, live, on one page. (/features is an alias.)

   The landing page carries the argument (problem → setup → the daily
   action list) and stops there. Everything that proves the depth
   behind it lives here, so a visitor who wants to dig can, and one
   who doesn't isn't made to scroll past it.

   Every demo on this page is interactive. That's the point of the
   route: it's a place to play with the product, not read about it.

   Naming rule carries over from the landing page: SoStocked appears
   once, in Depth & control, as a benchmark rather than a swipe.
   ────────────────────────────────────────────────────────────── */

/* ─── 1 · The feature pillars ─── */
const PILLARS = [
  {
    accent: 'green', icon: ListChecks, eyebrow: 'Restock recommendations', id: 'restock',
    title: 'It tells you what to do. Not what to look at.',
    body: 'Filters, alerts, and reports are just work in a nicer font — every one of them ends with you still having to decide. DragonRestock does the deciding and hands you the instruction: which SKU, how many units, which supplier, and the date the order has to go out.',
    bullets: [
      'An instruction, not an alert — SKU, quantity, supplier, order-by date',
      'Expand any row for velocity, lead-time legs and the seasonal multiplier',
      'MOQs, case packs and container fill already respected in the quantity',
      'Tick a subset and the supplier order reprices to your selection',
    ],
    shot: 'Restock recommendations',
    Component: RestockBoardDemo,
    wide: true,
  },
  {
    accent: 'orange', icon: TrendingDown, eyebrow: 'Lost sales analysis', id: 'lost-sales',
    title: 'Every stockout you’ve had, priced.',
    body: 'DragonRestock reconstructs a year of inventory state per SKU and lays your daily sales over it — red where you were out, amber where you were low. The flat line inside every red band is the money that didn’t happen.',
    bullets: [
      'Open a product for its full year of sales against inventory state',
      'Hover any day for units sold, expected baseline, and what it cost',
      'Revenue and profit loss both priced, net of referral and FBA fees',
      'Low-stock days counted too — you don’t have to hit zero to lose sales',
    ],
    shot: 'Lost sales analysis',
    Component: LostSalesDemo,
    wide: true,
  },
  {
    accent: 'orange', icon: LineChart, eyebrow: 'Forecasting', id: 'forecasting',
    title: 'A forecast that knows your Q4 isn’t your July.',
    body: 'Velocity alone is a bad predictor. Prime Day triples your units for 48 hours — most tools read that as demand and have you order against a spike that was never coming back. DragonRestock separates real trend from event lift and forecasts off the baseline that’s actually yours.',
    bullets: [
      'Seasonality learned from your own sales history, not a category average',
      'Prime Day, Big Deal Days, and Black Friday modeled as events — not trend',
      'Stockout and suppressed-listing days excluded — no forecasting off zeros',
      'Lightning Deals, coupons, and PPC pushes flagged, not baked in',
    ],
    shot: 'Demand forecast with seasonality bands',
    Component: ForecastDemo,
    wide: true,
  },
  {
    accent: 'green', icon: Boxes, eyebrow: 'Complete inventory overview', id: 'inventory',
    title: 'Every PO tracked, every shipment matched back to it.',
    body: 'Your real coverage isn’t what FBA shows. DragonRestock follows every purchase order from deposit to check-in — grid, board, or calendar — and when a shipment lands at FBA or AWD, it works out which PO it belongs to and tells you what came up short.',
    bullets: [
      'Grid, Kanban, and calendar views of every open PO',
      'AI matches landed shipments back to the PO that shipped them',
      'Short-received units flagged instead of quietly disappearing',
      'FBA, AWD, 3PL, and your own warehouses in one number',
    ],
    shot: 'Order tracker with AI shipment reconciliation',
    Component: OrderTrackerDemo,
    wide: true,
  },
  {
    accent: 'indigo', icon: BookOpen, eyebrow: 'AI Knowledge Center', id: 'knowledge',
    title: 'The half of your operation that isn’t in any system.',
    body: 'Lianfa shuts for three weeks around Chinese New Year. The red tee needs a fatter buffer than everything else. Nothing over $10k goes out without Dana in logistics signing it. Right now that lives in your head — tell DragonRestock once and it’s written down, and drop in the spreadsheets you already run on so those land there too.',
    bullets: [
      'Say it once — it holds across every chat and every teammate',
      'Import the spreadsheets your business already runs on',
      'Your VA’s Claude reads the same entries yours does',
      'Nothing walks out the door when someone leaves',
    ],
    shot: 'AI Knowledge Center',
    Component: KnowledgeCenterDemo,
    wide: true,
  },
];

function PillarText({ dark, pillar }) {
  const { accent, eyebrow, title, body, bullets } = pillar;
  const accentText = accent === 'orange'
    ? 'text-[#F59E0B]'
    : accent === 'indigo'
      ? (dark ? 'text-[#A5A5F0]' : 'text-[#5B5BD6]')
      : t.green(dark);
  return (
    <>
      <Eyebrow dark={dark} accent={accent}>{eyebrow}</Eyebrow>
      <h3 className={`font-clash font-semibold text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.02em] mb-4 ${t.heading(dark)}`}>{title}</h3>
      <p className={`text-[16px] sm:text-[17px] leading-[1.65] ${dark ? 'text-white/60' : 'text-[#1A1A1A]/55'}`}>{body}</p>
      <ul className="mt-6 space-y-3">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <Check className={`w-5 h-5 mt-0.5 shrink-0 ${accentText}`} />
            <span className={`text-[15px] leading-snug ${t.mutedStrong(dark)}`}>{b}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function PillarBand({ dark, pillar, flip }) {
  const { accent, icon, shot, wide, demoWide, Component } = pillar;
  // Give the visual more width (and push the text column narrower) when demoWide.
  const cols = demoWide
    ? (flip ? 'md:grid-cols-[1.5fr_1fr]' : 'md:grid-cols-[1fr_1.5fr]')
    : 'md:grid-cols-2';

  const visual = Component
    ? <Component dark={dark} />
    : <ScreenshotSlot dark={dark} accent={accent} icon={icon} label={shot} ratio={wide ? '16 / 9' : '4 / 3'} />;

  // Full-width layout — text block on top, wide visual below (flagship pillar).
  if (wide) {
    return (
      <div>
        <div className="max-w-2xl mb-10 lg:mb-12">
          <PillarText dark={dark} pillar={pillar} />
        </div>
        {visual}
      </div>
    );
  }

  return (
    <div className={`grid ${cols} gap-10 lg:gap-16 items-center`}>
      <div className={flip ? 'md:order-2' : ''}>
        <PillarText dark={dark} pillar={pillar} />
      </div>
      <div className={flip ? 'md:order-1' : ''}>{visual}</div>
    </div>
  );
}

function Pillars({ dark }) {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="space-y-20 lg:space-y-28">
          {PILLARS.map((p, i) => (
            <motion.div key={p.title} id={p.id} className="scroll-mt-24" {...fadeUp} transition={{ duration: 0.6, ease }}>
              <PillarBand dark={dark} pillar={p} flip={i % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 2 & 3 · Differentiator bands ───
   Full-bleed sections for the two features nothing else in the
   category ships. Both wait on real screenshots — drop the file in
   /public/shots and set `src` on the ScreenshotSlot below. */
function Differentiator({ dark, id, accent, eyebrow, title, body, bullets, shot, src, tinted, Component }) {
  const accentText = accent === 'orange' ? 'text-[#F59E0B]' : t.green(dark);
  const bg = tinted
    ? (dark ? 'bg-[#141618] border-y border-white/5' : 'bg-[#fafafa] border-y border-[#1A1A1A]/5')
    : '';
  return (
    <section id={id} className={`py-24 scroll-mt-24 ${bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease }} className="max-w-3xl mb-10 lg:mb-12">
          <Eyebrow dark={dark} accent={accent}>{eyebrow}</Eyebrow>
          <h2 className={`font-clash font-semibold text-3xl sm:text-4xl lg:text-[46px] leading-[1.1] tracking-[-0.02em] mb-5 ${t.heading(dark)}`}>{title}</h2>
          <p className={`text-[17px] sm:text-[18px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
          <ul className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className={`w-5 h-5 mt-0.5 shrink-0 ${accentText}`} />
                <span className={`text-[15px] leading-snug ${t.mutedStrong(dark)}`}>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}>
          {Component
            ? <Component dark={dark} />
            : <ScreenshotSlot dark={dark} accent={accent} icon={shot.icon} label={shot.label} src={src} alt={shot.label} ratio="16 / 10" />}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 4 · Depth & control ───
   The parity story: every configuration knob a seller expects from a
   mature planning tool. This is the section that converts someone who
   already runs SoStocked, so it stays factual — no knob listed here
   that isn't going to ship. */
const KNOBS = [
  { icon: ShieldCheck, title: 'Buffer stock & safety days', desc: 'Set the cushion per SKU, per marketplace, or globally.' },
  { icon: SlidersHorizontal, title: 'Min / max restocking', desc: 'Hard floors and ceilings the recommendation has to respect.' },
  { icon: LineChart, title: 'Custom velocity windows', desc: 'Choose the lookback — 7, 30, 90 days, or your own blend.' },
  { icon: Percent, title: 'Promo & marketing plans', desc: 'Feed a planned deal in and the forecast accounts for it.' },
  { icon: Layers, title: 'Per-SKU overrides', desc: 'Override any assumption on any SKU without breaking the model.' },
  { icon: Globe, title: 'Marketplace-level config', desc: 'Different rules for different regions and brands.' },
  { icon: Building2, title: 'Supplier-level settings', desc: 'MOQs, case packs, payment terms, and lead time per supplier.' },
  { icon: TrendingDown, title: 'Stockout-adjusted velocity', desc: 'Days you were dark never drag your baseline down.' },
  { icon: Gauge, title: 'FBA restock limits & IPI', desc: 'Recommendations that respect the space Amazon actually gives you.' },
  { icon: ArrowLeftRight, title: 'Warehouse transfers', desc: 'Plan 3PL → FBA send-ins, not just supplier orders.' },
  { icon: Container, title: 'Container & pallet planning', desc: 'Fill the container without over-ordering the wrong SKU.' },
  { icon: Users, title: 'Roles & approvals', desc: 'Who can change assumptions, who can approve a PO.' },
];

function Depth({ dark }) {
  return (
    <section id="depth" className="py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* SoStocked mention #2 of 2 — the conversion argument for their users. */}
        <SectionHead dark={dark} className="mb-14" eyebrow="Depth & control"
          title="AI-native doesn’t mean you lose control."
          sub="Most AI tools hand you one number and hide the model. DragonRestock gives you every knob SoStocked does — then sets sensible defaults so you only touch the ones that matter to you." />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KNOBS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${t.card(dark)} rounded-2xl p-6`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'}`}>
                <Icon className="w-[22px] h-[22px]" />
              </div>
              <h3 className={`font-semibold text-[16px] mb-1.5 ${t.heading(dark)}`}>{title}</h3>
              <p className={`text-[14px] leading-snug ${t.muted(dark)}`}>{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 5 · Closing CTA ─── */
function ClosingCTA() {
  return (
    <section className="px-6 py-20">
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden px-8 py-16 sm:py-20 text-center bg-gradient-to-br from-[#2F7D4F] to-[#0F3D2E]">
        <div className="absolute -top-16 -left-10 w-80 h-80 bg-[#98CC65]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#FF9900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-clash font-semibold text-white text-3xl sm:text-4xl lg:text-[46px] leading-tight tracking-[-0.02em] max-w-2xl mx-auto">
            Every one of these runs on your own numbers in 10 minutes.
          </h2>
          <p className="mt-5 text-[16px] sm:text-[18px] text-white/80 max-w-xl mx-auto leading-[1.6]">
            Connect Amazon and see all of it against your real catalogue. Free to start, no card required.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={SIGNUP_URL}
              className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white text-[#0F3D2E] text-base font-semibold tracking-wide flex items-center gap-2.5 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all">
              Start free <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/pricing"
              className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white/10 text-white text-base font-semibold tracking-wide flex items-center gap-2 border border-white/25 hover:bg-white/15 transition-colors">
              See pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Demo() {
  const [dark, setDark] = useState(false);
  return (
    <div className={`min-h-screen antialiased ${t.page(dark)}`}>
      <Nav dark={dark} onToggle={() => setDark(v => !v)} base="/" />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-[520px] h-[520px] bg-[#98CC65]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[20%] w-[420px] h-[420px] bg-[#FF9900]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Eyebrow dark={dark} accent="green">Live demo</Eyebrow>
            <h1 className={`font-clash font-semibold text-[40px] sm:text-[54px] lg:text-[62px] leading-[1.05] tracking-[-0.035em] mb-6 ${t.heading(dark)}`}>
              The whole thing,{' '}
              <span className="bg-gradient-to-r from-[#2F7D4F] via-[#98CC65] to-[#FF9900] bg-clip-text text-transparent">go and play with it.</span>
            </h1>
            <p className={`text-[17px] sm:text-[19px] max-w-2xl mx-auto leading-[1.6] ${dark ? 'text-white/60' : 'text-[#1A1A1A]/55'}`}>
              No signup, no video. These are DragonRestock’s actual screens, wired up with a sample seller’s
              catalogue so you can click through them — expand a row, switch a view, upload the invoice, watch it
              price a discount. It’s a walkthrough rather than a live account, so not every control does something.
            </p>
          </motion.div>
        </div>
      </section>

      <Pillars dark={dark} />

      <Differentiator
        dark={dark}
        id="liquidation"
        accent="orange"
        tinted
        eyebrow="Liquidation"
        title="Your dead stock is a decision, not an alert."
        body="Other tools flag a SKU as aging and stop there — a badge, and the decision still sitting with you. But healthy inventory isn’t only about what you buy. DragonRestock recommends what to stop carrying too: which SKUs to discount and to exactly which price tier, which to hold because they’re seasonal rather than dead, and which to clear out — with the monthly profit worked out on every option."
        bullets={[
          'A priced decision on every aging SKU, not a warning badge',
          'Discount tiers tested for real — it finds the price that moves units',
          'Monthly profit compared across every tier before you commit',
          'Knows when to hold: seasonal stock isn’t dead stock',
        ]}
        shot={{ icon: Recycle, label: 'Liquidation dashboard' }}
        Component={LiquidationDemo}
      />

      <Differentiator
        dark={dark}
        id="cashflow"
        accent="green"
        eyebrow="Cashflow"
        title="Know if you can afford the buy before you place it."
        body="A restock plan you can’t fund isn’t a plan. Drop in a supplier invoice and DragonRestock reads it, works out which PO it belongs to, and lines the deposit and balance up against your Amazon payouts and your Wise balance — so you see the squeeze before you’re in it."
        bullets={[
          'Upload an invoice — it matches itself to the right PO',
          'Amazon payouts, Wise balances, and supplier terms on one timeline',
          'Deposits and balances tracked against the dates they actually fall due',
          'Catches timing gaps a monthly total hides completely',
        ]}
        shot={{ icon: Wallet, label: 'Cashflow planner' }}
        Component={CashflowDemo}
      />

      <Differentiator
        dark={dark}
        id="low-inventory-fee"
        accent="orange"
        tinted
        eyebrow="Low-inventory fee"
        title="The fee Amazon never shows you on a line of its own."
        body="Run a SKU under 28 days of cover and Amazon charges you up to $1.36 a unit for it — folded into the fulfilment fee, itemised nowhere. DragonRestock replays the decision week by week to work out what you’ve already paid, projects the next quarter off your real velocity and your inbound POs, and sizes the send-in that makes it stop."
        bullets={[
          'What you were charged, reconstructed — Amazon never itemises it',
          'Both windows checked, because the fee needs both to be under 28',
          'Projected forward with your inbound POs and transfers already in it',
          'Ends in a send-in — quantity, date, and the dollars it saves',
        ]}
        shot={{ icon: Timer, label: 'Low-inventory fee forecast' }}
        Component={LowInventoryFeeDemo}
      />

      <Depth dark={dark} />
      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
