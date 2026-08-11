import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, MousePointerClick } from 'lucide-react';
import { monoFont, ensureMonoFont } from './theme';
import { SIGNUP_URL } from '../../config';

/* ─── Top nav — mirrors the DragonReply navbar (theme-aware).
   `base` prefixes in-page hash links so the nav also works from other
   routes (e.g. /pricing → /#features).

   Flat: no dropdowns. Demo is the one item that breaks the pattern —
   a bordered pill rather than a plain link, sitting just before
   Pricing, because it's the thing we most want someone to click
   before they decide. */

const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Quick setup w/ AI', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '/demo', highlight: true },
  { label: 'Pricing', href: '/pricing' },
];

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

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (l.highlight ? (
              <a key={l.label} href={resolve(l.href)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[13px] font-semibold transition-all ${demoPill}`}
                style={{ fontFamily: monoFont }}>
                <MousePointerClick className="w-3.5 h-3.5" />{l.label}
              </a>
            ) : (
              <a key={l.label} href={resolve(l.href)}
                className={`text-[13px] font-medium transition-colors ${linkText}`} style={{ fontFamily: monoFont }}>
                {l.label}
              </a>
            )))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button type="button" onClick={onToggle} aria-label="Toggle light and dark theme"
              className={`p-2 rounded-lg transition-colors ${toggleBtn}`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href={SIGNUP_URL}
              className="px-5 py-2.5 bg-[#2F7D4F] text-white text-sm font-semibold uppercase tracking-wide rounded-lg transition-all hover:bg-[#0F3D2E] hover:shadow-lg hover:shadow-[#2F7D4F]/25">
              Start free
            </a>
          </div>

          <div className="md:hidden flex items-center gap-1">
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
              {NAV_LINKS.map(l => (l.highlight ? (
                <a key={l.label} href={resolve(l.href)} onClick={() => setMobileOpen(false)}
                  className={`inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-lg border text-lg font-semibold ${demoPill}`}>
                  <MousePointerClick className="w-5 h-5" />{l.label}
                </a>
              ) : (
                <a key={l.label} href={resolve(l.href)} onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium ${dark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {l.label}
                </a>
              )))}
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
