// Lightweight funnel tracking for the landing page.
//
// Fires GA4 events (via the gtag installed in index.html), mirrors them as
// Clarity custom events so session recordings are tagged too, and mirrors
// them to the Meta Pixel. Safe no-op if any of the three is blocked / not
// yet loaded.
//
// Funnel steps tracked here: `cta_click` — any click on a link to
// app.dragonrestock.com (the sign-up destination) — and `pricing_view` on
// the high-intent pages. `sign_up` and the Amazon-connect events fire in
// the app frontend, not here.
//
// 🚫 Event names are NEVER prefixed per product (no `dragonrestock_cta_click`).
// Each product has its own GA4 property and its own Meta dataset, so nothing
// collides; prefixing would break cross-product comparison and would turn
// Meta's standard events into custom ones, forfeiting their optimization
// priors. The only real collision is in the shared Google Ads account, and
// that's fixed by renaming the imported conversion ACTION, never the event.

// Meta standard-event names for our LP funnel steps. Standard events carry
// cross-advertiser optimization priors that custom ones don't, so map onto
// them wherever the semantics are honest; anything unmapped falls through
// to trackCustom rather than being dropped.
const META_EVENTS = {
  cta_click: 'InitiateCheckout',
  pricing_view: 'ViewContent',
};

export function track(event, params = {}) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', event, params);
    if (typeof window.clarity === 'function') window.clarity('event', event);
    if (typeof window.fbq === 'function') {
      const standard = META_EVENTS[event];
      if (standard) window.fbq('track', standard, params);
      else window.fbq('trackCustom', event, params);
    }
  } catch (_) {
    /* analytics must never break the page */
  }
}

// ─── Route-change pageviews ─────────────────────────────────────────
//
// This is a React Router SPA, but BOTH analytics snippets in index.html
// only ever fire one pageview: gtag('config') auto-sends `page_view` at
// load, and fbq fires PageView at load. Neither knows about client-side
// navigation — so without this, every route past the visitor's entry
// page goes uncounted in GA4 (skewing landing-page analysis for Google
// Ads too, not just Meta) and never reaches the Meta Pixel (shrinking
// the retargeting pool).

/** High-intent pages → Meta `ViewContent`. Pricing, the demo, /vs/ pages. */
function isHighIntentPath(pathname) {
  // GitHub Pages serves prerendered routes at /pricing/ (trailing slash), so
  // an exact match on '/pricing' silently misses every direct ad/organic load
  // of the page. Normalize before comparing.
  const p = pathname.replace(/\/+$/, '') || '/';
  return p === '/pricing' || p === '/demo' || p === '/features' || p.startsWith('/vs/');
}

let isFirstRoute = true;

/**
 * Report a route. Call on mount and on every subsequent location change.
 *
 * The first call is the initial hard load, which index.html has already
 * counted in both GA4 and Meta — sending another pageview here would
 * double-count it, so we skip it. `pricing_view` is still evaluated on
 * that first call, because landing directly on /pricing or /demo from an
 * ad is the common case and it hasn't been reported by anything else.
 */
export function trackRouteChange(pathname) {
  try {
    if (isFirstRoute) {
      isFirstRoute = false;
    } else {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
      if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
    }

    if (isHighIntentPath(pathname)) {
      track('pricing_view', { page_path: pathname });
    }
  } catch (_) {
    /* analytics must never break the page */
  }
}

// Install a single delegated click listener that fires `cta_click` whenever a
// user clicks any link pointing to app.dragonrestock.com. Capture phase so it
// runs before navigation; gtag uses sendBeacon, so the event survives unload.
export function initCtaTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      const a = t && t.closest ? t.closest('a[href]') : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.includes('app.dragonrestock.com')) return;
      track('cta_click', {
        destination: href.split('?')[0],
        link_text: (a.textContent || '').trim().slice(0, 80),
        page_path: window.location.pathname,
      });
    },
    true,
  );
}
