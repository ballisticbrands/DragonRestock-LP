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
import LostSalesForecastDemo from '../components/landing/LostSalesForecastDemo';
import ForecastDemo from '../components/landing/ForecastDemo';
import OrderTrackerDemo from '../components/landing/OrderTrackerDemo';
import KnowledgeCenterDemo from '../components/landing/KnowledgeCenterDemo';
import LiquidationDemo from '../components/landing/LiquidationDemo';
import CashflowDemo from '../components/landing/CashflowDemo';
import LowInventoryFeeDemo from '../components/landing/LowInventoryFeeDemo';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL } from '../config';
import { PILLARS_COPY, DIFFERENTIATORS_COPY } from '../data/restockCopy';

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

/* ─── 1 · The feature pillars ───
   Copy lives in the JSX-free data module so the build-time prerender can
   emit it (src/data/restockCopy.js); this file attaches the icon, accent
   and live demo component to each entry. Never inline copy here. */
/* lost-sales runs the forecast panel, not the history-only one. The two
   said the same thing about the past and only one of them says anything
   about the next stockout, so LostSalesDemo is off this page — it still
   renders the landing page's "Why it matters" section, and swapping it
   back here is a one-word change. */
const PILLAR_META = {
  restock:      { accent: 'green',  icon: ListChecks,   Component: RestockBoardDemo },
  'lost-sales': { accent: 'orange', icon: TrendingDown, Component: LostSalesForecastDemo },
  forecasting:  { accent: 'orange', icon: LineChart,    Component: ForecastDemo },
  inventory:    { accent: 'green',  icon: Boxes,        Component: OrderTrackerDemo },
  knowledge:    { accent: 'indigo', icon: BookOpen,     Component: KnowledgeCenterDemo },
};
const PILLARS = PILLARS_COPY.map(p => ({ ...p, ...PILLAR_META[p.id], wide: true }));

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

  // `large` is read by the demos that carry a written explanation panel —
  // those are read as prose, so they run at reading size, not UI size.
  const visual = Component
    ? <Component dark={dark} large />
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
/* The connected stack for a band, as marks rather than prose — the
   fastest way to answer "does it plug into what I already use?". Sits
   between the bullets and the demo panel, so it reads as a fact about
   the product rather than a row inside the screenshot.

   Tiles stay white in both themes: these are full-colour brand marks
   (Amazon's is a dark wordmark) and they only read cleanly on white.
   Placeholder marks live in /public/logos — swap in the official
   assets at the same filenames. */
const CASHFLOW_INTEGRATIONS = [
  {
    label: 'Reads',
    note: 'Amazon payouts & reimbursements · Wise and Payoneer balances',
    logos: [
      { src: '/logo-amazon.png', alt: 'Amazon', wide: true },
      { src: '/logos/wise.svg', alt: 'Wise' },
      { src: '/logos/payoneer.svg', alt: 'Payoneer' },
    ],
  },
  {
    label: 'Writes',
    note: 'Every invoice posted to your books',
    logos: [
      { src: '/logos/xero.svg', alt: 'Xero' },
      { src: '/logos/quickbooks.svg', alt: 'QuickBooks' },
    ],
  },
];

/* One mark, with its name on hover. The tooltip is ours rather than the
   browser's `title` — it appears immediately, and a strip of unlabelled
   logos is exactly where a half-second delay loses the answer. */
function LogoTile({ dark, src, alt, wide }) {
  return (
    <span className={`group relative h-8 ${wide ? 'px-2' : 'w-8'} rounded-lg bg-white flex items-center justify-center shrink-0 border transition-colors ${
      dark ? 'border-white/15 hover:border-white/35' : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/25'
    }`}>
      <img src={src} alt={alt} className="max-h-[17px] max-w-[34px] w-auto h-auto object-contain" />

      <span role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 rounded-md px-2 py-1
          text-[11px] font-semibold leading-none whitespace-nowrap opacity-0 shadow-lg transition-all duration-150
          group-hover:opacity-100 group-hover:translate-y-0 ${
            dark ? 'bg-white text-[#1A1A1A] shadow-black/40' : 'bg-[#1A1A1A] text-white shadow-black/20'
          }`}>
        {alt}
        <span className={`absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 ${dark ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
      </span>
    </span>
  );
}

function IntegrationStrip({ dark, groups }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-7 gap-y-4">
      {groups.map(({ label, note, logos }, i) => (
        <div key={label} className="flex items-center gap-2.5">
          {i > 0 && <span className={`hidden lg:block w-px h-7 mr-4 ${dark ? 'bg-white/10' : 'bg-[#1A1A1A]/10'}`} />}
          <span className={`text-[9.5px] font-bold uppercase tracking-wide ${dark ? 'text-white/35' : 'text-[#1A1A1A]/35'}`}>{label}</span>
          <span className="flex items-center gap-1.5">
            {logos.map(({ src, alt, wide }) => (
              <LogoTile key={alt} dark={dark} src={src} alt={alt} wide={wide} />
            ))}
          </span>
          <span className={`text-[12.5px] ${t.muted(dark)}`}>{note}</span>
        </div>
      ))}
    </div>
  );
}

function Differentiator({ dark, id, accent, eyebrow, title, body, bullets, shot, src, tinted, Component, integrations }) {
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
          {integrations && <IntegrationStrip dark={dark} groups={integrations} />}
          {Component
            ? <Component dark={dark} large />
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
  { icon: TrendingDown, title: 'Stockout-adjusted velocity', desc: 'Days you were out of stock never drag your baseline down.' },
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
        {...DIFFERENTIATORS_COPY['liquidation']}
        shot={{ icon: Recycle, label: DIFFERENTIATORS_COPY['liquidation'].shotLabel }}
        Component={LiquidationDemo}
      />

      <Differentiator
        dark={dark}
        id="cashflow"
        accent="green"
        integrations={CASHFLOW_INTEGRATIONS}
        {...DIFFERENTIATORS_COPY['cashflow']}
        shot={{ icon: Wallet, label: DIFFERENTIATORS_COPY['cashflow'].shotLabel }}
        Component={CashflowDemo}
      />

      <Differentiator
        dark={dark}
        id="low-inventory-fee"
        accent="orange"
        tinted
        {...DIFFERENTIATORS_COPY['low-inventory-fee']}
        shot={{ icon: Timer, label: DIFFERENTIATORS_COPY['low-inventory-fee'].shotLabel }}
        Component={LowInventoryFeeDemo}
      />

      <Depth dark={dark} />
      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
