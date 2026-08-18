import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Sparkles, AlertTriangle, Check, TrendingDown,
  Settings2, Calculator, BellOff, BadgeCheck, MessageSquare, ListChecks, Send, MousePointerClick,
  LineChart, Boxes, BookOpen, Recycle, Wallet, ClipboardList, PackageCheck,
  Warehouse, Building2, Timer, Mail, Puzzle, FileText,
} from 'lucide-react';
import Nav from '../components/landing/Nav';
import SiteFooter from '../components/landing/SiteFooter';
import Eyebrow from '../components/landing/Eyebrow';
import SectionHead from '../components/landing/SectionHead';
import MCPChatDemo from '../components/landing/MCPChatDemo';
import LostSalesForecastDemo from '../components/landing/LostSalesForecastDemo';
import RestockBoardDemo from '../components/landing/RestockBoardDemo';
import ForecastDemo from '../components/landing/ForecastDemo';
import LiquidationDemo from '../components/landing/LiquidationDemo';
import CashflowDemo from '../components/landing/CashflowDemo';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL, CONTACT_EMAIL } from '../config';
/* All marketing copy on this page lives in the JSX-free data module so the
   build-time prerender can emit it — see src/data/restockCopy.js. This file
   supplies icons, logos and layout; it must not carry new copy of its own. */
import {
  HERO_COPY, PAINS_HEAD_COPY, PAINS_COPY, BEYOND_REORDER_COPY, LOST_SALES_COPY, SETUP_STEPS_COPY,
  SETUP_HELP_COPY, ANSWERS_COPY, PLATFORM_COPY,
} from '../data/restockCopy';

/* ──────────────────────────────────────────────────────────────
   DragonRestock — AI-native inventory & restock planning.

   Positioning: SoStocked's depth of configuration with AI doing the
   work, plus two things nobody in the category ships — a liquidation
   dashboard that recommends actions on aging stock, and a cashflow
   planner that tells you whether you can afford the buy.

   Naming rule: SoStocked is referenced exactly twice on this page —
   the hero subhead, and the credit note on problem 03 where it is
   conceded the actionables point before the line is drawn at the
   missing reasoning. A depth benchmark and an honest exception, never
   an attack. (The "Depth & control" section carrying the other named
   mention lives on /demo.) No other competitor appears here;
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

          {/* The thesis, under the buttons rather than above the headline:
              the h1 is the promise a visitor came for, and putting the
              problem first would make them read a complaint before they know
              what this is. Left-aligned inside a centred hero because two
              sentences of argument set centred read as a poster.

              Neutral card, not the red alert used further down — this is a
              fact the page is built on, and opening on an alarm undercuts
              "ready to approve" three inches above it. */}
          <div className={`mt-12 mx-auto max-w-2xl rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-left ${t.card(dark)}`}>
            <span className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </span>
            <p className={`text-[15px] sm:text-[15.5px] leading-[1.6] ${t.muted(dark)}`}>
              <span className={`font-semibold ${t.heading(dark)}`}>{HERO_COPY.stockout.title}</span>{' '}
              {HERO_COPY.stockout.body}
            </p>
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

/* ─── 3 · The problem ───
   One problem per row, not a card grid: a row has the width to carry an
   illustration beside the words, and cards pushed the copy into paragraphs
   nobody reads. Every row is a pair — the pain, then immediately what we do
   about it — because a problem a visitor has to mentally match to the
   product is a problem they scroll past. Both halves live in PAINS_COPY.

   Two rows, not three. Setup and maintenance share one — they're the same
   complaint about configuration, before and after go-live — and the
   onboarding transcript illustrates both. The calculator row carries the
   forecast screen instead, frozen so nobody wanders off into the
   aggregation tabs: the job of that image is to show Prime Day being kept
   out of the baseline, nothing else.

   Both illustrations are the real components from /demo rather than
   screenshots, so neither can drift out of sync with the page it came from. */
/* every key in PAINS_COPY needs an entry here — a missing one renders as
   `undefined` and takes the whole page down with it */
const PAIN_ICONS = { configuration: Settings2, calculator: Calculator, actionables: BellOff };
/* numbered so the section reads as a list you can work down. The count runs
   on into the liquidation/cashflow band at the foot of the section, which is
   problem four — it just needs a band rather than a row to hold two
   products. Numbering is a layout affordance, so it's generated here rather
   than written into the copy module. */
const PAINS = PAINS_COPY.map((p, i) => ({ ...p, icon: PAIN_ICONS[p.key], n: `0${i + 1}` }));
const BEYOND_N = `0${PAINS.length + 1}`;
/* what an instruction actually contains — the three cards under the
   restock board in problem 03. They absorbed what used to be a separate
   "Reorder dates" pillar, so the order-by date, the quantity and the
   lead-time legs all live here. */
const ANSWER_ICONS = { instruction: ListChecks, reasoning: Sparkles, 'next-step': Send };
const ANSWERS = ANSWERS_COPY.map(a => ({ ...a, icon: ANSWER_ICONS[a.key] }));

const CONFIG_PAIN = PAINS.find(p => p.key === 'configuration');
const REASONING_PAIN = PAINS.find(p => p.key === 'calculator');
const ACTION_PAIN = PAINS.find(p => p.key === 'actionables');
const BEYOND_ICONS = { liquidation: Recycle, cashflow: Wallet };
/* The two screens themselves, frozen — same components /demo runs, so
   neither can drift out of sync with the page it came from. Every key in
   BEYOND_REORDER_COPY.items needs an entry here. */
const BEYOND_DEMOS = { liquidation: LiquidationDemo, cashflow: CashflowDemo };

function Pain({ dark }) {
  const iconWrap = dark ? 'bg-white/[0.06] text-white/70' : 'bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/70';

  const PainNumber = ({ n }) => (
    <span className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
      dark ? 'text-white/35' : 'text-[#1A1A1A]/35'
    }`}>
      Problem <span className={t.green(dark)}>{n}</span>
    </span>
  );

  /* The one place a competitor is conceded a point. Set apart with a rule
     down the side so it reads as an aside in our own voice, not as more of
     the charge above it. */
  const Credit = ({ title, body }) => (
    <div className={`mt-5 pl-4 border-l-2 ${dark ? 'border-[#FF9900]/40' : 'border-[#B45309]/30'}`}>
      <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>
        <span className={`font-semibold ${dark ? 'text-white/85' : 'text-[#1A1A1A]/80'}`}>{title} </span>
        {body}
      </p>
    </div>
  );

  /* The beat label: amber for the charge, green for the answer. The page
     already spends amber on "Competitors:" and green on everything that is
     ours, so a reader who has scrolled this far doesn't have to be taught
     the code — but the word is there anyway, because a colour is not a
     label. `topic` keeps "Setup" and "Maintenance" visible without a second
     line of labels stacked on the first. */
  const BeatLabel = ({ icon: Icon, tone, children }) => (
    <span className={`flex items-center gap-2 mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] ${
      tone === 'green' ? t.green(dark) : (dark ? 'text-[#F5C451]' : 'text-[#B45309]')
    }`}>
      <Icon className="w-[13px] h-[13px] shrink-0" />
      {children}
    </span>
  );

  /* One problem → answer beat, and the only shape the section uses. The
     answer sits on its own tinted surface rather than under a hairline, so
     the two halves are different objects on the page instead of two
     paragraphs with a line between them.

     `label` is the topic ("Setup", "Maintenance") and only problem 01 has
     one — it carries two beats under a single heading, and without the
     topic they'd read as one long complaint. `credit` is problem 03's
     concession and belongs to the charge, so it stays above the answer. */
  const Pair = ({ label, body, solution, credit, children }) => (
    <div>
      <BeatLabel icon={AlertTriangle} tone="amber">
        The problem
        {label && (
          <>
            <span className={dark ? 'text-white/30' : 'text-[#1A1A1A]/30'}>·</span>
            <span className={dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}>{label}</span>
          </>
        )}
      </BeatLabel>
      <p className={`text-[16px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
      {credit && <Credit {...credit} />}

      <div className={`mt-4 rounded-xl p-4 sm:p-5 border ${
        dark ? 'bg-[#98CC65]/[0.07] border-[#98CC65]/20' : 'bg-[#2F7D4F]/[0.06] border-[#2F7D4F]/20'
      }`}>
        <BeatLabel icon={BadgeCheck} tone="green">DragonRestock</BeatLabel>
        <p className={`text-[15.5px] leading-[1.6] ${dark ? 'text-white/80' : 'text-[#1A1A1A]/75'}`}>
          {solution}
        </p>
        {/* anything the answer needs beyond a paragraph — problem 04 names
            its two dashboards here */}
        {children}
      </div>
    </div>
  );

  /* One problem, one heading — but a problem may hold several problem →
     answer pairs under it (`parts`), which is how setup and maintenance sit
     together as problem 01 without inflating the count to four. */
  const PainCopy = ({ icon: Icon, title, body, solution, n, parts, prefix, credit }) => (
    <div className="text-left">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconWrap}`}>
          <Icon className="w-[22px] h-[22px]" />
        </div>
        <PainNumber n={n} />
      </div>
      {/* the prefix carries the comparison: without it each headline reads
          as a general observation rather than a charge against the tools
          the visitor is paying for today */}
      <h3 className={`font-clash font-semibold text-[22px] sm:text-[26px] leading-tight tracking-[-0.02em] mb-5 ${t.heading(dark)}`}>
        {prefix && <span className="text-[#B45309]">{prefix}: </span>}
        {title}
      </h3>

      {parts ? (
        <div className="space-y-7">
          {parts.map(part => <Pair key={part.label} {...part} />)}
        </div>
      ) : (
        <Pair body={body} solution={solution} credit={credit} />
      )}
    </div>
  );

  return (
    <section id="problem" className="py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14" accent="orange"
          eyebrow={PAINS_HEAD_COPY.eyebrow}
          title={PAINS_HEAD_COPY.title}
          sub={PAINS_HEAD_COPY.sub} />

        <div className="space-y-4">
          {/* Configuration: getting set up, and staying set up. */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.06, ease }}
            className={`${t.card(dark)} rounded-2xl p-7 sm:p-9 grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 lg:gap-12 items-stretch`}>
            {/* stretched, not centered: the chat window sizes itself to the
                full height of the copy beside it and scrolls internally */}
            <MCPChatDemo dark={dark} only="onboard" compact />

            <div className="flex flex-col justify-center">
              <PainCopy {...CONFIG_PAIN} />
            </div>
          </motion.div>

          {/* Reasoning: the screen goes under the words here, because the
              chart needs the full width to read at all. */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
            className={`${t.card(dark)} rounded-2xl p-7 sm:p-9`}>
            <div className="max-w-3xl">
              <PainCopy {...REASONING_PAIN} />
            </div>
            <div className="mt-9">
              <ForecastDemo interactive={false} large />
            </div>
          </motion.div>

          {/* Actionables: the restock board is the answer, so it gets the
              full width, and the three ANSWERS cards break down what an
              instruction contains. */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.14, ease }}
            className={`${t.card(dark)} rounded-2xl p-7 sm:p-9`}>
            <div className="max-w-3xl">
              <PainCopy {...ACTION_PAIN} />
            </div>

            <div className="mt-9">
              <RestockBoardDemo short large />
            </div>
            <p className={`text-center text-[13px] mt-4 ${dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
              {ACTION_PAIN.demoCaption}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {ANSWERS.map(({ icon: Icon, title, body }) => (
                <div key={title} className={`rounded-xl p-6 ${dark ? 'bg-white/[0.04]' : 'bg-[#1A1A1A]/[0.03]'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'
                  }`}>
                    <Icon className="w-[20px] h-[20px]" />
                  </div>
                  <h4 className={`font-clash font-semibold text-[18px] leading-tight tracking-[-0.01em] mb-2 ${t.heading(dark)}`}>{title}</h4>
                  <p className={`text-[14.5px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* The fourth beat, and the one nothing else in the category answers:
            reordering is a third of the job. A band rather than a fourth card
            because it carries two products, each of which gets its own row
            and its own screen underneath — frozen, because the point here is
            to see that these exist, and /demo is where you go to poke them. */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.12, ease }}
          className={`mt-4 rounded-2xl p-8 sm:p-10 ${t.card(dark)}`}>
          {/* One pair for the whole band — the charge is that the category
              answers one question out of three, which is a single point and
              is made once. The two rows below are the screens that back it,
              not two more arguments. */}
          <div className="max-w-3xl">
            <div className="mb-3"><PainNumber n={BEYOND_N} /></div>
            <h3 className={`font-clash font-semibold text-2xl sm:text-[30px] leading-tight tracking-[-0.02em] mb-5 ${t.heading(dark)}`}>
              {BEYOND_REORDER_COPY.title}
            </h3>

            <Pair
              body={
                <>
                  {BEYOND_REORDER_COPY.lead}{' '}
                  <span className={`font-semibold ${t.heading(dark)}`}>{BEYOND_REORDER_COPY.leadEmphasis}</span>{' '}
                  {BEYOND_REORDER_COPY.leadAfter}
                </>
              }
              solution={BEYOND_REORDER_COPY.solution}>
              <ul className="mt-3 space-y-2">
                {BEYOND_REORDER_COPY.bullets.map(({ label, text }) => (
                  <li key={label} className={`flex items-start gap-3 text-[15.5px] leading-[1.6] ${dark ? 'text-white/80' : 'text-[#1A1A1A]/75'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[9px] ${dark ? 'bg-[#98CC65]' : 'bg-[#2F7D4F]'}`} />
                    <span>
                      <span className={`font-semibold ${t.heading(dark)}`}>{label}</span> — {text}
                    </span>
                  </li>
                ))}
              </ul>
            </Pair>
          </div>

          {/* A row each, with the screen under the words. Two cards side by
              side could only ever describe these — and a claim this big
              ("nobody else does either of these") is exactly the one a
              visitor won't take on trust from a paragraph. */}
          <div className="mt-10 space-y-10">
            {BEYOND_REORDER_COPY.items.map(({ key, title, body, href, demoCaption }) => {
              const Icon = BEYOND_ICONS[key];
              const Demo = BEYOND_DEMOS[key];
              return (
                <div key={key} className={`pt-9 border-t ${dark ? 'border-white/[0.08]' : 'border-[#1A1A1A]/[0.08]'}`}>
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3.5 mb-3">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <h4 className={`font-clash font-semibold text-[20px] sm:text-[23px] leading-tight tracking-[-0.02em] ${t.heading(dark)}`}>
                        {title}
                      </h4>
                    </div>
                    <p className={`text-[16px] leading-[1.6] ${t.muted(dark)}`}>{body}</p>
                  </div>

                  {/* frozen: the real screen, with nothing to click. The
                      clickable copy of it is one link away and this row
                      has an argument to finish. */}
                  <div className="mt-7">
                    <Demo interactive={false} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <p className={`max-w-2xl text-[13px] leading-[1.55] ${dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
                      {demoCaption}
                    </p>
                    <a href={href}
                      className={`group inline-flex items-center gap-1.5 text-[13px] font-semibold shrink-0 ${t.green(dark)}`}>
                      {BEYOND_REORDER_COPY.ctaLabel}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={`mt-7 text-[15.5px] font-medium leading-[1.6] ${t.green(dark)}`}>
            {BEYOND_REORDER_COPY.kicker}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 3b · The bill ───
   What the problems above already cost, priced. Its own section rather
   than the last block of the problem section: it isn't a fifth problem,
   it's the invoice for the four, and a visitor who wants to know what
   standing still costs should be able to jump straight here from the
   nav.

   White with a hairline rather than the tinted treatment: How it works
   and The platform below are both tinted already, and a third tinted
   band butting onto those two would read as one long grey run.

   LOST_SALES_COPY.lead is the join back up the page — without it this
   reads as a separate feature pitch instead of the bill for all of it. */
function Cost({ dark }) {
  return (
    <section id="cost" className={`py-24 scroll-mt-24 border-t ${dark ? 'border-white/[0.07]' : 'border-[#1A1A1A]/[0.07]'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease }}>
          {/* the same pill every other section wears, so this reads as a
              section of the page rather than a block that fell out of the
              one above — and it repeats the nav label that points here.
              Amber, matching the problem section it bills for. Centred on
              its own row rather than by a text-center on the wrapper: the
              demo panel below is inside this block and sets its own
              alignment. */}
          <div className="text-center">
            <Eyebrow dark={dark} accent="orange">{LOST_SALES_COPY.eyebrow}</Eyebrow>
          </div>
          <p className={`text-[13px] font-bold uppercase tracking-[0.16em] text-center mb-3 ${
            dark ? 'text-white/40' : 'text-[#1A1A1A]/40'
          }`}>
            {LOST_SALES_COPY.lead}
          </p>
          <h2 className={`font-clash font-semibold text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-center mb-3 ${t.heading(dark)}`}>
            {LOST_SALES_COPY.title}
          </h2>
          <p className={`text-[17px] text-center max-w-2xl mx-auto mb-10 leading-[1.6] ${t.mutedStrong(dark)}`}>
            {LOST_SALES_COPY.sub}
          </p>

          {/* The one live panel on this page. Every other demo up the page is
              frozen on purpose — mid-argument, a screen that invites clicking
              costs the reader the thread. This section is the end of the
              argument rather than a step inside it, so there's nothing left to
              lose the thread of, and the thing worth doing here (open a
              product, scroll its chart past Today) can't be done by looking. */}
          <LostSalesForecastDemo />
          <p className={`mt-4 text-[13px] text-center ${dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
            {LOST_SALES_COPY.caption}
          </p>
        </motion.div>

        {/* The stakes. Theme-independent by design: reproduces the exact rendered
            red used in the demo warnings (#DC2626 at 6% over #F7F8FA → #F5ECEE
            fill, #F0C4C5 border) so dark mode matches instead of turning muddy
            from a translucent red over the dark page. */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
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
const STEP_LOGOS = {
  amazon: [{ src: '/logo-amazon.png', alt: 'Amazon' }],
  claude: [{ src: '/logo-claude.png', alt: 'Claude' }],
  costs: [
    { src: '/logos/google-sheets.svg', alt: 'Google Sheets' },
    { src: '/logos/csv.svg', alt: 'CSV' },
  ],
};
const STEPS = SETUP_STEPS_COPY.map(s => ({ ...s, logos: STEP_LOGOS[s.key] }));

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

/* The three ways the ten-minute setup stops being ten minutes. Named
   plainly, because a seller who quietly thinks "mine won't work" won't
   ask — the point of the block is to say the objection out loud first. */
const SETUP_HELP_ICONS = { 'new-to-claude': MessageSquare, nonstandard: Puzzle, invoices: FileText };
const SETUP_HELP = SETUP_HELP_COPY.map(h => ({ ...h, icon: SETUP_HELP_ICONS[h.key] }));

function SetupHelp({ dark }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
      className={`mt-16 rounded-2xl p-8 sm:p-10 ${t.card(dark)}`}>
      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14">
        <div>
          <h3 className={`font-clash font-semibold text-2xl sm:text-[30px] leading-tight tracking-[-0.02em] mb-4 ${t.heading(dark)}`}>
            And if any of it doesn’t fit you — just write to us.
          </h3>
          <p className={`text-[15.5px] leading-[1.65] mb-5 ${t.muted(dark)}`}>
            10 minutes is the normal case. If yours isn’t the normal case, that’s a conversation, not a dead end —
            a real person reads it and we’ll try to make it work for your business. And in the unlikely case that
            we can’t, we’ll tell you straight away, before you’ve moved anything across.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Setting%20up%20DragonRestock`}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-[15px] font-semibold tracking-wide border-2 transition-all hover:-translate-y-0.5 ${
              dark
                ? 'border-[#98CC65]/50 text-[#98CC65] hover:bg-[#98CC65]/10'
                : 'border-[#2F7D4F]/35 text-[#2F7D4F] hover:bg-[#2F7D4F]/[0.06] hover:border-[#2F7D4F]/60'
            }`}>
            <Mail className="w-[18px] h-[18px]" /> {CONTACT_EMAIL}
          </a>
        </div>

        <div className={`grid gap-px rounded-xl overflow-hidden ${dark ? 'bg-white/[0.07]' : 'bg-[#1A1A1A]/[0.07]'}`}>
          {SETUP_HELP.map(({ icon: Icon, title, body }) => (
            <div key={title} className={`flex items-start gap-3.5 p-5 sm:p-6 ${dark ? 'bg-[#141618]' : 'bg-[#fafafa]'}`}>
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'
              }`}>
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <h4 className={`font-semibold text-[15.5px] mb-1 ${t.heading(dark)}`}>{title}</h4>
                <p className={`text-[13.5px] leading-[1.55] ${t.muted(dark)}`}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HowItWorks({ dark }) {
  return (
    <section id="how" className={`py-24 scroll-mt-24 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-14" eyebrow="Quick setup w/ AI"
          title="Set up with Claude in 10 minutes."
          sub="No implementation call, no import project. You talk to Claude and DragonRestock does the wiring — and if you’d rather we did it, a real person is ready to onboard you the minute you sign up. Never used Claude? That’s fine, and it’s covered below." />

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

        <SetupHelp dark={dark} />
      </div>
    </section>
  );
}

/* The platform, in full. Not just the six screens with demos behind
   them — the point of this list is breadth, so a visitor can see how
   much system is here before deciding whether to click into it.

   Items that have a live demo carry `href` and get a chip; the rest
   are plain, which keeps the list honest about what's clickable. */
const PLATFORM_ICONS = {
  restock: ListChecks, 'lost-sales': TrendingDown, forecasting: LineChart,
  'purchase-orders': ClipboardList, reconciliation: PackageCheck, knowledge: BookOpen,
  liquidation: Recycle, cashflow: Wallet, 'low-inventory-fee': Timer,
  inventory: Boxes, '3pl': Warehouse, suppliers: Building2,
};
const PLATFORM = PLATFORM_COPY.map(p => ({ ...p, icon: PLATFORM_ICONS[p.key] }));

function PlatformList({ dark }) {
  const divider = dark ? 'border-white/[0.07]' : 'border-[#1A1A1A]/[0.07]';
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
      className="grid md:grid-cols-2 gap-x-12">
      {PLATFORM.map(({ icon: Icon, title, desc, href }) => {
        const Tag = href ? 'a' : 'div';
        return (
          <Tag key={title} href={href}
            className={`group flex items-start gap-3.5 py-5 border-b ${divider} ${href ? 'cursor-pointer' : ''}`}>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              dark ? 'bg-white/[0.06] text-white/60' : 'bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/55'
            } ${href ? (dark ? 'group-hover:bg-[#98CC65]/15 group-hover:text-[#98CC65]' : 'group-hover:bg-[#2F7D4F]/10 group-hover:text-[#2F7D4F]') : ''}`}>
              <Icon className="w-[18px] h-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <span className={`font-semibold text-[15.5px] ${t.heading(dark)}`}>{title}</span>
                {href && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide transition-colors ${
                    dark ? 'bg-[#98CC65]/15 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'
                  }`}>
                    Demo <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                )}
              </span>
              <span className={`block text-[13.5px] leading-[1.55] ${t.muted(dark)}`}>{desc}</span>
            </span>
          </Tag>
        );
      })}
    </motion.div>
  );
}

/* ─── 5 · The demo hand-off ───
   Its own band, on the tinted background with a border top and bottom.
   The problem section already ended on the restock board and its three
   cards; this is a separate pitch — here is everything else, and you
   can go and click it — so it needs to read as a separate section
   rather than as more of the same.

   Carries id="features" for the nav: the old Solution section held that
   anchor before its content moved up into problem 03, and this list is
   what a visitor clicking "Features" is actually after. */
function DemoTeaser({ dark }) {
  return (
    <section id="features" className={`py-20 scroll-mt-24 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead dark={dark} className="mb-10" eyebrow="Platform features"
          title="Everything running underneath the recommendation."
          sub="That daily action list is one screen. It works because of everything sitting behind it — and the ones marked Demo you can click straight into." />

        <PlatformList dark={dark} />

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
            Connect Amazon and DragonRestock builds your first restock plan in 10 minutes.
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
      <Cost dark={dark} />
      <HowItWorks dark={dark} />
      <DemoTeaser dark={dark} />

      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
