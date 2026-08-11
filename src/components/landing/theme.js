/* ──────────────────────────────────────────────────────────────
   Shared theme tokens for the DragonRestock LP.
   Mirrors the DragonReply / LandingV4 system so the two sites read
   as one product family. Every section takes a `dark` boolean and
   picks its classes from here rather than re-deriving them.
   ────────────────────────────────────────────────────────────── */

export const monoFont = "'Roboto Mono', monospace";

/* Brand palette (hex, for inline styles + Tailwind arbitrary values) */
export const C = {
  green: '#2F7D4F',
  greenLight: '#98CC65',
  deep: '#0F3D2E',
  amber: '#F59E0B',
  amberBright: '#FF9900',
  amberSoft: '#F5C451',
  red: '#DC2626',
  indigo: '#5B5BD6',
  ink: '#1A1A1A',
  surfaceDark: '#0F0F0F',
  surfaceDark2: '#141618',
  surfaceDark3: '#1A1D21',
};

/* Framer Motion — the house easing + scroll-reveal preset */
export const ease = [0.21, 0.5, 0.26, 1];
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

/* Theme-aware class helpers */
export const t = {
  page: (dark) => (dark ? 'bg-[#0F0F0F] text-white' : 'bg-white text-[#1A1A1A]'),
  heading: (dark) => (dark ? 'text-white' : 'text-[#1A1A1A]'),
  muted: (dark) => (dark ? 'text-white/55' : 'text-[#1A1A1A]/55'),
  mutedStrong: (dark) => (dark ? 'text-white/75' : 'text-[#1A1A1A]/70'),
  card: (dark) => (dark ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-[#1A1A1A]/8'),
  green: (dark) => (dark ? 'text-[#98CC65]' : 'text-[#2F7D4F]'),
};

/* Roboto Mono is used only for the small nav / label type. Injected on
   demand so the main font import stays to Clash Display + Satoshi. */
export function ensureMonoFont() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-roboto-mono]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap';
  link.dataset.robotoMono = '';
  document.head.appendChild(link);
}
