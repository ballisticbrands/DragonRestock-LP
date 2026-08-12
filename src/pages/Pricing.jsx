import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Building2 } from 'lucide-react';
import Nav from '../components/landing/Nav';
import SiteFooter from '../components/landing/SiteFooter';
import Eyebrow from '../components/landing/Eyebrow';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL, CONTACT_EMAIL } from '../config';
import { PLANS, INCLUDED, TRIAL, ANNUAL_DISCOUNT } from '../data/plans';
import { PRICING_FAQS } from '../data/restockCopy';

/* ──────────────────────────────────────────────────────────────
   /pricing — four tiers priced on orders per month, every feature on
   every plan. Annual billing is the default because it's the better
   deal and the one most sellers take; the toggle shows the honest
   month-to-month rate beside it.

   Nav gets base="/" so its in-page hash links resolve back to the
   landing page (#how → /#how).
   ────────────────────────────────────────────────────────────── */

const FAQS = PRICING_FAQS;

function PlanCard({ dark, plan, annual }) {
  const perMonth = annual ? Math.round(plan.annual / 12) : plan.monthly;
  const shell = plan.highlight
    ? 'bg-gradient-to-br from-[#2F7D4F] to-[#0F3D2E] border border-[#2F7D4F] text-white shadow-xl shadow-[#2F7D4F]/20'
    : t.card(dark);
  const muted = plan.highlight ? 'text-white/70' : t.muted(dark);
  const strong = plan.highlight ? 'text-white' : t.heading(dark);

  return (
    <div className={`rounded-2xl p-6 flex flex-col ${shell} ${plan.highlight ? 'lg:-mt-3 lg:pb-8' : ''}`}>
      <div className="flex items-center justify-between mb-1 min-h-[24px]">
        <span className={`text-[13px] font-semibold uppercase tracking-wide ${muted}`}>{plan.name}</span>
        {plan.highlight && (
          <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wide">Most popular</span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={`font-clash font-semibold text-[40px] leading-none tracking-[-0.03em] ${strong}`}>${perMonth}</span>
        <span className={`text-[14px] ${muted}`}>/mo</span>
      </div>
      <p className={`text-[12px] mt-1.5 ${muted}`}>
        {annual ? `Billed annually · $${plan.annual.toLocaleString()}/yr` : 'Billed monthly'}
      </p>
      <p className={`text-[13px] leading-snug mt-3 mb-5 ${muted}`}>{plan.tagline}</p>

      {/* the only thing that differs between tiers */}
      <div className={`rounded-xl px-3.5 py-3 mb-5 ${plan.highlight ? 'bg-white/10' : dark ? 'bg-white/[0.05]' : 'bg-[#1A1A1A]/[0.035]'}`}>
        <div className={`font-clash font-semibold text-[20px] leading-none tracking-[-0.02em] ${strong}`}>{plan.orders}</div>
        <div className={`text-[11px] mt-1 ${muted}`}>orders / month</div>
        <div className={`text-[10.5px] mt-1.5 ${plan.highlight ? 'text-white/55' : dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
          {plan.overage ? `then ${plan.overage} per order` : 'no overage fees'}
        </div>
      </div>

      <a href={SIGNUP_URL}
        className={`w-full justify-center px-5 py-3 rounded-lg text-[14px] font-semibold tracking-wide flex items-center gap-2 transition-all mt-auto ${
          plan.highlight
            ? 'bg-white text-[#0F3D2E] hover:shadow-lg hover:shadow-black/20'
            : 'bg-[#2F7D4F] text-white hover:bg-[#0F3D2E] hover:shadow-lg hover:shadow-[#2F7D4F]/25'
        }`}>
        {plan.cta} <ArrowRight className="w-4 h-4" />
      </a>

      <p className={`text-[11px] text-center mt-3 ${muted}`}>All features included</p>
    </div>
  );
}

export default function Pricing() {
  const [dark, setDark] = useState(false);
  const [annual, setAnnual] = useState(true);

  const pill = (on) => `px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
    on ? 'bg-[#2F7D4F] text-white shadow-sm' : dark ? 'text-white/55 hover:text-white/80' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]/75'
  }`;

  return (
    <div className={`min-h-screen antialiased ${t.page(dark)}`}>
      <Nav dark={dark} onToggle={() => setDark(v => !v)} base="/" />

      {/* Hero */}
      <section className="relative pt-36 pb-12 overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-[520px] h-[520px] bg-[#98CC65]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[20%] w-[420px] h-[420px] bg-[#FF9900]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Eyebrow dark={dark} accent="green">Pricing</Eyebrow>
            <h1 className={`font-clash font-semibold text-[40px] sm:text-[54px] lg:text-[62px] leading-[1.05] tracking-[-0.035em] mb-6 ${t.heading(dark)}`}>
              Every feature on{' '}
              <span className="bg-gradient-to-r from-[#2F7D4F] to-[#98CC65] bg-clip-text text-transparent">every plan.</span>
            </h1>
            <p className={`text-[17px] sm:text-[19px] max-w-2xl mx-auto leading-[1.6] ${dark ? 'text-white/60' : 'text-[#1A1A1A]/55'}`}>
              You pay for order volume, not for features. SKUs, users, suppliers and marketplaces are unlimited whichever tier you’re on.
            </p>

            {/* billing toggle */}
            <div className="mt-9 flex flex-col items-center gap-3">
              <div className={`inline-flex items-center gap-1 rounded-xl p-1 ${dark ? 'bg-white/[0.06] border border-white/10' : 'bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8'}`}>
                <button type="button" onClick={() => setAnnual(true)} aria-pressed={annual} className={pill(annual)}>
                  Annual
                </button>
                <button type="button" onClick={() => setAnnual(false)} aria-pressed={!annual} className={pill(!annual)}>
                  Monthly
                </button>
              </div>
              <span className={`text-[12px] font-semibold ${annual ? t.green(dark) : (dark ? 'text-white/35' : 'text-[#1A1A1A]/35')}`}>
                Annual billing saves {ANNUAL_DISCOUNT}%
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {PLANS.map(p => <PlanCard key={p.name} dark={dark} plan={p} annual={annual} />)}
          </motion.div>

          <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[13px] font-medium ${dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}`}>
            {TRIAL.map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className={`w-4 h-4 ${t.green(dark)}`} />{item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Everything included */}
      <section className={`py-20 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease }}
            className={`font-clash font-semibold text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-center mb-3 ${t.heading(dark)}`}>
            Included on every plan.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.05, ease }}
            className={`text-[16px] text-center max-w-2xl mx-auto mb-12 leading-[1.6] ${t.muted(dark)}`}>
            Starter gets the same product Enterprise does. Nothing is held back for a higher tier.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCLUDED.map(({ title, desc }) => (
              <div key={title} className={`${t.card(dark)} rounded-2xl p-6`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 ${dark ? 'bg-[#98CC65]/12 text-[#98CC65]' : 'bg-[#2F7D4F]/10 text-[#2F7D4F]'}`}>
                  <Check className="w-[18px] h-[18px]" />
                </div>
                <h3 className={`font-semibold text-[15px] mb-1.5 ${t.heading(dark)}`}>{title}</h3>
                <p className={`text-[13.5px] leading-snug ${t.muted(dark)}`}>{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* agencies & aggregators */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease }}
            className={`${t.card(dark)} rounded-2xl p-7 mt-4 flex flex-col md:flex-row md:items-center gap-6`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dark ? 'bg-[#FF9900]/12 text-[#F5C451]' : 'bg-[#FF9900]/10 text-[#B45309]'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`font-clash font-semibold text-[20px] tracking-[-0.01em] mb-1.5 ${t.heading(dark)}`}>Agencies &amp; aggregators</h3>
              <p className={`text-[14px] leading-snug ${t.muted(dark)}`}>
                Unlimited organizations under one login, white-glove onboarding for each brand you bring across, and priority support. Priced on total volume.
              </p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`}
              className={`shrink-0 justify-center px-6 py-3 rounded-lg text-[14px] font-semibold flex items-center gap-2 transition-colors ${
                dark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-[#2F7D4F]/8 text-[#2F7D4F] hover:bg-[#2F7D4F]/14'
              }`}>
              Talk to us <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease }}
            className={`font-clash font-semibold text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-center mb-12 ${t.heading(dark)}`}>
            Questions we get asked.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }} className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className={`${t.card(dark)} rounded-2xl p-6`}>
                <h3 className={`font-semibold text-[16px] mb-2 ${t.heading(dark)}`}>{q}</h3>
                <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{a}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-20">
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden px-8 py-16 text-center bg-gradient-to-br from-[#2F7D4F] to-[#0F3D2E]">
          <div className="absolute -top-16 -left-10 w-80 h-80 bg-[#98CC65]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#FF9900]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-clash font-semibold text-white text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-[-0.02em] max-w-2xl mx-auto">
              See your real restock plan before you pay for anything.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={SIGNUP_URL}
                className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white text-[#0F3D2E] text-base font-semibold tracking-wide flex items-center gap-2.5 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all">
                Start free trial <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/"
                className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white/10 text-white text-base font-semibold tracking-wide flex items-center gap-2 border border-white/25 hover:bg-white/15 transition-colors">
                Back to product
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
