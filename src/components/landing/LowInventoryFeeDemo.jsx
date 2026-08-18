import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, AlertTriangle, ShieldCheck, Truck, Sparkles, Clock } from 'lucide-react';
import { C, ease } from './theme';
import { bySku } from '../../data/story';
import Copyable from './Copyable';

/* ──────────────────────────────────────────────────────────────
   LowInventoryFeeDemo — "Low-Inventory Fee Forecast".

   Amazon charges a per-unit fee on standard-size FBA units whenever a
   SKU's historical days of supply sits under 28 days on BOTH its
   30-day and 90-day windows. It's bundled into the fulfilment fee and
   never itemised, so most sellers pay it for months without ever
   seeing the line. This screen is the line.

   The mechanic is a weekly replay. Inventory drains at the SKU's own
   velocity, inbound POs and 3PL transfers land on their dates, and
   each week we re-ask Amazon's question — is days of supply under 28
   on both windows? — and price that week's units at the published
   rate for whichever bracket the lower of the two figures falls in.
   Every number on screen comes out of that loop; nothing is typed in
   twice.

   Three deliberate details:
     · The AND condition is real. The blue tee is under 28 days on its
       30-day window and over on its 90-day, so it pays nothing this
       week and starts paying next week. A tool that only checked one
       window would have shown a fee that isn't being charged.
     · Below 20 units a week the fee doesn't apply at all. The dead
       stock and the seasonal tee sit in the table marked exempt
       rather than quietly filtered out, because "why isn't this here"
       is the question a seller actually asks.
     · The send-in quantity is searched for, not authored: the plan is
       the smallest case-pack multiple that carries days of supply
       over 28 for the rest of the window, and the saving is the
       difference between the two replays shown side by side.

   The fee brackets and rates below are Amazon's published standard-
   size rates. The point of the screen is that they're avoidable —
   which is why every at-risk row ends in an instruction rather than
   a warning badge.
   ────────────────────────────────────────────────────────────── */

const TODAY = new Date(2026, 7, 12);          // 12 Aug 2026, the site's "now"
const TRANSIT = 14;                           // 3PL → FBA check-in, in days
const CASE_PACK = 50;
const CATALOG = 8;                            // SKUs in the seller's catalogue
const LOW_VOLUME = 20;                        // units/7d below which the fee doesn't apply
const THRESHOLD = 28;                         // days of supply Amazon measures against

/* Amazon's published low-inventory-level fee, per unit, by size tier
   and by how far under 28 days the SKU is. */
const TIERS = {
  ss: { label: 'Small standard', sub: '0–16 oz', rates: [0.89, 0.63, 0.32] },
  ls: { label: 'Large standard', sub: '0–16 oz', rates: [0.97, 0.71, 0.36] },
};

const BRACKETS = [
  { key: 'Under 14 days', short: '<14d', color: C.red, bg: 'rgba(220,38,38,0.10)' },
  { key: '14 – 21 days', short: '14–21d', color: '#B45309', bg: 'rgba(245,158,11,0.16)' },
  { key: '21 – 28 days', short: '21–28d', color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  { key: '28 days or more', short: '28d+', color: C.green, bg: 'rgba(47,125,79,0.10)' },
];

const bracketOf = (supply) => (supply < 14 ? 0 : supply < 21 ? 1 : supply < THRESHOLD ? 2 : 3);

/* ─── the seller's catalogue, as the fee model sees it ───
   v30 / v90 are the trailing average daily units Amazon divides by;
   `season` is the multiplier the forecast applies going forward, so
   this screen drains inventory at the same rate the forecasting demo
   projects it.

   `standing` is the seller's existing weekly top-up out of the 3PL —
   it has to be modelled, because a SKU under 28 days of cover with
   nothing coming in doesn't pay a fee for a quarter, it stocks out in
   three weeks. The low-inventory fee is what a standing transfer
   that's slightly too small costs you, and that's what these rows
   are. It draws down `offsite`, so the pool can run dry mid-quarter. */
const ROWS = [
  {
    sku: 'SHIRT-RED-M', title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Red',
    asin: 'B0RDG7TEE1', tier: 'ls',
    onHand: 412, offsite: 2400, standing: 300, v30: 42.3, v90: 38.6, season: 1.05,
    chargedWeeks: 4, sendByDays: 2,
    inbound: [{ day: 48, units: 2400, label: 'PO-1042 check-in' }],
    note: 'You are not out of stock on this one — you are permanently thin on it, and that is the state Amazon charges for. The standing 300 a week is eleven units short of what sells, so cover never collapses and never recovers either: it sits just under ten days, in the worst bracket there is, until PO-1042 checks in. Every unit that goes out in between carries the fee.',
  },
  {
    sku: 'HAT-BLK-OS', title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Black',
    asin: 'B0RDG4CAP2', tier: 'ss',
    onHand: 260, offsite: 1300, standing: 110, v30: 17.8, v90: 16.2, season: 1.05,
    chargedWeeks: 2, sendByDays: 6,
    inbound: [{ day: 55, units: 1400, label: 'PO-1044 check-in' }],
    note: 'The standing 110 a week is 20 short of what this sells, so cover slides a little further every week and walks the SKU down through the brackets rather than off a cliff. There are 1,300 units sitting at the 3PL that are already bought and paid for — they are doing nothing where they are.',
  },
  {
    sku: 'SHIRT-BLU-L', title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Blue',
    asin: 'B0RDG7TEE3', tier: 'ls',
    onHand: 398, offsite: 900, standing: 95, v30: 15.4, v90: 14.0, season: 1.05,
    chargedWeeks: 0, sendByDays: 4,
    inbound: [{ day: 30, units: 560, label: 'Transfer · 3PL → FBA' }],
    note: 'Nothing is being charged today, and it is worth being precise about why: the 30-day window is under the threshold, the 90-day window is just over it, and the fee needs both. One week of ordinary sales pulls the second one under with it, and the standing 95 a week is eighteen units short of holding the line. This is the cheap one to fix — the whole quarter costs less than the red tee costs in a fortnight, and fifty units settles it.',
  },
  {
    sku: 'HAT-NVY-OS', title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Navy',
    asin: 'B0RDG4CAP4', tier: 'ss',
    onHand: 690, offsite: 0, standing: 0, v30: 6.9, v90: 7.4, season: 1.05,
    chargedWeeks: 0, sendByDays: 0,
    inbound: [{ day: 62, units: 900, label: 'PO-1046 check-in' }],
    note: 'Three months of cover on a SKU selling seven a day, and PO-1046 lands before that runs down. Nothing to do — it is in the table because every standard-size SKU gets evaluated, not because there is a problem with it.',
  },
  {
    sku: 'SHIRT-GRN-S', title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Green',
    asin: 'B0RDG7TEE5', tier: 'ls',
    onHand: 480, offsite: 0, standing: 0, v30: 0.2, v90: 0.2, season: 1.0,
    chargedWeeks: 0, sendByDays: 0,
    inbound: [],
    note: 'Exempt on volume — and the opposite problem. 480 units at 0.2 a day is six and a half years of cover, which costs nothing in low-inventory fees and $38 a month in storage. That decision belongs on the liquidation board, not this one.',
  },
  {
    sku: 'SHIRT-USA-M', title: 'Ridgeline Flag Tee — Stars & Stripes, July 4th, M',
    asin: 'B0RDG7USA1', tier: 'ls',
    onHand: 340, offsite: 120, standing: 0, v30: 0.1, v90: 6.4, season: 1.0,
    chargedWeeks: 0, sendByDays: 0,
    inbound: [],
    note: 'Exempt today, and it will stay exempt right up to the week it stops being exempt. This SKU ran 38 a day between June 20 and July 4 and has sold almost nothing since, so a fee model reading this week’s velocity says you are fine — and next June you are thin and paying for it. The send-in on this one gets planned off the seasonal forecast, not off today’s number.',
  },
];

/* ─── the model ─── */

const addDays = (d, n) => {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

/* One week of Amazon's decision, thirteen times over. Inventory drains
   at the SKU's own velocity, arrivals land on their day, and the fee
   is priced against whichever bracket the lower of the two supply
   figures falls in — but only if both are under the threshold. */
function replay(row, weeks, extra) {
  const rates = TIERS[row.tier].rates;
  const arrivals = extra ? [...row.inbound, extra] : row.inbound;
  let inv = row.onHand;
  let pool = row.offsite - (extra ? extra.units : 0);   // the send-in comes out of the same 3PL stock
  let fee = 0;
  const out = [];

  for (let w = 0; w < weeks; w++) {
    const from = w * 7;
    let landed = 0;
    arrivals.forEach(a => { if (a.day >= from && a.day < from + 7) { inv += a.units; landed += a.units; } });

    const sup30 = inv / row.v30;
    const sup90 = inv / row.v90;
    const supply = Math.min(sup30, sup90);
    const charged = !row.exempt && sup30 < THRESHOLD && sup90 < THRESHOLD;
    const sold = Math.min(inv, row.v30 * row.season * 7);
    const weekFee = charged ? sold * rates[bracketOf(supply)] : 0;

    fee += weekFee;
    out.push({ w, day: from, date: addDays(TODAY, from), supply, charged, bracket: bracketOf(supply), fee: weekFee, landed });

    /* Sell the week down, then top it up. The standing transfer is
       settled after the fee decision rather than before it, which is
       both closer to how a weekly top-up actually lands and the reason
       week 0 of every replay agrees exactly with the figures on the
       row above it. */
    inv = Math.max(0, inv - sold);
    const drip = Math.max(0, Math.min(row.standing, pool));
    pool -= drip;
    inv += drip;
  }
  return { weeks: out, fee };
}

/* The smallest case-pack multiple that clears the fee for good, found
   by re-running the replay rather than asserted. Capped by what is
   actually sitting at the 3PL — an instruction to send stock you
   haven't got isn't an instruction. */
function planFor(row, base) {
  if (row.exempt || base.fee < 0.5) return null;
  const arriveDay = row.sendByDays + TRANSIT;
  const ceiling = Math.min(row.offsite, 6000);
  const feeAfterArrival = (r) => r.weeks.reduce((n, w) => n + (w.day >= arriveDay ? w.fee : 0), 0);

  for (let units = CASE_PACK; units <= ceiling; units += CASE_PACK) {
    const after = replay(row, 13, { day: arriveDay, units });
    if (feeAfterArrival(after) < 0.5) {
      return { units, after, save: base.fee - after.fee, arriveDay, capped: false };
    }
  }
  const units = Math.floor(ceiling / CASE_PACK) * CASE_PACK;
  if (units <= 0) return null;
  const after = replay(row, 13, { day: arriveDay, units });
  return { units, after, save: base.fee - after.fee, arriveDay, capped: true };
}

const VIEW = ROWS.map((row) => {
  const weekly = row.v30 * 7;
  const exempt = weekly < LOW_VOLUME;
  const r = { ...row, weekly, exempt, ...TIERS[row.tier] };
  const sup30 = r.onHand / r.v30;
  const sup90 = r.onHand / r.v90;
  const supply = Math.min(sup30, sup90);
  const charging = !exempt && sup30 < THRESHOLD && sup90 < THRESHOLD;
  const p30 = replay(r, 4);
  const p90 = replay(r, 13);
  const plan = planFor(r, p90);

  return {
    ...r,
    sup30, sup90, supply,
    charging,
    bracket: bracketOf(supply),
    perUnit: charging ? TIERS[row.tier].rates[bracketOf(supply)] : null,
    forecast30: Math.round(r.v30 * r.season * 30),
    weeklySold: Math.round(r.v30 * r.season * 7),
    charged30: charging ? r.chargedWeeks * weekly * TIERS[row.tier].rates[bracketOf(supply)] : 0,
    p30, p90, plan,
    atRisk: !exempt && p90.fee >= 0.5,
    sendBy: addDays(TODAY, row.sendByDays),
  };
});

const TOTAL = {
  charged30: VIEW.reduce((n, r) => n + r.charged30, 0),
  next30: VIEW.reduce((n, r) => n + r.p30.fee, 0),
  next90: VIEW.reduce((n, r) => n + r.p90.fee, 0),
  atRisk: VIEW.filter(r => r.atRisk).length,
  save: VIEW.reduce((n, r) => n + (r.plan ? r.plan.save : 0), 0),
};

const usd = (n) => (n >= 100
  ? `$${Math.round(n).toLocaleString()}`
  : `$${n.toFixed(2)}`);
const cents = (n) => `$${n.toFixed(2)}`;
const days = (n) => (n >= 1000 ? Math.round(n).toLocaleString() : n.toFixed(1));

const GRID = 'grid grid-cols-[20px_minmax(190px,1fr)_100px_54px_62px_62px_62px_118px_74px_160px] items-center gap-2';

/* ─── the weekly replay, drawn ───
   Bar height is days of supply, the dashed line is Amazon's 28-day
   threshold. Everything under the line is a week you get charged for,
   which makes the before/after pair readable without a legend. */
const CAP = 44;

function WeekStrip({ result, title, total, tone, arriveWeek }) {
  return (
    <div className="rounded-lg bg-white border border-[#1A1A1A]/10 px-3 pt-2.5 pb-2">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/45">{title}</span>
        <span className="text-[13px] font-bold tabular-nums" style={{ color: tone }}>
          {usd(total)}<span className="text-[9px] font-medium text-[#1A1A1A]/35"> / 90d</span>
        </span>
      </div>

      <div className="relative h-[58px] flex items-end gap-[3px]">
        <div className="absolute left-0 right-0 z-10 border-t border-dashed border-[#1A1A1A]/25 pointer-events-none"
          style={{ bottom: `${(THRESHOLD / CAP) * 100}%` }}>
          <span className="absolute right-0 -top-[11px] text-[7.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/35 bg-white px-1">
            {THRESHOLD}-day threshold
          </span>
        </div>
        {result.weeks.map((w) => (
          <div key={w.w} className="flex-1 flex flex-col items-center justify-end h-full">
            {w.w === arriveWeek && (
              <Truck className="w-2.5 h-2.5 mb-0.5 shrink-0" style={{ color: C.indigo }} />
            )}
            <div className="w-full rounded-t-[2px]"
              style={{
                height: `${Math.max(3, Math.min(1, w.supply / CAP) * 100)}%`,
                backgroundColor: BRACKETS[w.charged ? w.bracket : 3].color,
                opacity: w.charged ? 0.85 : 0.35,
              }} />
          </div>
        ))}
      </div>

      <div className="flex gap-[3px] mt-1">
        {result.weeks.map((w) => (
          <span key={w.w} className="flex-1 text-center text-[7.5px] text-[#1A1A1A]/35 whitespace-nowrap">
            {w.w % 4 === 0 ? fmtDate(w.date) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

function RateLadder({ row }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {BRACKETS.map((b, i) => {
        const here = !row.exempt && row.charging && row.bracket === i;
        const target = i === 3;
        return (
          <div key={b.key} className="rounded-lg px-2.5 py-2 border"
            style={{
              borderColor: here ? b.color : target ? 'rgba(47,125,79,0.35)' : 'rgba(26,26,26,0.12)',
              backgroundColor: here ? b.bg : target ? 'rgba(47,125,79,0.05)' : '#FFFFFF',
              borderWidth: here ? 1.5 : 1,
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/35">{b.short} supply</span>
              {here && <span className="text-[8px] font-bold uppercase" style={{ color: b.color }}>now</span>}
            </div>
            <div className="text-[15px] font-bold tabular-nums leading-none"
              style={{ color: target ? C.green : '#1A1A1A' }}>
              {target ? 'No fee' : cents(TIERS[row.tier].rates[i])}
            </div>
            <div className="mt-1 text-[9px] text-[#1A1A1A]/40">
              {target ? 'the target' : `${usd(TIERS[row.tier].rates[i] * row.weeklySold)}/wk at ${row.weeklySold.toLocaleString()} units`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Detail({ row }) {
  const plan = row.plan;
  return (
    /* the written explanation of the bracket — reading size throughout,
       the ladder and week strips keep their UI scale */
    <div className="mx-2 mb-2.5 rounded-xl p-5"
      style={{ backgroundColor: 'rgba(91,91,214,0.045)', border: '1px solid rgba(91,91,214,0.14)' }}>
      <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide mb-3" style={{ color: C.indigo }}>
        <Sparkles className="w-3.5 h-3.5" /> Fee brackets · {row.label} ({row.sub})
      </div>

      <RateLadder row={row} />

      {!row.exempt && (
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          <WeekStrip result={row.p90} title="If nothing changes" total={row.p90.fee}
            tone={row.p90.fee >= 0.5 ? C.red : C.green} />
          {plan
            ? <WeekStrip result={plan.after} title={`With the ${plan.units.toLocaleString()}-unit send-in`}
                total={plan.after.fee} tone={C.green} arriveWeek={Math.floor(plan.arriveDay / 7)} />
            : (
              <div className="rounded-lg bg-white border border-[#1A1A1A]/10 px-3 py-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: C.green }} />
                <span className="text-[13px] leading-snug text-[#1A1A1A]/65">
                  Cover stays above {THRESHOLD} days on both windows for the whole quarter. No send-in needed.
                </span>
              </div>
            )}
        </div>
      )}

      <p className="text-[14px] leading-relaxed text-[#1A1A1A]/70 mt-4">{row.note}</p>

      {plan && (
        <div className="mt-3 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
          style={{ backgroundColor: 'rgba(47,125,79,0.06)', border: '1px solid rgba(47,125,79,0.20)' }}>
          <Truck className="w-4 h-4 shrink-0 mt-px" style={{ color: C.green }} />
          <span className="text-[14px] leading-relaxed text-[#1A1A1A]/70">
            <span className="font-bold" style={{ color: C.green }}>The send-in: </span>
            ship {plan.units.toLocaleString()} units from the 3PL by {fmtDate(row.sendBy)} and they check in around{' '}
            {fmtDate(addDays(TODAY, plan.arriveDay))}, {TRANSIT} days later. That carries days of supply back over {THRESHOLD}{' '}
            {plan.capped ? 'for most of the window' : 'and keeps it there'}, and takes {usd(plan.save)} of the{' '}
            {usd(row.p90.fee)} off the next 90 days.
            {plan.capped && ` The 3PL only holds ${row.offsite.toLocaleString()} units, so this is the best the transfer can do on its own.`}
          </span>
        </div>
      )}

      {!row.exempt && (row.inbound.length > 0 || row.standing > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-2.5 border-l-2" style={{ borderColor: 'rgba(91,91,214,0.30)' }}>
          {row.standing > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] text-[#1A1A1A]/50">
              <Truck className="w-3 h-3 shrink-0" />
              Standing transfer — {row.standing.toLocaleString()} units/wk, against {Math.round(row.v30 * row.season * 7).toLocaleString()} sold
            </span>
          )}
          {row.inbound.map(a => (
            <span key={a.label} className="flex items-center gap-1.5 text-[10px] text-[#1A1A1A]/50">
              <Clock className="w-3 h-3 shrink-0" />
              {a.label} — {a.units.toLocaleString()} units, {fmtDate(addDays(TODAY, a.day))}
            </span>
          ))}
        </div>
      )}

      {row.exempt && (
        <p className="text-[12.5px] leading-relaxed text-[#1A1A1A]/50 mt-2.5 pl-3 border-l-2" style={{ borderColor: 'rgba(91,91,214,0.30)' }}>
          Amazon does not apply the low-inventory fee below {LOW_VOLUME} units a week. This SKU sells{' '}
          {row.weekly.toFixed(1)}, so no bracket applies at any level of cover.
        </p>
      )}
    </div>
  );
}

function SupplyCell({ value, under }) {
  return (
    <span className="flex items-center justify-end gap-1 text-[12px] font-semibold tabular-nums"
      style={{ color: under ? C.red : C.green }}>
      {days(value)}
      {under
        ? <AlertTriangle className="w-3 h-3 shrink-0" />
        : <ShieldCheck className="w-3 h-3 shrink-0" />}
    </span>
  );
}

function Row({ row, open, onToggle }) {
  const p = bySku[row.sku];
  return (
    <div className={`border-b border-[#1A1A1A]/6 last:border-b-0 ${open ? 'bg-[#5B5BD6]/[0.03]' : ''}`}>
      <div className={`${GRID} px-3 py-3`}>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={`Show the fee breakdown for ${row.sku}`}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#1A1A1A]/[0.05] transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A1A]/35 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>

        <span className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={p.img} alt="" className="w-6 h-6" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-medium text-[#1A1A1A]/85 truncate leading-snug">{row.title}</span>
            <span className="block text-[10px] font-medium truncate" style={{ color: '#2563EB' }}>
              <Copyable value={row.asin} kind="ASIN">{row.asin}</Copyable>
            </span>
            <span className="block text-[9px] text-[#1A1A1A]/35 truncate font-mono">
              <Copyable value={row.sku} kind="SKU">{row.sku}</Copyable>
            </span>
          </span>
        </span>

        <span className="leading-tight">
          <span className="block text-[10.5px] text-[#1A1A1A]/70">{row.label}</span>
          <span className="block text-[8.5px] text-[#1A1A1A]/35">{row.sub}</span>
        </span>

        <span className="text-right text-[12px] font-semibold tabular-nums text-[#1A1A1A]">{row.onHand.toLocaleString()}</span>
        <span className="text-right text-[12px] tabular-nums text-[#1A1A1A]/60">{row.forecast30.toLocaleString()}</span>

        <SupplyCell value={row.sup30} under={row.sup30 < THRESHOLD} />
        <SupplyCell value={row.sup90} under={row.sup90 < THRESHOLD} />

        <span className="text-right">
          {row.exempt ? (
            <span className="text-[10px] font-semibold leading-tight" style={{ color: C.green }}>
              Low volume<span className="block text-[8.5px] font-medium text-[#1A1A1A]/35">under {LOW_VOLUME} units/7d</span>
            </span>
          ) : row.charging ? (
            <span className="text-[13px] font-bold tabular-nums leading-tight" style={{ color: BRACKETS[row.bracket].color }}>
              {cents(row.perUnit)}
              <span className="block text-[8.5px] font-medium text-[#1A1A1A]/35">{BRACKETS[row.bracket].short} bracket</span>
            </span>
          ) : (
            <span className="text-[10px] font-semibold leading-tight" style={{ color: C.green }}>
              Not charged
              <span className="block text-[8.5px] font-medium text-[#1A1A1A]/35">
                {row.sup30 < THRESHOLD || row.sup90 < THRESHOLD
                  ? `only the ${row.sup30 < THRESHOLD ? '30d' : '90d'} window is under`
                  : `both windows over ${THRESHOLD}d`}
              </span>
            </span>
          )}
        </span>

        <span className="text-right text-[13px] font-bold tabular-nums"
          style={{ color: row.p90.fee >= 0.5 ? C.red : 'rgba(26,26,26,0.30)' }}>
          {row.p90.fee >= 0.5 ? usd(row.p90.fee) : '—'}
        </span>

        <span className="flex justify-end">
          {row.plan ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-right"
              style={{ color: C.green, backgroundColor: 'rgba(47,125,79,0.10)' }}>
              <Truck className="w-3 h-3 shrink-0" />
              <span className="leading-tight">
                Send {row.plan.units.toLocaleString()} by {fmtDate(row.sendBy)}
                <span className="block font-semibold text-[8.5px] text-[#1A1A1A]/45">saves {usd(row.plan.save)}</span>
              </span>
            </span>
          ) : (
            <span className="text-[10px] text-[#1A1A1A]/30">Nothing to do</span>
          )}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }} className="overflow-hidden">
            <Detail row={row} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LowInventoryFeeDemo() {
  const [open, setOpen] = useState('SHIRT-RED-M');

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: C.red }} />
          <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">Low-Inventory Fee Forecast</h4>
        </div>
        <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">
          Amazon charges a per-unit fee when a SKU’s historical days of supply falls below {THRESHOLD} days on both its
          30-day and 90-day windows. This is your exposure, and the send-in that removes it.
        </p>
      </div>

      <div className="px-5 pb-4">
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.16)' }}>
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide mb-2.5" style={{ color: '#2563EB' }}>
            <Info className="w-3.5 h-3.5" /> How to read these estimates
          </div>
          <ul className="space-y-2 text-[13.5px] leading-relaxed text-[#1A1A1A]/60">
            <li className="flex gap-2">
              <span className="shrink-0" style={{ color: '#2563EB' }}>•</span>
              Amazon bundles this fee into the FBA fulfilment fee and never itemises it, so what you were charged is
              reconstructed — each week’s decision replayed against your cover on the day, and that week’s units priced
              at the published rate. Amounts are pre-tax.
            </li>
            <li className="flex gap-2">
              <span className="shrink-0" style={{ color: '#2563EB' }}>•</span>
              The fee needs both windows under {THRESHOLD} days, not either one, and it doesn’t apply below{' '}
              {LOW_VOLUME} units a week. Rows that qualify for neither reason are shown rather than filtered out.
            </li>
            <li className="flex gap-2">
              <span className="shrink-0" style={{ color: '#2563EB' }}>•</span>
              Projections drain each SKU at its own velocity with your inbound POs and 3PL transfers landing on their
              dates — so a fee that a shipment already fixes doesn’t appear here.
            </li>
          </ul>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        {[
          { label: 'Charged, last 30d', value: usd(TOTAL.charged30), color: '#1A1A1A', sub: 'already paid, unitemised' },
          { label: 'Projected, next 30d', value: usd(TOTAL.next30), color: '#B45309', sub: 'if nothing changes' },
          { label: 'Projected, next 90d', value: usd(TOTAL.next90), color: C.red, sub: 'if nothing changes' },
          { label: 'SKUs at risk', value: `${TOTAL.atRisk} / ${CATALOG}`, color: '#1A1A1A', sub: 'under 28 days of cover' },
          { label: 'Avoidable', value: usd(TOTAL.save), color: C.green, sub: 'with the send-ins below' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="rounded-xl bg-white border border-[#1A1A1A]/8 px-3.5 py-3">
            <div className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]/40 whitespace-nowrap">{label}</div>
            <div className="font-clash font-semibold text-[22px] leading-none tracking-[-0.02em] mt-1.5" style={{ color }}>{value}</div>
            <div className="text-[8.5px] text-[#1A1A1A]/35 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[1040px]">
            <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span />
              <span>Product</span>
              <span>Size tier</span>
              <span className="text-right leading-tight">On<br />hand</span>
              <span className="text-right leading-tight">Forecast<br />(30d)</span>
              <span className="text-right leading-tight">30d<br />supply</span>
              <span className="text-right leading-tight">90d<br />supply</span>
              <span className="text-right leading-tight">Fee<br />/ unit</span>
              <span className="text-right leading-tight">Projected<br />90d</span>
              <span className="text-right">Action</span>
            </div>
            {VIEW.map(r => (
              <Row key={r.sku} row={r} open={open === r.sku} onToggle={() => setOpen(open === r.sku ? null : r.sku)} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#1A1A1A]/40">
          <Info className="w-3 h-3 shrink-0" /> Open any row for the bracket it falls in, the quarter replayed week by
          week, and the same quarter with the send-in applied.
        </div>
      </div>
    </div>
  );
}
