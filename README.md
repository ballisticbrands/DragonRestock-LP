# dragonrestock-lp

Landing page for **DragonRestock** — Amazon inventory & restock planning.

- **Live:** https://dragonrestock.com
- **App / signup destination:** https://app.dragonrestock.com/sign-up (repo: `ballisticbrands/dragonrestock-frontend`)
- **Deploy:** GitHub Actions → GitHub Pages (auto-builds on push to `main`).

## Tracking IDs

| Tool | ID |
|------|----|
| Google Analytics (GA4) | `G-7JMJEMLRZD` |
| Microsoft Clarity | `y1peimheyt` |
| Meta pixel / dataset | `28716421651297621` |
| Google Ads customer | `807-173-1091` (Dragon Suite umbrella — shared across all products, separate campaigns) |

One GA4 property, one Clarity project and one Meta dataset span **both** this LP and the
app, so the funnel reads end to end. All three are separate from every sibling brand's.
Snippets live in [`index.html`](index.html) `<head>`; event wiring is in
[`src/lib/track.js`](src/lib/track.js).

## Two things that will bite you

**Routes must be prerendered.** `npm run build` runs
[`scripts/postbuild-spa-routes.mjs`](scripts/postbuild-spa-routes.mjs), which writes a
static `index.html` per route with real content — without it GitHub Pages serves the
404 fallback (HTTP 404) and Google Ads scores landing-page experience BELOW_AVERAGE. A
route added to `src/App.jsx` but not to that script's `meta` map ships as a soft 404. The
script **fails the build** if any ad/SEO route falls under 120 crawler-visible words;
raise `MIN_WORDS`, never lower it.

**Event names are never prefixed per product.** `cta_click`, not
`dragonrestock_cta_click`. Each product has its own GA4 property and Meta dataset, so
nothing collides; prefixing breaks cross-product comparison and turns Meta's standard
events into custom ones. `cta_click` maps to `InitiateCheckout` and `pricing_view` to
`ViewContent`.

Full playbook: `DragonBot-marketing/skills/new-product-funnel/SKILL.md`. Live status and
IDs for every product: `DragonBot-marketing/ADS_STATUS.md`.
