/* Post-build: turn the single-page-app build into per-route STATIC HTML.
 *
 * Two jobs, and the second is why this file matters:
 *
 *  1. Give every SPA route a real index.html so GitHub Pages serves it with
 *     HTTP 200 instead of the 404.html fallback (renders fine but returns a
 *     404 status — bad for Google Ads destination checks and SEO).
 *
 *  2. PRERENDER each route's <title>, meta description, canonical, OG tags and
 *     a real content block into #root.
 *
 *     ⚠️ WHY: on DragonRefunds every route was a byte-identical copy of the
 *     same 3.9 KB shell holding ~270 chars of HTML comments and no content.
 *     Google Ads scored landing page experience BELOW_AVERAGE on 16 of 18
 *     keywords, pinning Quality Score at 1–3/10 — Ad Rank = bid × QS, so it
 *     inflates CPC on every click AND suppresses impressions. Server speed was
 *     never the problem (TTFB ~0.4s); the pages were empty. The same defect
 *     makes Google index every route as a duplicate, killing organic too.
 *
 *     Fixing per-route <title>s was necessary and not sufficient: six days
 *     later the homepage was still 46 crawler-visible words and QS was 2/10.
 *     Hence the word-count guard at the bottom of this file.
 *
 *     ⚠️ Speed tests will NOT catch this. PageSpeed/Lighthouse run JavaScript,
 *     so they see a perfectly good page. The only way to see it is to look at
 *     what the server actually returns: curl the URL.
 *
 *     The injected block is built from the SAME data files the React app
 *     renders from (src/data/restockCopy.js, src/data/plans.js), so this is
 *     prerendering, not cloaking. React's createRoot().render() REPLACES
 *     #root's children on mount, so real users get the app and crawlers /
 *     no-JS clients get the content. If this repo ever moves to
 *     hydrateRoot(), the markup below must match React's output exactly or
 *     hydration breaks.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  HERO_COPY, PAINS_COPY, SETUP_STEPS_COPY, SETUP_HELP_COPY, ANSWERS_COPY,
  PLATFORM_COPY, PILLARS_COPY, DIFFERENTIATORS_COPY, PRICING_FAQS,
} from '../src/data/restockCopy.js';
import { PLANS, INCLUDED, TRIAL } from '../src/data/plans.js';
import { SIGNUP_URL } from '../src/config.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const srcFile = join(dist, 'index.html');

if (!existsSync(srcFile)) {
  console.error('postbuild: dist/index.html not found — run vite build first');
  process.exit(1);
}
const SHELL = readFileSync(srcFile, 'utf8');
const SITE = 'https://dragonrestock.com';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const flat = (s = '') => String(s).replace(/\s+/g, ' ').trim();

/* ── Route → { title, description, eyebrow, h1, intro, bullets[], sections[] } ── */

/* The landing page, in the order the page itself argues it. Emit everything
 * the data holds — a page that clears 120 words by a hair is one edit away
 * from failing, and thin pages are what this whole file exists to prevent. */
const LANDING_SECTIONS = [
  { h: 'Why restocking is still a guess', items: PAINS_COPY.map(p => `${p.title}. ${p.body}`) },
  { h: 'Set up with Claude in 10 minutes', items: SETUP_STEPS_COPY.map(s => `${s.title}. ${s.body}`) },
  { h: 'If your setup isn’t the standard one', items: SETUP_HELP_COPY.map(s => `${s.title}. ${s.body}`) },
  { h: 'It tells you what to do, not what to look at', items: ANSWERS_COPY.map(a => `${a.title}. ${a.body}`) },
  { h: 'Everything running underneath the recommendation', items: PLATFORM_COPY.map(p => `${p.title}. ${p.desc}`) },
];

/* /demo and its alias /features — every feature, live on one page. */
const DEMO_SECTIONS = [
  ...PILLARS_COPY.map(p => ({ h: p.title, items: [p.body, ...p.bullets] })),
  ...Object.values(DIFFERENTIATORS_COPY).map(d => ({ h: d.title, items: [d.body, ...d.bullets] })),
];

const PRICING_SECTIONS = [
  { h: 'Plans', items: PLANS.map(p =>
      `${p.name} — $${p.monthly}/mo month-to-month or $${p.annual.toLocaleString()}/yr. ${p.orders} orders per month${p.overage ? `, then ${p.overage} per order` : ', no overage fees'}. ${p.tagline}.`) },
  { h: 'On every plan', items: INCLUDED.map(i => `${i.title}. ${i.desc}`) },
  { h: 'Getting started', items: TRIAL },
  { h: 'Frequently asked questions', items: PRICING_FAQS.map(f => `${f.q} ${f.a}`) },
];

const meta = {
  '/': {
    title: 'DragonRestock — Never run out of stock again',
    description: 'DragonRestock tracks your Amazon sales velocity and lead times, and tells you exactly when to reorder every SKU — so you never stock out.',
    eyebrow: 'AI-native inventory & restock planning',
    h1: HERO_COPY.h1,
    intro: HERO_COPY.sub,
    bullets: HERO_COPY.badges,
    sections: LANDING_SECTIONS,
  },
  '/demo': {
    title: 'Live demo — every DragonRestock screen, clickable | DragonRestock',
    description: 'Play with the real DragonRestock screens on a sample seller’s catalogue: restock recommendations, lost sales, forecasting, purchase orders, liquidation, cashflow and the low-inventory fee. No signup.',
    eyebrow: 'Live demo',
    h1: 'The whole thing, go and play with it.',
    intro: 'No signup, no video. These are DragonRestock’s actual screens, wired up with a sample seller’s catalogue so you can click through them — expand a row, switch a view, upload the invoice, watch it price a discount.',
    sections: DEMO_SECTIONS,
  },
  '/pricing': {
    title: 'Pricing — every feature on every plan | DragonRestock',
    description: 'Priced on orders per month, not SKUs or seats. Every feature — forecasting, reconciliation, liquidation, cashflow, Knowledge Center and MCP access — is on every plan, including Starter. 30-day free trial, no card.',
    eyebrow: 'Pricing',
    h1: 'Every feature on every plan.',
    intro: 'Priced on orders per month rather than SKUs, because the work the system does scales with order volume and not catalogue size. The tier only sets your order allowance.',
    sections: PRICING_SECTIONS,
  },
};
/* /features is an alias of /demo in App.jsx — identical copy, so it points its
 * canonical at /demo rather than at itself. Two self-canonicalling URLs with
 * the same content is exactly the duplicate-content signal this file exists to
 * avoid; the alias still serves 200 for anyone (or any ad) linking to it. */
meta['/features'] = { ...meta['/demo'], canonical: `${SITE}/demo/` };

/* ── Build one route's HTML from the shell ───────────────────────────── */
function buildHtml(route, m) {
  const url = m.canonical || SITE + (route === '/' ? '/' : route + '/');
  const title = m.title || meta['/'].title;
  const desc = m.description || meta['/'].description;

  const head = [
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');

  /* Mirrors the copy React renders. Replaced on mount.
   * Keep this SUBSTANTIVE — see the word-count guard below. */
  const body = [
    m.eyebrow ? `<p>${esc(m.eyebrow)}</p>` : '',
    `<h1>${esc(m.h1 || title)}</h1>`,
    m.intro ? `<p>${esc(flat(m.intro))}</p>` : '',
    Array.isArray(m.bullets) && m.bullets.length
      ? `<ul>${m.bullets.map(b => `<li>${esc(flat(b))}</li>`).join('')}</ul>` : '',
    ...(m.sections || []).map(s =>
      `<h2>${esc(s.h)}</h2>\n        <ul>${s.items.map(i => `<li>${esc(flat(i))}</li>`).join('')}</ul>`),
    `<p><a href="${SIGNUP_URL}">Start free — no card required</a></p>`,
  ].filter(Boolean).join('\n        ');

  let html = SHELL;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>\n    ${head}`);
  /* The shell already carries a description meta; drop it so the per-route one
   * added above is the only one on the page. */
  html = html.replace(/\n?\s*<meta name="description"[^>]*\/>(?=[\s\S]*?<link rel="canonical")/, '');
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender="1" style="max-width:44rem;margin:0 auto;padding:4rem 1.5rem;font-family:system-ui,sans-serif">\n        ${body}\n      </div></div>`
  );
  return html;
}

/* ── Write every route ───────────────────────────────────────────────── */
const routes = Object.keys(meta);
let n = 0;
for (const route of routes) {
  const dir = route === '/' ? dist : join(dist, ...route.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildHtml(route, meta[route]));
  n++;
}

/* ── Guard: a thin page cannot earn a decent Ads landing-page score ──────
 * Fail the build rather than ship thin pages. Raise MIN_WORDS, never lower it
 * to make a build pass. Every route here is an ad/SEO destination, so nothing
 * is exempt; add an EXEMPT() check only if support/legal routes get added. */
const MIN_WORDS = 120;
const thin = [];
for (const route of routes) {
  const dir = route === '/' ? dist : join(dist, ...route.split('/').filter(Boolean));
  const text = readFileSync(join(dir, 'index.html'), 'utf8')
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < MIN_WORDS) thin.push(`${route} (${words}w)`);
}
if (thin.length) {
  console.error(`postbuild: ${thin.length} route(s) under ${MIN_WORDS} crawler-visible words:\n  ${thin.join('\n  ')}`);
  console.error('Add real copy to the JSX-free data module and emit it here — see src/data/restockCopy.js');
  process.exit(1);
}
console.log(`postbuild: prerendered ${n} routes (title + description + canonical + OG + content), all >= ${MIN_WORDS} words`);
