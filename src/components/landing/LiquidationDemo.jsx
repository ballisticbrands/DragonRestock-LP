import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, TrendingUp, Info, Clock, Flame, AlertTriangle } from 'lucide-react';
import { C, ease } from './theme';
import { bySku } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   LiquidationDemo — the aging-stock decision board.

   Modeled on the seller's own Google Sheet: monitored SKUs, price
   tiers, adjusted velocity, storage fees, and a manager's decision
   column. What the sheet does by hand, this does by watching what
   happened at each tier.

   The mechanic: a SKU sits on a price ladder (Tier 1 → Tier 4). Every
   tier the seller has actually run produced an observed velocity. The
   model multiplies net profit per unit at that tier by that velocity
   to get monthly profit, and recommends whichever tier wins — which
   is frequently NOT the highest price, and occasionally not a discount
   at all.

   Two deliberate details:
     · Fees are modelled per tier, so the apparel referral cliff at $15
       (17% → 5%) shows up. Per-unit profit at $13.99 is essentially
       the same as at $15.99, which is the kind of thing a seller
       misses and the reason the AI note flags it as worth testing.
     · Not every aging SKU should be discounted. The flag tee is
       seasonal, not dead, and the board says hold — a liquidation
       tool that only ever says "cut the price" can't be trusted.

   No ASIN column: this is a decision board, not a catalog view.
   ────────────────────────────────────────────────────────────── */

const money = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money0 = (n) => `$${Math.round(n).toLocaleString()}`;

/* Apparel economics: 17% referral above $15, 5% at or below, plus a
   flat FBA fulfilment fee. Enough to make the tier math honest. */
const FBA_FEE = 4.25;
const feesAt = (price) => (price > 15 ? price * 0.17 : price * 0.05) + FBA_FEE;
const netAt = (price, cogs) => price - cogs - feesAt(price);

/* Amazon's aging brackets. The last two are the ones that matter:
   271–365 is the cohort about to cross into long-term storage fees,
   365+ is already paying them. */
const BRACKETS = [
  { key: '0-90d', color: '#86EFAC' },
  { key: '91-180d', color: '#93C5FD' },
  { key: '181-270d', color: '#3B82F6' },
  { key: '271-365d', color: '#F59E0B' },
  { key: '365d+', color: '#DC2626' },
];

const SEVERITY = {
  critical: { label: 'Critical', color: C.red, bg: 'rgba(220,38,38,0.10)' },
  warning: { label: 'Warning', color: '#B45309', bg: 'rgba(245,158,11,0.16)' },
  caution: { label: 'Caution', color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  none: null,
};

const severityOf = (aging) =>
  aging[4] > 0 ? 'critical' : aging[3] > 0 ? 'warning' : aging[2] > 0 ? 'caution' : 'none';

const ACTION = {
  discount: { label: 'Lower to Tier 3', color: C.green, bg: 'rgba(47,125,79,0.10)' },
  hold: { label: 'Hold for season', color: '#B45309', bg: 'rgba(245,158,11,0.16)' },
  clear: { label: 'Clear & remove', color: C.red, bg: 'rgba(220,38,38,0.10)' },
  none: { label: 'Do nothing', color: 'rgba(26,26,26,0.45)', bg: 'rgba(26,26,26,0.06)' },
};

const ROWS = [
  {
    sku: 'SHIRT-GRN-S', fba: 480, offsite: 0, cogs: 3.90,
    currentTier: 0, storage: 38, action: 'discount',
    status: 'Overstocked · 6.5 years of cover',
    aging: [0, 0, 180, 300, 0], ltsfPerUnit: 0.52, cliff: 'Sep 4',
    tiers: [
      { price: 24.99, velocity: 0.2, tested: '90 days' },
      { price: 19.99, velocity: 0.9, tested: '14 days' },
      { price: 15.99, velocity: 3.4, tested: '14 days' },
      { price: 13.99, velocity: null, tested: null },
    ],
    recommend: 2,
    note: 'At $24.99 this moved 0.2/day — 480 units is 6.5 years of cover and $38/mo in storage the whole way. Two weeks at $19.99 got it to 0.9/day; two weeks at $15.99 got it to 3.4/day. Tier 3 earns less per unit and far more per month, and clears the stock in 141 days instead of never.',
    cliff: '300 units start crossing 365 days on Sep 4, which adds $156/mo in long-term fees on top of the $38 you already pay. At Tier 3’s 3.4/day you won’t clear them all before that happens.',
    footnote: 'Worth testing $13.99 now rather than later: it crosses Amazon’s apparel referral cliff, where the fee drops from 17% to 5%, so per-unit profit barely moves. If it shifts even 20% faster it clears ahead of the Sep 4 deadline and is strictly the better tier. Two weeks tells you.',
  },
  {
    sku: 'SHIRT-USA-M', fba: 340, offsite: 120, cogs: 4.20,
    currentTier: 0, storage: 31, action: 'hold',
    status: 'Seasonal · demand returns June 2027',
    aging: [0, 120, 220, 120, 0], ltsfPerUnit: 0.52, cliff: 'Mar 12',
    tiers: [
      { price: 22.99, velocity: 0.1, tested: 'since Jul 5' },
      { price: 17.99, velocity: null, tested: null },
      { price: 14.99, velocity: null, tested: null },
      { price: 11.99, velocity: null, tested: null },
    ],
    recommend: 0,
    note: 'Don’t discount this one. It ran 38/day between June 20 and July 4 and then stopped dead — that’s a calendar, not a dying product. Clearing 460 units now recovers about $3,400; holding puts roughly $9,400 back on the table next June.',
    cliff: 'Holding isn’t free though: 120 units cross 365 days on Mar 12, adding $62/mo. Send those cartons out to the 3PL in February and you dodge the fee entirely — off-site storage costs a fraction of it and they come back in time for the June window.',
  },
  {
    sku: 'HAT-RED-OS', fba: 210, offsite: 0, cogs: 2.80,
    currentTier: 2, storage: 22, action: 'clear',
    status: 'No sales in 90 days',
    aging: [0, 0, 40, 90, 80], ltsfPerUnit: 0.38, cliff: null,
    tiers: [
      { price: 18.99, velocity: 0.0, tested: '60 days' },
      { price: 14.99, velocity: 0.0, tested: '30 days' },
      { price: 11.99, velocity: 0.1, tested: '30 days' },
      { price: 9.99, velocity: null, tested: null },
    ],
    recommend: 3,
    note: 'Three tiers tested, nothing moved. This isn’t a pricing problem. Run a $9.99 clearance to recover what you can — about $1.04/unit after fees — then submit a removal order for whatever is left after 30 days. Removal costs $67; another year of storage costs $264.',
    cliff: '80 units are already past 365 days and paying long-term fees today. Another 90 cross within the quarter. Every month you wait costs $65 on stock that hasn’t sold a unit in 90 days.',
  },
  {
    sku: 'SHIRT-BLU-L', fba: 323, offsite: 240, cogs: 3.90,
    currentTier: 0, storage: 12, action: 'none',
    status: 'Healthy · clears in 37 days',
    aging: [420, 143, 0, 0, 0], ltsfPerUnit: 0.52, cliff: null,
    tiers: [
      { price: 24.99, velocity: 15.4, tested: '90 days' },
      { price: 19.99, velocity: null, tested: null },
      { price: 15.99, velocity: null, tested: null },
      { price: 13.99, velocity: null, tested: null },
    ],
    recommend: 0,
    note: 'Nothing to do. 563 units at 15.4/day clears inside 37 days at full price — nothing on this SKU gets anywhere near the 181-day bracket, let alone long-term fees. It only appears here because it crossed 90 days.',
  },
];

const GRID = 'grid grid-cols-[24px_minmax(155px,1fr)_60px_minmax(148px,1.25fr)_84px_58px_76px_128px] items-center gap-2';

const atRiskUnits = (row) => row.aging[3] + row.aging[4];
const ltsfOf = (row) => atRiskUnits(row) * row.ltsfPerUnit;

/* Stacked aging distribution, with a legend for the brackets that
   actually have units in them. */
function AgingBar({ aging }) {
  const total = aging.reduce((n, v) => n + v, 0) || 1;
  return (
    <span className="block">
      <span className="flex h-[7px] rounded-full overflow-hidden bg-[#1A1A1A]/[0.06]">
        {aging.map((v, i) => (v > 0 ? (
          <span key={BRACKETS[i].key} style={{ width: `${(v / total) * 100}%`, backgroundColor: BRACKETS[i].color }} />
        ) : null))}
      </span>
      <span className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
        {aging.map((v, i) => (v > 0 ? (
          <span key={BRACKETS[i].key} className="flex items-center gap-1 text-[8px] text-[#1A1A1A]/45 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BRACKETS[i].color }} />
            {BRACKETS[i].key}: {v}
          </span>
        ) : null))}
      </span>
    </span>
  );
}

const monthly = (tier, cogs) => (tier.velocity == null ? null : netAt(tier.price, cogs) * tier.velocity * 30);

function TierLadder({ row }) {
  const best = row.tiers[row.recommend];
  const current = row.tiers[row.currentTier];
  const bestMonthly = monthly(best, row.cogs);
  const currentMonthly = monthly(current, row.cogs);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {row.tiers.map((tier, i) => {
        const m = monthly(tier, row.cogs);
        const isBest = i === row.recommend;
        const isCurrent = i === row.currentTier;
        const untested = tier.velocity == null;
        return (
          <div key={tier.price}
            className={`rounded-lg px-2.5 py-2.5 border ${untested ? 'border-dashed' : ''}`}
            style={{
              borderColor: isBest ? C.green : 'rgba(26,26,26,0.12)',
              backgroundColor: isBest ? 'rgba(47,125,79,0.07)' : '#FFFFFF',
              borderWidth: isBest ? 1.5 : 1,
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/35">Tier {i + 1}</span>
              {isCurrent && <span className="text-[8px] font-bold uppercase text-[#1A1A1A]/40">now</span>}
              {isBest && !isCurrent && <TrendingUp className="w-3 h-3" style={{ color: C.green }} />}
            </div>
            <div className="text-[15px] font-bold tabular-nums leading-none text-[#1A1A1A]">{money(tier.price)}</div>
            {untested ? (
              <div className="mt-1.5 text-[9px] text-[#1A1A1A]/30">Not tested</div>
            ) : (
              <>
                <div className="mt-1.5 text-[9.5px] text-[#1A1A1A]/50 tabular-nums">
                  {tier.velocity.toFixed(1)}/day · {tier.tested}
                </div>
                <div className="mt-1 text-[11.5px] font-bold tabular-nums" style={{ color: isBest ? C.green : 'rgba(26,26,26,0.6)' }}>
                  {money0(m)}<span className="font-medium text-[#1A1A1A]/35">/mo</span>
                </div>
              </>
            )}
          </div>
        );
      })}
      {bestMonthly != null && currentMonthly != null && bestMonthly > currentMonthly && (
        <div className="col-span-2 sm:col-span-4 flex items-center gap-2 rounded-lg px-3 py-2 mt-0.5"
          style={{ backgroundColor: 'rgba(47,125,79,0.08)', border: '1px solid rgba(47,125,79,0.20)' }}>
          <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: C.green }} />
          <span className="text-[11px] text-[#1A1A1A]/75">
            Moving to Tier {row.recommend + 1} is{' '}
            <span className="font-bold" style={{ color: C.green }}>
              +{money0(bestMonthly - currentMonthly)}/mo
            </span>{' '}
            in profit — {money0(currentMonthly)} today vs {money0(bestMonthly)} at {money(best.price)}.
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ row, open, onToggle }) {
  const p = bySku[row.sku];
  const a = ACTION[row.action];
  const total = row.fba + row.offsite;
  const current = row.tiers[row.currentTier];
  const sev = SEVERITY[severityOf(row.aging)];
  const ltsf = ltsfOf(row);

  return (
    <div className="border-b border-[#1A1A1A]/6 last:border-b-0">
      <div className={`${GRID} px-3 py-3`}>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={`Show the tier analysis for ${row.sku}`}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#1A1A1A]/[0.05] transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A1A]/35 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>

        <span className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={p.img} alt="" className="w-6 h-6" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-semibold text-[#1A1A1A]/85 truncate">{row.sku}</span>
              {sev && (
                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold whitespace-nowrap shrink-0"
                  style={{ color: sev.color, backgroundColor: sev.bg }}>{sev.label}</span>
              )}
            </span>
            <span className="block text-[9.5px] text-[#1A1A1A]/45 truncate">{row.status}</span>
          </span>
        </span>

        <span className="text-right leading-tight">
          <span className="block text-[12px] font-semibold tabular-nums text-[#1A1A1A]">{total}</span>
          <span className="block text-[8.5px] tabular-nums text-[#1A1A1A]/35">units</span>
        </span>

        <AgingBar aging={row.aging} />

        <span className="text-right leading-tight">
          <span className="block text-[12px] font-semibold tabular-nums text-[#1A1A1A]">{money(current.price)}</span>
          <span className="block text-[8.5px] text-[#1A1A1A]/35">Tier {row.currentTier + 1}</span>
        </span>

        <span className="text-right text-[15px] font-bold tabular-nums text-[#1A1A1A]/85">
          {current.velocity.toFixed(1)}
        </span>

        <span className="text-right leading-tight">
          <span className="block text-[11.5px] font-semibold tabular-nums text-[#1A1A1A]/75">{money0(row.storage)}</span>
          {ltsf > 0 && (
            <span className="block text-[9px] font-bold tabular-nums" style={{ color: C.red }}>
              +{money0(ltsf)} LTSF
            </span>
          )}
        </span>

        <span className="flex justify-end">
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap"
            style={{ color: a.color, backgroundColor: a.bg }}>
            {row.action === 'discount' ? `Lower to ${money(row.tiers[row.recommend].price)}` : a.label}
          </span>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }} className="overflow-hidden">
            <div className="mx-2 mb-2.5 rounded-xl p-3.5"
              style={{ backgroundColor: 'rgba(91,91,214,0.045)', border: '1px solid rgba(91,91,214,0.14)' }}>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide mb-2.5" style={{ color: C.indigo }}>
                <Sparkles className="w-3 h-3" /> Price tiers tested
              </div>
              <TierLadder row={row} />
              <p className="text-[10.5px] leading-relaxed text-[#1A1A1A]/70 mt-3">{row.note}</p>

              {row.cliff && (
                <div className="mt-2.5 rounded-lg px-3 py-2.5 flex items-start gap-2"
                  style={{ backgroundColor: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.16)' }}>
                  <Clock className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color: C.red }} />
                  <span className="text-[10.5px] leading-relaxed text-[#1A1A1A]/70">
                    <span className="font-bold" style={{ color: C.red }}>Long-term storage: </span>{row.cliff}
                  </span>
                </div>
              )}
              {row.footnote && (
                <p className="text-[10px] leading-relaxed text-[#1A1A1A]/50 mt-2 pl-2.5 border-l-2" style={{ borderColor: 'rgba(91,91,214,0.30)' }}>
                  {row.footnote}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LiquidationDemo() {
  const [open, setOpen] = useState('SHIRT-GRN-S');

  const count = (k) => ROWS.filter(r => severityOf(r.aging) === k).length;
  const skusAtRisk = ROWS.filter(r => severityOf(r.aging) !== 'none').length;
  const agingUnits = ROWS.reduce((n, r) => n + r.aging[2] + r.aging[3] + r.aging[4], 0);
  const storage = ROWS.reduce((n, r) => n + r.storage, 0);
  const ltsfExposure = ROWS.reduce((n, r) => n + ltsfOf(r), 0);
  const uplift = ROWS.reduce((n, r) => {
    const b = monthly(r.tiers[r.recommend], r.cogs);
    const c = monthly(r.tiers[r.currentTier], r.cogs);
    return n + (b != null && c != null && b > c ? b - c : 0);
  }, 0);

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4">
        <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">Liquidation &amp; Price Tiers</h4>
        <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Every aging SKU with a priced decision — discount, hold, or clear out — and the storage clock behind it.</p>
      </div>

      <div className="px-5 grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { label: 'SKUs at risk', value: String(skusAtRisk), sub: '181+ days old' },
          { label: 'Critical', icon: Flame, tone: C.red, value: String(count('critical')), sub: '365+ days' },
          { label: 'Warning', icon: AlertTriangle, tone: '#B45309', value: String(count('warning')), sub: '271–365 days' },
          { label: 'Caution', icon: Clock, tone: '#2563EB', value: String(count('caution')), sub: '181–270 days' },
          { label: 'Aging units', value: agingUnits.toLocaleString(), sub: '181+ days old' },
          { label: 'Storage fee / mo', value: money0(storage), sub: 'recurring on aging stock' },
          { label: 'LTSF exposure', tone: C.red, value: `${money0(ltsfExposure)}/mo`, sub: 'once 365 days is crossed' },
          { label: 'Profit on the table', tone: C.green, value: `+${money0(uplift)}/mo`, sub: 'at the recommended tiers' },
        ].map(({ label, value, tone, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-white px-3.5 py-3 border"
            style={{ borderColor: Icon || tone ? `${tone}40` : 'rgba(26,26,26,0.08)' }}>
            <div className="flex items-center gap-1 mb-1.5">
              {Icon && <Icon className="w-3 h-3 shrink-0" style={{ color: tone }} />}
              <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                style={{ color: Icon ? tone : 'rgba(26,26,26,0.40)' }}>{label}</span>
            </div>
            <div className="font-clash font-semibold text-[22px] leading-none tracking-[-0.02em]"
              style={{ color: tone ?? '#1A1A1A' }}>{value}</div>
            <div className="text-[8.5px] text-[#1A1A1A]/35 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[880px]">
            <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span />
              <span>SKU</span>
              <span className="text-right">Units</span>
              <span>Aging distribution</span>
              <span className="text-right">Price</span>
              <span className="text-right">Velocity</span>
              <span className="text-right leading-tight">Storage<br />/ mo</span>
              <span className="text-right">Action</span>
            </div>
            {ROWS.map(r => (
              <Row key={r.sku} row={r} open={open === r.sku} onToggle={() => setOpen(open === r.sku ? null : r.sku)} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#1A1A1A]/40">
          <Info className="w-3 h-3" /> Monthly profit is net of referral and FBA fees at each tier, times the velocity that tier actually produced.
        </div>
      </div>
    </div>
  );
}
