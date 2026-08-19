import { CONTACT_EMAIL, COMPANY, COMPANY_ADDRESS } from '../../config';
import { COMPARISONS, compareLabel } from '../../data/compareCopy';

/* ─── Site footer — deep-green band, mirrors the DragonReply footer ───
 *
 * Four columns since the comparison pages landed. The Compare column is the
 * only internal path to /compare/<competitor>, so it does real SEO work:
 * without it every comparison page is an orphan reachable only from ads.
 *
 * ⚠️ It renders from COMPARISONS and skips anything with live: false, which
 * shows as muted "soon" text instead. A footer link to a route that isn't in
 * the prerender map is served by GitHub Pages as an HTTP 404 — see the header
 * of scripts/postbuild-spa-routes.mjs for what that costs. Write the copy,
 * flip the flag, and the link appears here on its own.
 */

const PRODUCT = [
  { label: 'Product', href: '/' },
  { label: 'Live demo', href: '/demo' },
  { label: 'Pricing', href: '/pricing' },
];

/* Legal opens in a new tab: these get clicked mid-signup and mid-ad-review,
   and neither should lose the page they were on. */
const LEGAL = [
  { label: 'Privacy', href: '/privacy', blank: true },
  { label: 'Terms', href: '/tos', blank: true },
  { label: 'Support', href: '/support', blank: true },
];

const linkCls = 'text-sm text-white/50 hover:text-white transition-colors';

function Column({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/35 mb-4">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-[#0F3D2E] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/DragonBot-logo.png" alt="DragonRestock" className="h-8" />
              <span className="font-bold text-lg text-white">DragonRestock</span>
            </div>
            <p className="text-sm text-white/45 leading-[1.6] mt-4 max-w-xs">
              Amazon inventory and restock planning that ends on a decision — the SKU, the quantity, the
              supplier and the date it has to go out.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkCls} inline-block mt-4`}>{CONTACT_EMAIL}</a>
          </div>

          <Column title="Product">
            {PRODUCT.map(l => (
              <li key={l.href}><a href={l.href} className={linkCls}>{l.label}</a></li>
            ))}
          </Column>

          <Column title="Compare">
            {COMPARISONS.map(c => (
              <li key={c.slug}>
                {c.live ? (
                  <a href={`/compare/${c.slug}`} className={linkCls}>{compareLabel(c)}</a>
                ) : (
                  /* deliberately not a link — see the note at the top */
                  <span className="text-sm text-white/25">
                    {compareLabel(c)} <span className="text-[10px] uppercase tracking-wider text-white/20">soon</span>
                  </span>
                )}
              </li>
            ))}
          </Column>

          <Column title="Company">
            {LEGAL.map(l => (
              <li key={l.href}>
                <a href={l.href} className={linkCls} {...(l.blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {l.label}
                </a>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} {COMPANY}. All rights reserved.</p>
            <p className="text-xs text-white/20 mt-1">{COMPANY_ADDRESS}</p>
          </div>
          {/* Named competitors and Amazon marks both appear on this site now,
              so the disclaimer belongs on every page rather than nowhere. */}
          <p className="text-xs text-white/20 leading-[1.6] md:text-right md:max-w-md">
            DragonRestock is not affiliated with, endorsed by, or sponsored by Amazon. Amazon and related
            marks are trademarks of Amazon.com, Inc. All other product names are trademarks of their
            respective owners and are used for identification only.
          </p>
        </div>
      </div>
    </footer>
  );
}
