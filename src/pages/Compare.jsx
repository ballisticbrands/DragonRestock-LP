import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Minus, X, BadgeCheck, Scale } from 'lucide-react';
import Nav from '../components/landing/Nav';
import SiteFooter from '../components/landing/SiteFooter';
import Eyebrow from '../components/landing/Eyebrow';
import SectionHead from '../components/landing/SectionHead';
import { ease, fadeUp, t } from '../components/landing/theme';
import { SIGNUP_URL } from '../config';
import { getComparison, LIVE_COMPARISONS } from '../data/compareCopy';

/* ──────────────────────────────────────────────────────────────
   /compare/<competitor> — one template, one entry per competitor in
   src/data/compareCopy.js. Adding a rival is a data edit plus a line in
   the prerender map; there is no per-competitor JSX and there shouldn't be,
   or five pages drift into five layouts.

   The page argues in the order a switcher actually evaluates: concede what
   the incumbent is good at, name the few differences that decide it, show
   the full table for anyone who wants to check the claim, then say plainly
   who should NOT switch. The concession is not a rhetorical move — a
   visitor already running the competitor spots an unfair row instantly, and
   one bad row costs you the other thirteen.

   Nav gets base="/" so its in-page hash links resolve to the landing page.
   ────────────────────────────────────────────────────────────── */

/* Cell tone → icon. 'part' is the honest middle: has it, with a caveat. */
const TONE = {
  yes: { Icon: Check, light: 'text-[#2F7D4F]', dark: 'text-[#98CC65]' },
  part: { Icon: Minus, light: 'text-[#B45309]', dark: 'text-[#F5C451]' },
  no: { Icon: X, light: 'text-[#1A1A1A]/30', dark: 'text-white/25' },
};

function Cell({ dark, cell }) {
  const { Icon, light, dark: darkTint } = TONE[cell.tone] ?? TONE.part;
  return (
    <div className="flex gap-2.5">
      <Icon className={`w-[17px] h-[17px] shrink-0 mt-[3px] ${dark ? darkTint : light}`} />
      <span className={`text-[14px] leading-[1.55] ${cell.tone === 'no' ? t.muted(dark) : t.mutedStrong(dark)}`}>
        {cell.text}
      </span>
    </div>
  );
}

export default function Compare() {
  const { slug } = useParams();
  const [dark, setDark] = useState(false);
  const c = getComparison(slug);

  /* An unbuilt or misspelled competitor goes home rather than rendering an
     empty comparison. Nothing links here that isn't live, so this is the
     hand-typed-URL case. */
  if (!c) return <Navigate to="/" replace />;

  /* Every other live comparison, then the two pages that answer "show me".
     Capped at six so the grid stays two clean rows of three however many
     competitors get added — the sibling comparisons are the ones that earn
     the slot, so the product links are what drop off the end. */
  const links = [
    ...LIVE_COMPARISONS.filter(o => o.slug !== c.slug).map(o => ({
      href: `/compare/${o.slug}`,
      title: `DragonRestock vs ${o.label ?? o.name}`,
      body: 'Where the two differ on price, depth and what they hand you.',
    })),
    { href: '/demo', title: 'The live demo', body: 'Every screen, clickable, on a sample seller’s catalogue. No signup.' },
    { href: '/pricing', title: 'Pricing', body: 'Every feature on every plan, priced on orders rather than SKUs or seats.' },
  ].slice(0, 6);
  const headCell = `text-[12px] font-semibold uppercase tracking-wide ${t.muted(dark)}`;

  return (
    <div className={`min-h-screen antialiased ${t.page(dark)}`}>
      <Nav dark={dark} onToggle={() => setDark(v => !v)} base="/" />

      {/* ─── Hero ─── */}
      <section className="relative pt-36 pb-14 overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-[520px] h-[520px] bg-[#98CC65]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[20%] w-[420px] h-[420px] bg-[#FF9900]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Eyebrow dark={dark} accent="green">{c.eyebrow}</Eyebrow>
            <h1 className={`font-clash font-semibold text-[38px] sm:text-[52px] lg:text-[58px] leading-[1.05] tracking-[-0.035em] mb-6 ${t.heading(dark)}`}>
              {c.h1}{' '}
              <span className="bg-gradient-to-r from-[#2F7D4F] to-[#98CC65] bg-clip-text text-transparent">{c.h1Accent}</span>
            </h1>
            <p className={`text-[17px] sm:text-[18px] max-w-2xl mx-auto leading-[1.65] ${dark ? 'text-white/60' : 'text-[#1A1A1A]/55'}`}>
              {c.sub}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={SIGNUP_URL}
                className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-lg bg-[#2F7D4F] text-white text-[15px] font-semibold tracking-wide flex items-center gap-2 transition-all hover:bg-[#0F3D2E] hover:shadow-lg hover:shadow-[#2F7D4F]/25">
                Start free trial <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/pricing"
                className={`w-full sm:w-auto justify-center px-7 py-3.5 rounded-lg text-[15px] font-semibold tracking-wide flex items-center gap-2 border transition-colors ${
                  dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#1A1A1A]/[0.04]'
                }`}>
                See pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── The concession, before any argument ─── */}
      <section className="px-6 pb-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease }}
          className={`max-w-3xl mx-auto rounded-2xl p-7 border ${
            dark ? 'bg-[#98CC65]/[0.07] border-[#98CC65]/20' : 'bg-[#2F7D4F]/[0.06] border-[#2F7D4F]/20'
          }`}>
          <div className={`flex items-center gap-2 mb-3 text-[12px] font-semibold uppercase tracking-wide ${t.green(dark)}`}>
            <BadgeCheck className="w-4 h-4" />{c.credit.title}
          </div>
          <p className={`text-[15.5px] leading-[1.65] ${dark ? 'text-white/80' : 'text-[#1A1A1A]/75'}`}>{c.credit.body}</p>
        </motion.div>
      </section>

      {/* ─── The few differences that decide it ─── */}
      <section className={`py-20 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead dark={dark} className="mb-12" eyebrow={c.gaps.eyebrow} title={c.gaps.title} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.gaps.cards.map((card, i) => (
              <motion.div key={card.key} {...fadeUp} transition={{ duration: 0.6, delay: 0.05 * i, ease }}
                className={`${t.card(dark)} rounded-2xl p-7`}>
                <h3 className={`font-clash font-semibold text-[21px] leading-tight tracking-[-0.015em] mb-2.5 ${t.heading(dark)}`}>
                  {card.title}
                </h3>
                <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The full table ───
          Two renderings of one data structure: a real <table> from md up,
          stacked cards below it. A 3-column table inside a horizontal
          scroller is unreadable on a phone, and this page gets read on
          phones. */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease }}
            className={`font-clash font-semibold text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-center mb-12 ${t.heading(dark)}`}>
            {c.table.title}
          </motion.h2>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.08, ease }}
            className={`hidden md:block rounded-2xl overflow-hidden ${t.card(dark)}`}>
            <table className="w-full border-collapse">
              <caption className="sr-only">{c.table.caption}</caption>
              <thead>
                <tr className={dark ? 'bg-white/[0.04]' : 'bg-[#1A1A1A]/[0.03]'}>
                  <th scope="col" className={`text-left px-6 py-4 w-[24%] ${headCell}`}>Capability</th>
                  <th scope="col" className={`text-left px-6 py-4 w-[38%] text-[12px] font-semibold uppercase tracking-wide ${t.green(dark)}`}>
                    DragonRestock
                  </th>
                  <th scope="col" className={`text-left px-6 py-4 w-[38%] ${headCell}`}>{c.name}</th>
                </tr>
              </thead>
              <tbody>
                {c.table.rows.map(row => (
                  <tr key={row.label} className={`border-t ${dark ? 'border-white/8' : 'border-[#1A1A1A]/8'}`}>
                    <th scope="row" className={`text-left align-top px-6 py-5 text-[14px] font-semibold ${t.heading(dark)}`}>
                      {row.label}
                    </th>
                    <td className={`align-top px-6 py-5 ${dark ? 'bg-[#98CC65]/[0.04]' : 'bg-[#2F7D4F]/[0.03]'}`}>
                      <Cell dark={dark} cell={row.us} />
                    </td>
                    <td className="align-top px-6 py-5"><Cell dark={dark} cell={row.them} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="md:hidden space-y-3">
            {c.table.rows.map(row => (
              <div key={row.label} className={`${t.card(dark)} rounded-2xl p-5`}>
                <h3 className={`text-[14px] font-semibold mb-3.5 ${t.heading(dark)}`}>{row.label}</h3>
                <div className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 ${t.green(dark)}`}>DragonRestock</div>
                <Cell dark={dark} cell={row.us} />
                <div className={`text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1.5 ${t.muted(dark)}`}>{c.name}</div>
                <Cell dark={dark} cell={row.them} />
              </div>
            ))}
          </div>

          {/* ─── The honest trade + who switches ─── */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <motion.div {...fadeUp} transition={{ duration: 0.6, ease }} className={`${t.card(dark)} rounded-2xl p-7`}>
              <div className={`flex items-center gap-2 mb-3 text-[12px] font-semibold uppercase tracking-wide ${dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}`}>
                <Scale className="w-4 h-4" />{c.fairness.title}
              </div>
              <p className={`text-[15px] leading-[1.65] ${t.muted(dark)}`}>{c.fairness.body}</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.05, ease }} className={`${t.card(dark)} rounded-2xl p-7`}>
              <h3 className={`font-clash font-semibold text-[21px] tracking-[-0.015em] mb-4 ${t.heading(dark)}`}>{c.switchers.title}</h3>
              <ul className="space-y-3">
                {c.switchers.items.map(item => (
                  <li key={item} className="flex gap-2.5">
                    <Check className={`w-[17px] h-[17px] shrink-0 mt-[3px] ${t.green(dark)}`} />
                    <span className={`text-[14.5px] leading-[1.55] ${t.muted(dark)}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sourcing the competitor's numbers, in the small type it deserves
              but on the page rather than nowhere. */}
          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}
            className={`text-[12.5px] leading-[1.6] mt-6 ${dark ? 'text-white/35' : 'text-[#1A1A1A]/40'}`}>
            <span className="font-semibold">Sources: </span>{c.sources}
          </motion.p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={`py-24 border-y ${dark ? 'bg-[#141618] border-white/5' : 'bg-[#fafafa] border-[#1A1A1A]/5'}`}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease }}
            className={`font-clash font-semibold text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-center mb-12 ${t.heading(dark)}`}>
            Questions switchers ask.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }} className="space-y-4">
            {c.faqs.map(({ q, a }) => (
              <div key={q} className={`${t.card(dark)} rounded-2xl p-6`}>
                <h3 className={`font-semibold text-[16px] mb-2 ${t.heading(dark)}`}>{q}</h3>
                <p className={`text-[15px] leading-[1.6] ${t.muted(dark)}`}>{a}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Keep reading ───
          Live comparisons first, then the two pages that answer "show me".
          A comparison page with no way out is a dead end for the visitor
          and an orphan for the crawler. */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease }}
            className={`font-clash font-semibold text-2xl sm:text-3xl tracking-[-0.02em] text-center mb-10 ${t.heading(dark)}`}>
            Keep reading
          </motion.h2>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.06, ease }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map(l => (
              <a key={l.href} href={l.href} className={`${t.card(dark)} rounded-2xl p-6 block transition-transform hover:-translate-y-0.5`}>
                <h3 className={`font-semibold text-[15.5px] mb-1.5 ${t.heading(dark)}`}>{l.title}</h3>
                <p className={`text-[13.5px] leading-snug ${t.muted(dark)}`}>{l.body}</p>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="px-6 pb-20">
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden px-8 py-16 text-center bg-gradient-to-br from-[#2F7D4F] to-[#0F3D2E]">
          <div className="absolute -top-16 -left-10 w-80 h-80 bg-[#98CC65]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#FF9900]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-clash font-semibold text-white text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-[-0.02em] max-w-2xl mx-auto">
              {c.cta.title}
            </h2>
            <p className="text-white/70 text-[16px] leading-[1.6] max-w-xl mx-auto mt-5">{c.cta.sub}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={SIGNUP_URL}
                className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white text-[#0F3D2E] text-base font-semibold tracking-wide flex items-center gap-2.5 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all">
                Start free trial <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/demo"
                className="w-full sm:w-auto justify-center px-8 py-4 rounded-lg bg-white/10 text-white text-base font-semibold tracking-wide flex items-center gap-2 border border-white/25 hover:bg-white/15 transition-colors">
                Open the live demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
