import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Info, ArrowRight, AlertTriangle, TrendingDown, ChevronDown, ShieldCheck } from 'lucide-react';
import { C, ease } from './theme';
import { bySku, LEAD, LEAD_LEGS } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   LostSalesForecastDemo — "Lost Sales Analysis 2".

   The same product table and the same Sales History & Stockout
   Analysis chart as the first version — but the spine doesn't stop at
   today. Open any product and the line keeps going: forecast demand
   run against the stock actually on hand and the PO actually on the
   water, with the next stockout shaded in the same red as the ones
   behind it.

   The point of the second version: a stockout report is a bill you
   can't pay. The same reconstruction pointed forwards is one you can
   still argue with, and it's the same chart either side of the Today
   line — which is the argument for why the two belong together.

   Nothing here is a mood. Stock depletes at the forecast rate, the
   replenishment lands lead-time days after the PO goes out, and every
   day in between is a day of demand with nothing to sell. The
   arithmetic reconciles with the restock board on purpose: 380 units
   at 42.3/day is the 9 days of cover it flags on the red tee, and
   25 + 45 + 7 is the lead time everywhere else on the site.

   The navy cap is here to not be on fire. A screen that paints every
   SKU red is a screen nobody believes twice — it has 130 days of
   cover, the forecast finds nothing, and the row says so.
   ────────────────────────────────────────────────────────────── */

const FBA_FEE = 4.25;
const REFERRAL = 0.17;
const netPerUnit = (price, cogs) => price - cogs - (price * REFERRAL + FBA_FEE);

/* Where the seller stands today, straight off the restock board:
   on-hand counts, and for each one the PO that hasn't been placed. */
const TODAY = new Date(2026, 7, 12);             // 12 Aug 2026
const LEAD_DAYS = LEAD.production + LEAD.freight + LEAD.checkin;   // 77

/* Nine months back and a hundred forward. Long enough to show the
   pattern, short enough that the forecast isn't buried behind a minute
   of scrolling. */
const HIST_DAYS = 270;
const FCST_DAYS = 100;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/* Q4 lift, matching the multipliers the forecasting demo uses. */
const SEASON = [0.85, 0.80, 0.85, 0.90, 0.95, 1.05, 1.15, 1.00, 1.05, 1.35, 1.65, 1.40];
const Q4_FROM = new Date(2026, 9, 12);
const Q4_LIFT = 1.6;

const SKUS = [
  {
    key: 'tee-red', asin: 'B0RDG7TEE1', sku: 'SHIRT-RED-M', skus: ['SHIRT-RED-M', 'SHIRT-RED-L'],
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Red',
    base: 42.3, price: 24.99, onHand: 380, po: { ref: 'SHIRT#191', qty: 1200 },
    out: [[24, 11], [104, 9], [178, 6], [241, 5]],
    low: [[4, 8], [72, 6], [146, 5], [206, 6], [262, 4]],
  },
  {
    key: 'cap-black', asin: 'B0RDG4CAP2', sku: 'HAT-BLK-OS', skus: ['HAT-BLK-OS'],
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Black',
    base: 17.8, price: 18.99, onHand: 554, po: { ref: 'HAT#22', qty: 800 },
    out: [[52, 9], [141, 8], [228, 6]],
    low: [[18, 6], [96, 5], [190, 7], [252, 5]],
  },
  {
    key: 'tee-blue', asin: 'B0RDG7TEE3', sku: 'SHIRT-BLU-L', skus: ['SHIRT-BLU-L', 'SHIRT-BLU-M'],
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Blue',
    base: 15.4, price: 24.99, onHand: 563, po: { ref: 'SHIRT#192', qty: 800 },
    out: [[38, 7], [160, 6], [236, 4]],
    low: [[10, 5], [88, 6], [198, 5], [258, 4]],
  },
  {
    key: 'cap-navy', asin: 'B0RDG4CAP4', sku: 'HAT-NVY-OS', skus: ['HAT-NVY-OS'],
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Navy',
    base: 6.9, price: 18.99, onHand: 900, po: { ref: 'HAT#23', qty: 600 },
    out: [[64, 5], [204, 4]],
    low: [[30, 4], [150, 5]],
  },
];

const money = (n) => `$${Math.round(n).toLocaleString()}`;
const dateOf = (offset) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d;
};
const label = (d) => (d ? `${MONTHS[d.getMonth()]} ${d.getDate()}` : '');

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

const expand = (spans) => {
  const out = new Set();
  spans.forEach(([from, len]) => { for (let i = 0; i < len; i++) out.add(from + i); });
  return out;
};

/* ─── the past: the nine months behind today ─── */
function buildHistory(spec) {
  const rand = seeded(spec.key.length * 7919 + Math.round(spec.base * 100));
  const out = expand(spec.out);
  const low = expand(spec.low);

  return Array.from({ length: HIST_DAYS }, (_, k) => {
    const date = dateOf(k - HIST_DAYS);
    const status = out.has(k) ? 'none' : low.has(k) ? 'low' : 'ok';
    const baseline = spec.base * SEASON[date.getMonth()];
    const factor = status === 'none' ? 0 : status === 'low' ? 0.3 : 1;
    return {
      k, date, status, baseline,
      units: Math.max(0, Math.round(baseline * factor * (1 + (rand() - 0.5) * 0.4))),
    };
  });
}

/* ─── the future: forecast demand run against projected inventory ───
   The projection stops counting shortfall the moment the PO lands. Run
   past that and the replenishment empties again inside a few weeks
   against a Q4 baseline — but that second hole is the next PO's job,
   and counting it here would price a decision this screen isn't
   about. */
function buildForecast(spec, orderOffset) {
  const arrival = orderOffset + LEAD_DAYS;
  let stock = spec.onHand;

  return Array.from({ length: FCST_DAYS }, (_, i) => {
    const date = dateOf(i);
    /* Q4 REPLACES the monthly curve rather than stacking on top of it —
       SEASON already carries a Q4 shape, so multiplying the lift into it
       priced October at 2.16× base. */
    const demand = spec.base * (date >= Q4_FROM ? Q4_LIFT : SEASON[date.getMonth()]);
    const landed = i >= arrival;
    if (i === arrival) stock += spec.po.qty;
    const sold = landed ? demand : Math.min(stock, demand);
    stock = Math.max(0, stock - demand);
    return { k: HIST_DAYS + i, date, demand, sold, lost: demand - sold, arrival: i === arrival };
  });
}

const summarise = (days, spec) => {
  const units = days.reduce((n, d) => n + d.lost, 0);
  return {
    oos: days.filter(d => d.lost > 0).length,
    units: Math.round(units),
    revenue: units * spec.price,
    profit: units * netPerUnit(spec.price, spec.cogs ?? bySku[spec.sku].cogs),
  };
};

/* ─── chart geometry ───
   Rendered at natural width and scrolled rather than fitted to the
   panel: squeezing 370 days into 1,000px is what makes a stockout look
   like a smudge. */
const W = 1560, H = 250;
const PAD = { l: 34, r: 14, t: 16, b: 30 };
const N = HIST_DAYS + FCST_DAYS;
const PLOT = W - PAD.l - PAD.r;
const x = (k) => PAD.l + (k / (N - 1)) * PLOT;

const BAND = { none: 'rgba(248,113,113,0.16)', low: 'rgba(250,204,21,0.20)' };

/* contiguous runs of one state become one rect */
function runs(days, of) {
  const out = [];
  days.forEach(d => {
    const status = of(d);
    const prev = out[out.length - 1];
    if (status === 'ok') return;
    if (prev && prev.status === status && prev.to === d.k - 1) prev.to = d.k;
    else out.push({ status, from: d.k, to: d.k });
  });
  return out;
}

function build(spec) {
  const cogs = bySku[spec.sku].cogs;
  const row = { ...spec, cogs };
  const history = buildHistory(spec);
  const forecast = buildForecast(row, 0);
  const ahead = summarise(forecast, row);
  const later = summarise(buildForecast(row, 7), row);

  const outDays = history.filter(d => d.status === 'none');
  const lowDays = history.filter(d => d.status === 'low');
  const behindUnits = outDays.reduce((n, d) => n + d.baseline, 0) + lowDays.reduce((n, d) => n + d.baseline * 0.7, 0);

  const top = Math.ceil(Math.max(...history.map(d => d.units), ...forecast.map(d => d.demand)) / 10) * 10;
  const y = (v) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b);
  const arrivalAt = forecast.findIndex(d => d.arrival);
  const stockoutAt = forecast.findIndex(d => d.lost > 0);

  return {
    row, history, forecast, ahead, top, y, arrivalAt, stockoutAt,
    weekCost: later.revenue - ahead.revenue,
    behind: { oos: outDays.length, units: Math.round(behindUnits), revenue: behindUnits * spec.price },
    stockoutDate: stockoutAt >= 0 ? forecast[stockoutAt].date : null,
    arrivalDate: arrivalAt >= 0 ? forecast[arrivalAt].date : null,
    histBands: runs(history, d => d.status),
    fcstBands: runs(forecast, d => (d.lost > 0 ? 'none' : 'ok')),
    histLine: history.map(d => `${x(d.k)},${y(d.units)}`).join(' '),
    fcstDemand: forecast.map(d => `${x(d.k)},${y(d.demand)}`).join(' '),
    fcstSold: forecast.map(d => `${x(d.k)},${y(d.sold)}`).join(' '),
    lostArea: `${forecast.map(d => `${x(d.k)},${y(d.demand)}`).join(' ')} ${[...forecast].reverse().map(d => `${x(d.k)},${y(d.sold)}`).join(' ')}`,
    monthTicks: [...history, ...forecast].filter(d => d.date.getDate() === 1),
  };
}

const MODEL = SKUS.map(build);
const TOTAL = {
  behind: MODEL.reduce((n, m) => n + m.behind.revenue, 0),
  ahead: MODEL.reduce((n, m) => n + m.ahead.revenue, 0),
  week: MODEL.reduce((n, m) => n + m.weekCost, 0),
  atRisk: MODEL.filter(m => m.ahead.oos > 0).length,
};
const RANGE = `${label(dateOf(-HIST_DAYS))}, 2025 – ${label(dateOf(FCST_DAYS - 1))}, 2026`;

function Tile({ label: text, value, sub, tone, icon: Icon, tint }) {
  return (
    <div className="rounded-xl px-3.5 py-3 border"
      style={{ backgroundColor: tint ?? '#FFFFFF', borderColor: tone ? `${tone}40` : 'rgba(26,26,26,0.08)' }}>
      <div className="flex items-center gap-1 mb-1.5">
        {Icon && <Icon className="w-3 h-3 shrink-0" style={{ color: tone }} />}
        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
          style={{ color: tone ?? 'rgba(26,26,26,0.40)' }}>{text}</span>
      </div>
      <div className="font-clash font-semibold text-[22px] leading-none tracking-[-0.02em]"
        style={{ color: tone ?? '#1A1A1A' }}>{value}</div>
      <div className="text-[8.5px] text-[#1A1A1A]/35 mt-1">{sub}</div>
    </div>
  );
}

/* ─── one product's chart, past and future on one spine ─── */
function Chart({ m, interactive }) {
  const scroller = useRef(null);
  /* the nudge retires once the forecast is actually on screen, rather
     than nagging over the top of it */
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = (e) => {
    const el = e.currentTarget;
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 24);
  };
  const jump = () => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  };

  const { row, y, top } = m;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(top * f));

  return (
    <div className="bg-white rounded-xl border border-[#1A1A1A]/8 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-1.5">
          <LineChart className="w-3.5 h-3.5" style={{ color: C.indigo }} />
          <span className="text-[12px] font-bold text-[#1A1A1A]">Sales History &amp; Stockout Analysis</span>
        </span>
        <span className="text-[10px] text-[#1A1A1A]/40">{RANGE} · forecast past {label(TODAY)}</span>
      </div>

      <div className="relative">
        <div ref={scroller} onScroll={onScroll} className={`overflow-x-auto ${interactive ? '' : 'pointer-events-none'}`}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`Daily units for ${row.asin} over the past nine months and forecast for the next ${FCST_DAYS} days, with out-of-stock periods shaded`}>
            {ticks.map(tk => (
              <g key={tk}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(tk)} y2={y(tk)} stroke="#1A1A1A" strokeOpacity="0.07" strokeDasharray="3 3" />
                <text x={PAD.l - 6} y={y(tk) + 3} textAnchor="end" fontSize="8.5" fill="#1A1A1A" fillOpacity="0.35">{tk}</text>
              </g>
            ))}

            {/* the forecast half sits on its own tint, so "past" and
                "projected" never have to be told apart by memory */}
            <rect x={x(HIST_DAYS)} y={PAD.t} width={W - PAD.r - x(HIST_DAYS)} height={H - PAD.t - PAD.b}
              fill="rgba(91,91,214,0.035)" />

            {m.histBands.map((b, k) => (
              <rect key={`h${k}`} x={x(b.from)} width={Math.max(1.2, x(b.to) - x(b.from) + PLOT / N)}
                y={PAD.t} height={H - PAD.t - PAD.b} fill={BAND[b.status]} />
            ))}
            {m.fcstBands.map((b, k) => (
              <rect key={`f${k}`} x={x(b.from)} width={Math.max(1.2, x(b.to) - x(b.from) + PLOT / N)}
                y={PAD.t} height={H - PAD.t - PAD.b} fill={BAND.none} />
            ))}

            <polygon points={m.lostArea} fill="rgba(220,38,38,0.18)" />

            <polyline points={m.histLine} fill="none" stroke={C.indigo} strokeWidth="1.4" strokeLinejoin="round" />
            <polyline points={m.fcstDemand} fill="none" stroke={C.red} strokeWidth="1.6" strokeDasharray="5 4" strokeLinejoin="round" />
            <polyline points={m.fcstSold} fill="none" stroke={C.green} strokeWidth="1.6" strokeLinejoin="round" />

            <line x1={x(HIST_DAYS)} x2={x(HIST_DAYS)} y1={PAD.t - 6} y2={H - PAD.b}
              stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x={x(HIST_DAYS) + 6} y={PAD.t + 2} fontSize="9.5" fontWeight="700" fill="#1A1A1A" fillOpacity="0.6">
              TODAY · {label(TODAY)}
            </text>

            {m.stockoutAt >= 0 ? (
              <>
                <text x={x(HIST_DAYS + m.stockoutAt) + 5} y={PAD.t + 20} fontSize="9.5" fontWeight="700" fill={C.red}>
                  Out of stock {label(m.stockoutDate)}
                </text>
                <text x={x(HIST_DAYS) + 8} y={y(top * 0.6)} fontSize="11" fontWeight="700" fill={C.red} fillOpacity="0.85">
                  {money(m.ahead.revenue)} of demand
                </text>
                <text x={x(HIST_DAYS) + 8} y={y(top * 0.6) + 13} fontSize="11" fontWeight="700" fill={C.red} fillOpacity="0.85">
                  with nothing to sell
                </text>
                <line x1={x(HIST_DAYS + m.arrivalAt)} x2={x(HIST_DAYS + m.arrivalAt)} y1={PAD.t} y2={H - PAD.b}
                  stroke={C.green} strokeOpacity="0.7" strokeWidth="1.2" />
                {/* anchored left of its own line — the arrival sits near
                    the end of the spine and a label hung off the right of
                    it runs out of chart */}
                <text x={x(HIST_DAYS + m.arrivalAt) - 6} y={H - PAD.b - 8} textAnchor="end"
                  fontSize="9.5" fontWeight="700" fill={C.green}>
                  PO {row.po.ref} lands {label(m.arrivalDate)}
                </text>
              </>
            ) : (
              <text x={x(HIST_DAYS) + 8} y={y(top * 0.6)} fontSize="11" fontWeight="700" fill={C.green}>
                Covered through {label(dateOf(FCST_DAYS - 1))} — no projected stockout
              </text>
            )}

            {m.monthTicks.map(d => (
              <text key={d.k} x={x(d.k)} y={H - PAD.b + 14} textAnchor="middle" fontSize="8" fill="#1A1A1A" fillOpacity="0.35">
                {MONTHS[d.date.getMonth()]}
              </text>
            ))}
          </svg>
        </div>

        {/* the invitation, over the right edge until the forecast is on screen */}
        {!atEnd && (
          <div className="absolute inset-y-0 right-0 w-40 flex items-center justify-end pr-1 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.92) 55%)' }}>
            <motion.button type="button" onClick={jump} disabled={!interactive}
              animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-auto flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10.5px] font-bold text-white shadow-md"
              style={{ backgroundColor: m.ahead.oos > 0 ? C.red : C.green }}>
              What&rsquo;s coming <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
        {[
          { c: C.indigo, t: 'Units sold' },
          { c: C.red, t: 'Forecast demand', dash: true },
          { c: C.green, t: 'What you can actually ship' },
          { c: 'rgba(248,113,113,0.5)', t: 'Out of stock', block: true },
        ].map(({ c, t: text, dash, block }) => (
          <span key={text} className="flex items-center gap-1.5 text-[9px] text-[#1A1A1A]/45">
            <span className={block ? 'w-3 h-2.5 rounded-sm' : 'w-4 h-0'}
              style={block ? { backgroundColor: c } : { borderTop: `2px ${dash ? 'dashed' : 'solid'} ${c}` }} />
            {text}
          </span>
        ))}
      </div>

      {m.ahead.oos > 0 ? (
        <div className="mt-3 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
          style={{ backgroundColor: '#F5ECEE', border: '1px solid #F0C4C5' }}>
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.red }} />
          <p className="text-[10.5px] leading-relaxed text-[#1A1A1A]/70">
            <span className="font-bold text-[#1A1A1A]">
              {row.onHand} units left, and {m.ahead.oos} days out of stock before the next delivery.
            </span>{' '}
            At {row.base}/day you run out on {label(m.stockoutDate)}; place PO {row.po.ref} today and it still
            can&rsquo;t land before {label(m.arrivalDate)} — {LEAD_LEGS}. Most of that gap is already spent. What
            isn&rsquo;t is the waiting: every week the PO sits unplaced adds{' '}
            <span className="font-bold" style={{ color: C.red }}>{money(m.weekCost)}</span> to it.
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
          style={{ backgroundColor: 'rgba(47,125,79,0.06)', border: '1px solid rgba(47,125,79,0.20)' }}>
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.green }} />
          <p className="text-[10.5px] leading-relaxed text-[#1A1A1A]/70">
            <span className="font-bold text-[#1A1A1A]">Nothing to do here.</span>{' '}
            {row.onHand} units at {row.base}/day covers the whole forecast window, Q4 multiplier included. PO{' '}
            {row.po.ref} isn&rsquo;t due for months. The row is in the table so you can see the forecast found
            nothing — not because it wasn&rsquo;t looked at.
          </p>
        </div>
      )}
    </div>
  );
}

/* The past column carries over from the first version of this screen —
   days out of stock behind you, and what they cost. It's the column
   that made that panel worth reading, and hiding this one behind a
   second screen was the only reason to have two. */
const GRID = 'grid grid-cols-[20px_minmax(0,1fr)_108px_86px_56px_92px] items-center gap-3';

function Row({ m, open, onToggle, interactive }) {
  const { row } = m;
  const oos = m.ahead.oos > 0;

  return (
    <div className="border-b border-[#1A1A1A]/6 last:border-b-0">
      <div className={`${GRID} px-4 py-3`}>
        <button type="button" onClick={interactive ? onToggle : undefined} aria-expanded={open}
          disabled={!interactive} tabIndex={interactive ? undefined : -1}
          aria-label={`Show the forecast for ${row.asin}`}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
            interactive ? 'hover:bg-[#1A1A1A]/[0.05]' : 'cursor-default'
          }`}>
          <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A1A]/35 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>

        <span className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={bySku[row.sku].img} alt="" className="w-6 h-6" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11.5px] font-semibold text-[#1A1A1A]/85 truncate">{row.title}</span>
            <span className="block text-[9.5px] text-[#1A1A1A]/40 truncate">
              <span style={{ color: C.indigo }}>{row.asin}</span> · {row.skus.join(' · ')}
            </span>
          </span>
        </span>

        {/* what the forecast found, not what the last year did — the
            past is the other panel's column */}
        <span className="flex justify-end">
          {oos ? (
            <span className="px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap"
              style={{ color: C.red, backgroundColor: 'rgba(220,38,38,0.10)' }}>
              {m.ahead.oos} DAYS OOS
            </span>
          ) : (
            <span className="px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap"
              style={{ color: C.green, backgroundColor: 'rgba(47,125,79,0.10)' }}>
              COVERED
            </span>
          )}
        </span>

        {/* what already happened, from the same history the chart draws */}
        <span className="text-right leading-tight">
          <span className="block text-[12px] font-semibold tabular-nums text-[#1A1A1A]/75">
            {m.behind.oos} days
          </span>
          <span className="block text-[8.5px] tabular-nums text-[#1A1A1A]/35">{money(m.behind.revenue)} lost</span>
        </span>

        <span className="text-right text-[13px] font-bold tabular-nums text-[#1A1A1A]/85">{row.base}</span>

        <span className="text-right leading-tight">
          <span className="block text-[13px] font-bold tabular-nums" style={{ color: oos ? C.red : 'rgba(26,26,26,0.35)' }}>
            {oos ? money(m.ahead.revenue) : '—'}
          </span>
          <span className="block text-[8.5px] text-[#1A1A1A]/35">
            {oos ? `from ${label(m.stockoutDate)}` : 'nothing projected'}
          </span>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }} className="overflow-hidden">
            <div className="px-3 pb-3">
              <Chart m={m} interactive={interactive} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LostSalesForecastDemo({ interactive = true }) {
  const [open, setOpen] = useState('tee-red');
  const openKey = interactive ? open : 'tee-red';

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4">
        {/* No longer "2" — this is the lost-sales screen now, and the
            history-only version it grew out of is off the page. */}
        <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">
          Lost Sales Analysis
        </h4>
        <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">
          Every stockout priced — the ones behind you, and the one ahead while there&rsquo;s still something to do about it.
        </p>
      </div>

      {/* behind and ahead, side by side: the whole argument of the panel
          is that these are the same number pointed opposite ways */}
      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Tile label="Lost · last 9 months" value={money(TOTAL.behind)} sub="already spent · across 4 products" />
        <Tile label="Forecast loss · ahead" value={money(TOTAL.ahead)} tone={C.red} icon={TrendingDown} tint="#FDF5F5"
          sub={`before each PO lands`} />
        <Tile label="Products going OOS" value={`${TOTAL.atRisk} of ${MODEL.length}`} tone={C.red} tint="#FDF5F5"
          sub="inside the forecast window" />
        <Tile label="Every week you wait" value={`+${money(TOTAL.week)}`} tone="#B45309" tint="#FDF8EF"
          icon={ArrowRight} sub="added to the same gaps" />
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8">
          <div className={`${GRID} px-4 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
            <span />
            <span>Product</span>
            <span className="text-right">Forecast</span>
            <span className="text-right leading-tight">OOS<br />last 9 months</span>
            <span className="text-right">Velocity</span>
            <span className="text-right">Loss ahead</span>
          </div>
          {MODEL.map(m => (
            <Row key={m.row.key} m={m} interactive={interactive}
              open={openKey === m.row.key}
              onToggle={() => setOpen(open === m.row.key ? null : m.row.key)} />
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#1A1A1A]/40">
          <Info className="w-3 h-3" /> Open any product for its chart, then scroll it past Today. Forecast demand is each SKU&rsquo;s baseline with the same Q4 multiplier the forecasting screen uses — everything right of Today is projected, not history.
        </div>
      </div>
    </div>
  );
}
