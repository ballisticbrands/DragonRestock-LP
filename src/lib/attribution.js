// Attribution preservation across the whole dragonrestock.com surface.
//
// Two responsibilities, both tied to the same goal: no matter where the
// visitor first lands with a UTM (or a click id auto-added by Google /
// Meta / Microsoft Ads), those parameters should still be present on
// the sign-up URL when they eventually click through to
// app.dragonrestock.com/sign-up.
//
//   1. On page load: capture UTMs / click ids from the current URL and
//      persist to a cookie SCOPED TO `.dragonrestock.com` so it's
//      readable from every subdomain (the LP + the app share it).
//      First-touch: if a cookie already exists we don't overwrite —
//      matches the app's localStorage first-touch model, so a visitor
//      who came in via one campaign and later returned via another
//      keeps the original attribution.
//
//   2. On any click on an anchor pointing to `*.dragonrestock.com/*`
//      (LP → LP internal nav OR LP → app.dragonrestock.com), rewrite
//      the `href` at click-time to append the saved attribution
//      params. Only fills in keys that aren't already in the URL —
//      doesn't stomp on an explicitly-set link.
//
// 🚨 The two per-brand values below are COOKIE_DOMAIN and the hostname
// matcher, and both fail SILENTLY if they name the wrong brand: a
// browser on dragonrestock.com rejects a cookie scoped to another
// domain outright, and a matcher that doesn't recognise this host
// appends nothing to outbound links. DragonReply shipped that way and
// it was caught only by reading the file. COOKIE_NAME deliberately does
// NOT change — it's the cross-brand contract `frontend-shared` reads
// app-side.
//
// Backend counterpart (sellerconnect repo, User attribution columns +
// /v1/auth/sign-up handler) + app-side captureAttribution() (in
// @ballisticbrands/frontend-shared) reads the resulting URL params on
// the app side. This module is the bridge — LP-side.

// ─── Config ─────────────────────────────────────────────────────────

const COOKIE_NAME = "dragonbot_attribution";
// Leading dot means "this cookie is available to all subdomains of
// dragonrestock.com" — LP (dragonrestock.com) writes it; app
// (app.dragonrestock.com) reads it. Required for cross-subdomain
// flow. NOTE: must match the domain THIS LP is served from, or the
// browser silently drops the Set-Cookie.
const COOKIE_DOMAIN = ".dragonrestock.com";
const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid"];

const ALL_ATTR_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS];

// First-touch landing context — the visitor's REAL first page on
// dragonrestock.com + the referrer that sent them. Stored in the SAME
// cookie but kept OUT of ALL_ATTR_KEYS on purpose: the click-time URL
// rewriter must not append these to outbound links (a full URL as a
// query param bloats links and re-encodes awkwardly). The app reads them
// straight from the cookie. This is what fixes User.landingPage, which
// otherwise records the app's own /sign-up URL.
const LANDING_KEYS = ["landing_page", "referrer"];

// ─── Cookie helpers ─────────────────────────────────────────────────

function readCookie(name) {
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name, value) {
  try {
    const attrs = [
      `${name}=${encodeURIComponent(value)}`,
      `Domain=${COOKIE_DOMAIN}`,
      "Path=/",
      `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
    ];
    // Only add Secure on HTTPS pages — required for cross-subdomain
    // navigation to actually carry the cookie in modern browsers.
    // Skipping it on http localhost keeps dev working.
    if (typeof window !== "undefined" && window.location?.protocol === "https:") {
      attrs.push("Secure");
    }
    document.cookie = attrs.join("; ");
  } catch {
    // cookies disabled / storage-full — silently skip
  }
}

// ─── Attribution helpers ────────────────────────────────────────────

/** Return { key: value } for every attribution key present in the URL. */
function readAttrFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const out = {};
  for (const k of ALL_ATTR_KEYS) {
    const v = params.get(k);
    if (v) out[k] = v.slice(0, 256);
  }
  return out;
}

/** Return { key: value } for every attribution key stored in the cookie. */
function readAttrFromCookie() {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return {};
  try {
    const params = new URLSearchParams(raw);
    const out = {};
    for (const k of ALL_ATTR_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Return { landing_page, referrer } stored in the cookie (first-touch). */
function readLandingFromCookie() {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return {};
  try {
    const params = new URLSearchParams(raw);
    const out = {};
    for (const k of LANDING_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Capture this page as the landing: full URL incl. query but minus the
 * fragment (never carries attribution, can hold sensitive tokens), plus
 * the referrer that sent the visitor here.
 */
function captureLandingFromLocation() {
  const out = {};
  const landing =
    window.location.origin + window.location.pathname + window.location.search;
  out.landing_page = landing.slice(0, 2048);
  if (document.referrer) out.referrer = document.referrer.slice(0, 2048);
  return out;
}

/** Persist an attribution object to the cross-subdomain cookie. */
function saveAttrToCookie(attr) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(attr)) params.set(k, v);
  writeCookie(COOKIE_NAME, params.toString());
}

// ─── URL rewriting for outbound clicks ──────────────────────────────

/**
 * True when the URL targets the dragonrestock.com brand — either the
 * apex `dragonrestock.com/*` or any subdomain `*.dragonrestock.com/*`.
 * We rewrite hrefs on this set only (never touching third-party links).
 */
function urlIsDragonRestock(hrefLike) {
  try {
    const url = new URL(hrefLike, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const h = url.hostname.toLowerCase();
    return h === "dragonrestock.com" || h.endsWith(".dragonrestock.com");
  } catch {
    return false;
  }
}

/**
 * Return `href` with attribution keys appended from `attr`. Existing
 * URL params win — if the anchor already has ?utm_source=… we leave
 * it alone (respect explicit intent).
 */
function appendAttrToUrl(href, attr) {
  try {
    const url = new URL(href, window.location.href);
    let added = false;
    for (const [k, v] of Object.entries(attr)) {
      if (!url.searchParams.has(k)) {
        url.searchParams.set(k, v);
        added = true;
      }
    }
    return added ? url.toString() : href;
  } catch {
    return href;
  }
}

/**
 * Attach a document-level click handler that rewrites the href of any
 * clicked anchor pointing to a dragonrestock.com URL. Capture phase so
 * we run BEFORE React Router / other listeners see the click, which
 * means the native navigation (or the router's push) picks up our
 * new href.
 */
function attachClickHandler(attr) {
  document.addEventListener(
    "click",
    (event) => {
      if (!attr || Object.keys(attr).length === 0) return;
      const target = event.target;
      const a = target && target.closest ? target.closest("a") : null;
      if (!a || !a.href) return;
      if (!urlIsDragonRestock(a.href)) return;
      const newHref = appendAttrToUrl(a.href, attr);
      if (newHref !== a.href) a.href = newHref;
    },
    true, // capture
  );
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Call once from the app entry (main.jsx). Idempotent — safe to call
 * again on subsequent renders, but it's really only meant to run at
 * boot.
 *
 *   1. Reads UTMs/click-ids from URL and cookie. Cookie wins if both
 *      are present (first-touch: the earliest campaign the visitor
 *      landed with sticks for 30 days across the whole subdomain
 *      surface).
 *   2. Saves the effective attribution back to the cookie (idempotent
 *      when it's already there).
 *   3. Installs a click handler that rewrites outbound dragonrestock.com
 *      hrefs to include the attribution.
 */
export function initAttribution() {
  try {
    if (typeof window === "undefined") return; // SSR guard, mostly cosmetic

    const fromCookie = readAttrFromCookie();
    const fromUrl = readAttrFromLocation();

    // First-touch: if the cookie already carries attribution, keep it.
    // Otherwise this is a first-time visit and the URL wins.
    const attr =
      Object.keys(fromCookie).length > 0
        ? fromCookie
        : fromUrl;

    // First-touch landing_page + referrer, tracked independently of the
    // campaign params: the cookie's value wins if present, else capture
    // this page. Independent because a visitor can land direct (no UTM,
    // so `attr` is empty) yet we still want their real first page — and
    // a later UTM visit shouldn't overwrite that original landing.
    const landingFromCookie = readLandingFromCookie();
    const landing =
      Object.keys(landingFromCookie).length > 0
        ? landingFromCookie
        : captureLandingFromLocation();

    // Persist campaign + landing together in the one cookie. Always
    // re-save the merged blob so neither half drops the other's keys
    // (readAttrFromCookie / readLandingFromCookie each read their own).
    const merged = { ...attr, ...landing };
    if (Object.keys(merged).length > 0) {
      saveAttrToCookie(merged);
    }

    // The URL rewriter carries ONLY campaign params to outbound links —
    // never landing_page/referrer (see LANDING_KEYS note).
    attachClickHandler(attr);
  } catch {
    // Attribution is best-effort — never fail the page for it.
  }
}
