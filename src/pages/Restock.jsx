import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Sparkles, AlertTriangle, Check, TrendingDown,
  FileSpreadsheet, Ship, BadgeCheck, MessageSquare, ListChecks, Send, BellOff, MousePointerClick,
  LineChart, Boxes, BookOpen, Recycle, Wallet, SlidersHorizontal,
} from 'lucide-react';
import Nav from '../components/landing/Nav';
import SiteFooter from '../components/landing/SiteFooter';
import Eyebrow from '../components/landing/Eyebrow';
import SectionHead from '../components/landing/SectionHead';
import MCPChatDemo from '../components/landing/MCPChatDemo';
import LostSalesDemo from '../components/landing/LostSalesDemo';
import RestockBoardDemo from '../components/landing/RestockBoardDemo';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL } from '../config';

/* ──────────────────────────────────────────────────────────────
   DragonRestock — AI-native inventory & restock planning.

   Positioning: SoStocked's depth of configuration with AI doing the
   work, plus two things nobody in the category ships — a liquidation
   dashboard that recommends actions on aging stock, and a cashflow
   planner that tells you whether you can afford the buy.

   Naming rule: SoStocked is referenced exactly twice — the hero
   subhead and the "Depth & control" section — as a depth benchmark,
   never as an attack. No other competitor appears on this page;
   head-to-head comparisons live on /compare/<competitor> routes.

   Section order deliberately puts "How it works" high on the page:
   setup friction is the main reason sellers don't switch inventory
   tools, so the 10-minute claim has to land before the feature depth.

   Design system is shared with the DragonReply LP — see
   components/landing/theme.js.
   ────────────────────────────────────────────────────────────── */
/* ─── 1 · Hero ─── */
function Hero({ dark }) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* decorative brand blurs — green + a warm orange to add color */}
      <div className="absolute -top-10 left-1/4 w-[520px] h-[520px] bg-[#98CC65]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-[18%] w-[460px] h-[460px] bg-[#FF9900]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-[46%] w-[380px] h-[380px] bg-[#2F7D4F]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <h1 className={`font-clash font-semibold text-[44px] sm:text-[60px] lg:text-[76px] leading-[1.04] tracking-[-0.035em] mb-6 ${t.heading(dark)}`}>
            Your restock plan,{' '}
            <span className="bg-gradient-to-r from-[#2F7D4F] via-[#98CC65] to-[#FF9900] bg-clip-text text-transparent">ready to approve.</span>
          </h1>

          {/* SoStocked mention #1 of 2 — framed as a complement, never a swipe. */}
          <p className={`text-[18px] sm:text-[20px] max-w-2xl mx-auto mb-10 leading-[1.6] tracking-[-0.01em] ${dark ? 'text-white/60' : 'text-[#1A1A1A]/55'}`}>
            It works out what to order and when, lays out the reasoning, and waits for one click.
            All the granularity of <span className={`font-medium ${dark ? 'text-white/85' : 'text-[#1A1A1A]/75'}`}>SoStocked</span>, with AI doing the thinking behind the scenes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <a href={SIGNUP_URL}
              className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-[#2F7D4F] text-white text-base font-semibold tracking-wide flex items-center gap-2.5 hover:bg-[#0F3D2E] hover:shadow-xl hover:shadow-[#2F7D4F]/20 hover:-translate-y-0.5 transition-all">
              Start free <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/demo"
              className={`w-full sm:w-auto justify-center px-8 py-4 rounded-lg text-base font-semibold tracking-wide flex items-center gap-2 border-2 transition-all hover:-translate-y-0.5 ${
                dark
                  ? 'border-[#98CC65]/50 text-[#98CC65] hover:bg-[#98CC65]/10'
                  : 'border-[#2F7D4F]/35 text-[#2F7D4F] hover:bg-[#2F7D4F]/[0.06] hover:border-[#2F7D4F]/60'
              }`}>
              <MousePointerClick className="w-5 h-5" /> Try the live demo
            </a>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium tracking-[-0.01em] ${dark ? 'text-white/45' : 'text-[#1A1A1A]/40'}`}>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#5B5BD6]" /> Trained on your full seller history</span>
            <span className="flex items-center gap-2"><BadgeCheck className={`w-4 h-4 ${t.green(dark)}`} /> Set up in 10 minutes</span>
            <span className="flex items-center gap-2"><ShieldCheck className={`w-4 h-4 ${t.green(dark)}`} /> Every marketplace &amp; warehouse</span>
          </div>

          {/* the commercial reassurances, kept separate from the product
              claims above so neither row has to carry both jobs */}
          <div className={`mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[13px] font-medium ${dark ? 'text-white/35' : 'text-[#1A1A1A]/35'}`}>
            {['Free 30-day trial', 'No credit card', 'Your data syncs in hours'].map((item, i) => (
              <span key={item} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true">·</span>}
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 2 · Authority ─── */
function Authority({ dark }) {
  const card = `rounded-2xl ${t.card(dark)}`;
  return (
    <section id="authority" className={`py-24 scroll-mt-24 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14"
          title="Built by operators who’ve placed these purchase orders themselves." />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${card} p-7 flex flex-col justify-center text-center md:text-left`}>
            <div className={`font-clash font-semibold text-[40px] leading-none tracking-[-0.02em] ${t.green(dark)}`}>10 years</div>
            <div className={`mt-2 text-[15px] leading-snug ${t.muted(dark)}`}>selling on Amazon</div>
          </div>

          <div className={`${card} p-7 flex flex-col justify-center text-center md:text-left`}>
            <div className="font-clash font-semibold text-[40px] leading-none tracking-[-0.02em] text-[#F59E0B]">8 figures</div>
            <div className={`mt-2 text-[15px] leading-snug ${t.muted(dark)}`}>in sales, across our own brands</div>
          </div>

          <div className={`${dark ? 'rounded-2xl bg-[#FF9900]/[0.06] border border-[#FF9900]/20' : 'rounded-2xl bg-[#FF9900]/[0.04] border border-[#FF9900]/15'} p-6 flex flex-col items-center justify-center text-center gap-3`}>
            <img src="/logos/badge-amazon-software-partner.svg" alt="Amazon Software Partner" className="h-24 sm:h-28 w-auto" />
            <div className={`text-[14px] leading-snug ${t.muted(dark)}`}>Official Amazon<br />Software Partner</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 3 · The problem ─── */
const PAINS = [
  {
    icon: FileSpreadsheet,
    title: 'A spreadsheet that’s wrong the moment you save it',
    body: 'Velocity, lead times, in-transit units, restock limits — all hand-maintained across tabs. One stale number and you either stock out or tie up cash in inventory you can’t sell.',
  },
  {
    icon: Ship,
    title: 'Lead times you can’t see around',
    body: 'By the time the dashboard says “low”, your supplier still needs 30 days, the boat needs 40, and Amazon needs a week to check it in. The decision was due months ago.',
  },
  {
    icon: BellOff,
    title: 'Software you’re not on top of',
    body: 'Owning a tool isn’t the same as running one. Stale lead times, an unreconciled shipment, a supplier nobody chased — the recommendation was fine, the operation around it wasn’t.',
  },
];

function Pain({ dark }) {
  const iconWrap = dark ? 'bg-white/[0.06] text-white/70' : 'bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/70';

  return (
    <section id="problem" className="py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14" eyebrow="The problem" accent="orange"
          title="Restocking is still a guess."
          sub="A spreadsheet, or software nobody ever finished configuring or continuously maintains — either way the plan is only as good as the operation behind it, and every gap costs you sales or cash." />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div key={title} className={`${t.card(dark)} rounded-2xl p-7 text-left flex flex-col`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${iconWrap}`}>
                <Icon className="w-[22px] h-[22px]" />
              </div>
              <h3 className={`font-clash font-semibold text-[20px] leading-tight tracking-[-0.01em] mb-2.5 ${t.heading(dark)}`}>{title}</h3>
              <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
            </div>
          ))}
        </motion.div>

        {/* Evidence: what the gaps already cost, priced. */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease }} className="mt-20">
          <h3 className={`font-clash font-semibold text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-center mb-3 ${t.heading(dark)}`}>
            💸 See your lost sales, in dollars.
          </h3>
          <p className={`text-[16px] text-center max-w-2xl mx-auto mb-10 leading-[1.6] ${t.muted(dark)}`}>
            DragonRestock reconstructs every stockout in your history and puts a price on it — the units you couldn’t
            sell, the days you were dark, and what each one cost you.
          </p>
          <LostSalesDemo />
        </motion.div>

        {/* The stakes. Theme-independent by design: reproduces the exact rendered
            red used in the demo warnings (#DC2626 at 6% over #F7F8FA → #F5ECEE
            fill, #F0C4C5 border) so dark mode matches instead of turning muddy
            from a translucent red over the dark page. */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2, ease }}
          className="mt-6 rounded-2xl p-6 sm:p-7 flex items-start gap-4"
          style={{ backgroundColor: '#F5ECEE', border: '1px solid #F0C4C5' }}>
          <div className="w-11 h-11 rounded-xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-[22px] h-[22px]" />
          </div>
          <div>
            <h3 className="font-clash font-semibold text-[20px] leading-tight tracking-[-0.01em] mb-1.5 text-[#1A1A1A]">
              A stockout costs you long after the stock comes back.
            </h3>
            <p className="text-[15px] leading-[1.6] text-[#1A1A1A]/65">
              Go to zero and you don’t just lose the sales — you lose the <span className="font-semibold">Buy Box</span>,
              your <span className="font-semibold">organic rank</span>, and the review velocity that took months to build.
              Then you pay for PPC to climb back to where you already were. Overstock, and the same money sits in a
              warehouse racking up <span className="font-semibold text-[#DC2626]">storage fees</span> instead of turning.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 4 · How it works — the 10-minute setup, over MCP ───
   Placed high on the page on purpose: setup friction is the main
   reason sellers don't switch inventory tools. The whole of onboarding
   runs through the MCP connection, so the chat demo below the steps
   *is* the proof — not an illustration of it. */
const STEPS = [
  {
    n: '01',
    logos: [{ src: '/logo-amazon.png', alt: 'Amazon' }],
    title: 'Connect Amazon',
    body: 'One click through Seller Central. DragonRestock pulls your entire sales history, inventory, shipments, and fees — every marketplace, every brand.',
  },
  {
    n: '02',
    logos: [{ src: '/logo-claude.png', alt: 'Claude' }],
    title: 'Connect Claude',
    body: 'DragonRestock runs as an MCP server, so Claude can read and write your inventory directly. From here on you can do everything by asking.',
  },
  {
    n: '03',
    logos: [
      { src: '/logos/google-sheets.svg', alt: 'Google Sheets' },
      { src: '/logos/csv.svg', alt: 'CSV' },
    ],
    title: 'Drop in your costs',
    body: 'Paste a Google Sheet link or upload a CSV — costs, lead times, MOQs, and suppliers. It maps the rows to your SKUs itself. No import wizard, no column mapping, no forms.',
  },
];

/* Logo tiles for the setup steps. Sized to hold both square marks
   (Claude, Sheets) and wide wordmarks (Amazon) without distortion. */
function StepLogos({ dark, logos }) {
  const tile = dark
    ? 'bg-white/[0.07] border border-white/10'
    : 'bg-white border border-[#1A1A1A]/10';
  return (
    <div className="flex items-center gap-2">
      {logos.map(({ src, alt }) => (
        <div key={src} className={`h-11 min-w-[44px] px-2.5 rounded-xl flex items-center justify-center ${tile}`}>
          <img src={src} alt={alt} className="max-h-[22px] max-w-[30px] w-auto h-auto object-contain" />
        </div>
      ))}
    </div>
  );
}

function HowItWorks({ dark }) {
  return (
    <section id="how" className={`py-24 scroll-mt-24 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14" eyebrow="Setup"
          title="Set up with Claude in 10 minutes."
          sub="No implementation call, no import project. You talk to Claude and DragonRestock does the wiring — and if you’d rather we did it, a real person is ready to onboard you the minute you sign up." />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {STEPS.map(({ logos, n, title, body }) => (
            <div key={n} className={`${t.card(dark)} rounded-2xl p-7 text-left`}>
              <div className="flex items-center justify-between mb-5">
                <StepLogos dark={dark} logos={logos} />
                <span className={`font-clash font-semibold text-[28px] leading-none tracking-[-0.02em] ${dark ? 'text-white/12' : 'text-[#1A1A1A]/10'}`}>{n}</span>
              </div>
              <h3 className={`font-clash font-semibold text-[20px] leading-tight tracking-[-0.01em] mb-2.5 ${t.heading(dark)}`}>{title}</h3>
              <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease }}>
          <h3 className={`font-clash font-semibold text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-center mb-3 ${t.heading(dark)}`}>
            And it doesn’t stop at setup.
          </h3>
          <p className={`text-[16px] text-center max-w-2xl mx-auto mb-10 leading-[1.6] ${t.muted(dark)}`}>
            Once Claude is connected, the dashboard is optional. Ask for the plan, chase a supplier, or fix a cost — in the same window you already work in. And when a setting goes stale — a lead time nobody updated, a cost that drifted, a supplier with no MOQ on file — it comes back and asks you for it instead of quietly forecasting on bad data.
          </p>
          <MCPChatDemo dark={dark} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 5 · The solution — clear actionables ───
   The thesis section, and the lead of the whole solution story. It
   absorbed what used to be a separate "Reorder dates" pillar: that
   pillar and this section were making the same argument, so the
   order-by date, the quantity, and the lead-time legs now live in
   the cards below instead of in a band of their own. */
const ANSWERS = [
  {
    icon: ListChecks,
    title: 'An instruction, not an alert',
    body: '“Order 1,200 units of SHIRT-RED-M from Lianfa today.” A SKU, a quantity, a supplier, and a hard order-by date — not a red badge you have to go interpret.',
  },
  {
    icon: Sparkles,
    title: 'The reasoning, if you want it',
    body: 'Every number opens up: velocity, each leg of the lead time — production, freight, and Amazon check-in — and the seasonal multiplier behind it. Auditable when you care, invisible when you don’t.',
  },
  {
    icon: Send,
    title: 'The next step already taken',
    body: 'The PO is drafted at the right quantity — MOQs, case packs, and container fill already respected — priced, and checked against your cash. You approve, or you don’t.',
  },
];

/* Short teasers for everything that moved to /demo — title, one line,
   and a deep link into that section of the demo. */
const MORE = [
  { icon: LineChart, title: 'Forecasting', desc: 'Seasonality and Q4 lift learned from your own history, with Prime Day kept out of the baseline.', href: '/demo#forecasting' },
  { icon: Boxes, title: 'Complete inventory overview', desc: 'Every PO tracked from deposit to check-in, and landed shipments matched back to the order that shipped them.', href: '/demo#inventory' },
  { icon: BookOpen, title: 'AI Knowledge Center', desc: 'What you know about your suppliers, written down once and read by every teammate’s Claude.', href: '/demo#knowledge' },
  { icon: Recycle, title: 'Liquidation', desc: 'What to discount and to what price, what to hold, and what to clear — with the monthly profit on each option.', href: '/demo#liquidation' },
  { icon: Wallet, title: 'Cashflow planner', desc: 'Invoices matched to their PO and run against your Amazon payouts, so timing gaps surface early.', href: '/demo#cashflow' },
  { icon: SlidersHorizontal, title: 'Depth & control', desc: 'Buffer stock, min/max, velocity windows, supplier terms — every knob a mature planner gives you.', href: '/demo#depth' },
];

function MoreCards({ dark }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.12, ease }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {MORE.map(({ icon: Icon, title, desc, href }) => (
        <a key={title} href={href}
          className={`${t.card(dark)} rounded-2xl p-5 group transition-colors ${dark ? 'hover:bg-white/[0.06]' : 'hover:border-[#2F7D4F]/30'}`}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'}`}>
              <Icon className="w-[17px] h-[17px]" />
            </span>
            <h3 className={`font-semibold text-[15px] ${t.heading(dark)}`}>{title}</h3>
            <ArrowRight className={`w-3.5 h-3.5 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${t.green(dark)}`} />
          </div>
          <p className={`text-[13.5px] leading-snug ${t.muted(dark)}`}>{desc}</p>
        </a>
      ))}
    </motion.div>
  );
}

function Solution({ dark }) {
  return (
    <section id="features" className="py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14" eyebrow="Clear actionables"
          title="It tells you what to do. Not what to look at."
          sub="Filters, alerts, and reports are just work in a nicer font — every one of them ends with you still having to decide. DragonRestock does the deciding and hands you the instruction: which SKU, how many units, which supplier, and the date the order has to go out." />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.05, ease }} className="mb-4">
          <RestockBoardDemo />
        </motion.div>
        <p className={`text-center text-[13px] mb-10 ${dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
          Expand any row to see the quantity justified — lead-time legs, seasonality, and seven windows of velocity.
        </p>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ANSWERS.map(({ icon: Icon, title, body }) => (
            <div key={title} className={`${t.card(dark)} rounded-2xl p-7`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'}`}>
                <Icon className="w-[22px] h-[22px]" />
              </div>
              <h3 className={`font-clash font-semibold text-[19px] leading-tight tracking-[-0.01em] mb-2 ${t.heading(dark)}`}>{title}</h3>
              <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ─── 6 · The demo hand-off ───
   Its own band, on the tinted background with a border top and bottom.
   The Solution section above ends on the restock board and its three
   cards; this is a separate pitch — here is everything else, and you
   can go and click it — so it needs to read as a separate section
   rather than as more of the same. */
function DemoTeaser({ dark }) {
  return (
    <section className={`py-20 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-12" eyebrow="Everything else"
          title="That’s one screen. Here’s the rest."
          sub="Forecasting, order tracking, liquidation, cashflow — and every one of them is clickable before you sign up for anything." />

        <MoreCards dark={dark} />

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease }} className="mt-14 text-center">
          <a href="/demo"
            className="inline-flex items-center gap-3 px-9 py-5 rounded-xl bg-[#2F7D4F] text-white text-[18px] font-bold tracking-wide shadow-xl shadow-[#2F7D4F]/25 hover:bg-[#0F3D2E] hover:shadow-2xl hover:shadow-[#2F7D4F]/30 hover:-translate-y-0.5 transition-all">
            <MousePointerClick className="w-6 h-6" />
            Play with the live demo
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className={`mt-4 text-[14px] ${dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}`}>
            Every screen above, live and clickable. No signup.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 7 · Closing CTA ─── */
function ClosingCTA() {
  return (
    <section className="px-6 py-20">
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden px-8 py-16 sm:py-20 text-center bg-gradient-to-br from-[#2F7D4F] to-[#0F3D2E]">
        <div className="absolute -top-16 -left-10 w-80 h-80 bg-[#98CC65]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#FF9900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-clash font-semibold text-white text-3xl sm:text-4xl lg:text-[46px] leading-tight tracking-[-0.02em] max-w-2xl mx-auto">
            Know what to order, when, and whether you can afford it.
          </h2>
          <p className="mt-5 text-[16px] sm:text-[18px] text-white/80 max-w-xl mx-auto leading-[1.6]">
            Connect Amazon and DragonRestock builds your first restock plan in ten minutes.
            Free to start, no card required.
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

export default function Restock() {
  const [dark, setDark] = useState(false);
  return (
    <div className={`min-h-screen antialiased ${t.page(dark)}`}>
      <Nav dark={dark} onToggle={() => setDark(v => !v)} />
      <Hero dark={dark} />
      <Authority dark={dark} />
      <Pain dark={dark} />
      <HowItWorks dark={dark} />
      <Solution dark={dark} />
      <DemoTeaser dark={dark} />

      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
