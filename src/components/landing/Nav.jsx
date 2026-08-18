import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, MousePointerClick, ChevronDown } from 'lucide-react';
import { monoFont, ensureMonoFont } from './theme';
import { SIGNUP_URL } from '../../config';

/* ─── Top nav — mirrors the DragonReply navbar (theme-aware).
   `base` prefixes in-page hash links so the nav also works from other
   routes (e.g. /pricing → /#features).

   Demo is the one item that breaks the pattern — a bordered pill
   rather than a plain link, sitting just before Pricing, because it's
   the thing we most want someone to click before they decide.

   One dropdown, on Features. The row had grown to six items and two of
   them ("Quick setup w/ AI" and "Features") are the same question — what
   is this thing and how do I get it running — so they fold into one
   parent and the row comes back to five short labels. Anything with
   `children` renders as a menu on desktop and an indented group in the
   mobile drawer; a parent is a label, not a link, so it never competes
   with its own children for the click. */

/* "Problems & solutions" rather than "Problem": that section stopped being
   a list of complaints when every problem got the DragonRestock answer
   rendered directly under it, and a visitor who clicks "Problem" and lands
   on a pitch has been mildly lied to.

   "Features" is the parent of the two sections that answer "what is it and
   how do I start" — the platform list at the foot of the page, whose eyebrow
   reads "Platform features" so the label and the landing spot agree, and the
   10-minute setup. */
const NAV_LINKS = [
  { label: 'Problems & solutions', href: '#problem' },
  { label: 'Why it matters', href: '#cost' },
  {
    label: 'Features',
    children: [
      { label: 'Quick setup with AI', href: '#how' },
      { label: 'The platform', href: '#features' },
    ],
  },
  { label: 'Demo', href: '/demo', highlight: true },
  { label: 'Pricing', href: '/pricing' },
];

/* The desktop menu. Hover and keyboard focus both open it — `group-hover`
   plus `group-focus-within`, so tabbing to the parent reveals the items
   rather than skipping past them. The panel's wrapper carries the top
   padding rather than a margin, so the gap between label and menu is still
   inside the hover area and the pointer can cross it without the menu
   closing underneath. */
function Dropdown({ link, resolve, dark, linkText }) {
  const panel = dark
    ? 'bg-[#141618] border-white/10 shadow-black/40'
    : 'bg-white border-[#1A1A1A]/10 shadow-[#1A1A1A]/10';
  const item = dark
    ? 'text-white/60 hover:text-[#98CC65] hover:bg-white/[0.05]'
    : 'text-[#1A1A1A]/60 hover:text-[#2F7D4F] hover:bg-[#1A1A1A]/[0.04]';

  return (
    <div className="relative group">
      {/* a label, not a link: the parent has no section of its own and a
          click that goes nowhere is worse than one that isn't offered */}
      <button type="button" aria-haspopup="true"
        className={`flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap transition-colors ${linkText}`}
        style={{ fontFamily: monoFont }}>
        {link.label}
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 transition-all duration-150
        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
        <div className={`min-w-[210px] rounded-xl border shadow-xl py-1.5 ${panel}`}>
          {link.children.map(c => (
            <a key={c.label} href={resolve(c.href)}
              className={`block px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${item}`}
              style={{ fontFamily: monoFont }}>
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Nav({ dark, onToggle, base = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { ensureMonoFont(); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const resolve = (href) => (href.startsWith('#') ? base + href : href);

  const scrolledBg = dark ? 'bg-[#0F0F0F]/90 backdrop-blur-xl shadow-sm' : 'bg-white/90 backdrop-blur-xl shadow-sm';
  const brandText = dark ? 'text-white' : 'text-[#1A1A1A]';
  const linkText = dark ? 'text-white/50 hover:text-[#98CC65]' : 'text-[#1A1A1A]/55 hover:text-[#2F7D4F]';
  const toggleBtn = dark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5';
  const demoPill = dark
    ? 'border-[#98CC65]/45 text-[#98CC65] hover:bg-[#98CC65]/10 hover:border-[#98CC65]/70'
    : 'border-[#2F7D4F]/35 text-[#2F7D4F] hover:bg-[#2F7D4F]/[0.07] hover:border-[#2F7D4F]/60';

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? scrolledBg : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <motion.img src="/DragonBot-logo.png" alt="DragonRestock" className="h-9 w-auto"
              animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
            <span className={`font-clash font-semibold text-[22px] tracking-[-0.02em] ${brandText}`}>
              Dragon<span className="bg-gradient-to-r from-[#2F7D4F] to-[#98CC65] bg-clip-text text-transparent">Restock</span>
            </span>
          </a>

          {/* lg, not md: this row never fit at 768–1024 — "Quick setup w/ AI"
              wrapped to three lines and the first link disappeared behind the
              wordmark. Folding two items into the Features menu bought back
              enough width for 1024 to work again; anything narrower gets the
              drawer, which is a better nav than a broken row. Labels are
              nowrap so a future long one overflows visibly rather than
              quietly stacking and looking almost fine. */}
          <div className="hidden min-[1100px]:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map(l => (
              l.children ? (
                <Dropdown key={l.label} link={l} resolve={resolve} dark={dark} linkText={linkText} />
              ) : l.highlight ? (
                <a key={l.label} href={resolve(l.href)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[13px] font-semibold whitespace-nowrap transition-all ${demoPill}`}
                  style={{ fontFamily: monoFont }}>
                  <MousePointerClick className="w-3.5 h-3.5" />{l.label}
                </a>
              ) : (
                <a key={l.label} href={resolve(l.href)}
                  className={`text-[13px] font-medium whitespace-nowrap transition-colors ${linkText}`} style={{ fontFamily: monoFont }}>
                  {l.label}
                </a>
              )
            ))}
          </div>

          <div className="hidden min-[1100px]:flex items-center gap-3">
            <button type="button" onClick={onToggle} aria-label="Toggle light and dark theme"
              className={`p-2 rounded-lg transition-colors ${toggleBtn}`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href={SIGNUP_URL}
              className="px-5 py-2.5 bg-[#2F7D4F] text-white text-sm font-semibold uppercase tracking-wide whitespace-nowrap rounded-lg transition-all hover:bg-[#0F3D2E] hover:shadow-lg hover:shadow-[#2F7D4F]/25">
              Start free
            </a>
          </div>

          <div className="min-[1100px]:hidden flex items-center gap-1">
            <button type="button" onClick={onToggle} aria-label="Toggle light and dark theme"
              className={`p-2 ${dark ? 'text-white/60' : 'text-[#1A1A1A]/50'}`}>
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`p-2 ${dark ? 'text-white' : 'text-[#1A1A1A]'}`} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`fixed inset-0 z-40 pt-20 px-6 overflow-y-auto ${dark ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
            <div className="flex flex-col gap-5 pb-10">
              {NAV_LINKS.map(l => (
                /* no menu to open in here — the parent is a heading and its
                   children sit under it, which is all a drawer needs */
                l.children ? (
                  <div key={l.label}>
                    <span className={`block text-lg font-medium ${dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}`}>
                      {l.label}
                    </span>
                    <div className={`mt-3 ml-1 pl-4 flex flex-col gap-4 border-l ${dark ? 'border-white/15' : 'border-[#1A1A1A]/15'}`}>
                      {l.children.map(c => (
                        <a key={c.label} href={resolve(c.href)} onClick={() => setMobileOpen(false)}
                          className={`text-lg font-medium ${dark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                          {c.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : l.highlight ? (
                  <a key={l.label} href={resolve(l.href)} onClick={() => setMobileOpen(false)}
                    className={`inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-lg border text-lg font-semibold ${demoPill}`}>
                    <MousePointerClick className="w-5 h-5" />{l.label}
                  </a>
                ) : (
                  <a key={l.label} href={resolve(l.href)} onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium ${dark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {l.label}
                  </a>
                )
              ))}
              <a href={SIGNUP_URL} onClick={() => setMobileOpen(false)}
                className="mt-2 px-6 py-3 bg-[#2F7D4F] text-white text-center font-semibold uppercase tracking-wide rounded-lg transition-all hover:bg-[#0F3D2E]">
                Start free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
