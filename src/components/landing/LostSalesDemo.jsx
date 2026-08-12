import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Info, Calendar, ChevronDown, AlertCircle, LineChart } from 'lucide-react';
import { C, ease } from './theme';
import { bySku } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   LostSalesDemo — "Lost Sales Analysis".

   Reconstructs every stockout in the seller's history and prices it,
   so the cost of getting restocking wrong stops being abstract.

   Expanding a row opens SALES HISTORY & STOCKOUT ANALYSIS: a year of
   daily units with the inventory state shaded behind it — red where
   the SKU was out of stock, amber where it was low, grey where we
   have no inventory record. Hovering any day gives the units sold,
   the baseline we'd have expected, and what that day cost in revenue
   and profit.

   That chart is the argument. The table says "$32,769 lost"; the
   chart shows you the eleven weeks of red that produced it, and the
   fact that the line goes flat inside every one of them.

   Everything is derived: missed units are days-out × baseline, lost
   revenue is missed units × price, profit loss applies the real fee
   model, and the headline tiles sum the rows. Nothing is typed twice.

   `interactive={false}` renders the same panel frozen on the 12-month
   view — no range switching, no expanding, no hover. That's how the
   landing page uses it: the number is the point there, and inviting
   someone to play with a chart mid-argument only costs them the
   thread. Playing with it is what /demo is for.
   ────────────────────────────────────────────────────────────── */

const FBA_FEE = 4.25;
const REFERRAL = 0.17;
const netPerUnit = (price, cogs) => price - cogs - (price * REFERRAL + FBA_FEE);

/* Inventory episodes across the 540-day spine, as [startDay, length].
   Written out rather than generated so each SKU's story is legible:
   the red tee sold out through Q4, the black cap died in March. */
const ROWS = [
  {
    key: 'tee-red', scale: 42.3,
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Red',
    asin: 'B0RDG7TEE1',
    thumb: bySku['SHIRT-RED-M'].img,
    skus: ['SHIRT-RED-M', 'SHIRT-RED-L'],
    price: 24.99, cogs: 3.90,
    nodata: [[0, 108]],
    low: [[126, 7], [210, 9], [268, 6], [300, 5], [395, 4], [470, 6], [521, 4]],
    none: [[146, 9], [240, 12], [330, 9], [420, 6], [497, 4], [533, 3]],
  },
  {
    key: 'cap-black', scale: 17.8,
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Black',
    asin: 'B0RDG4CAP2',
    thumb: bySku['HAT-BLK-OS'].img,
    skus: ['HAT-BLK-OS'],
    price: 18.99, cogs: 2.80,
    nodata: [[0, 88], [455, 14]],
    low: [[104, 6], [262, 7], [348, 6], [418, 5], [489, 6], [526, 3]],
    none: [[130, 8], [300, 11], [382, 7], [440, 4], [512, 5]],
  },
  {
    key: 'tee-blue', scale: 15.4,
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Blue',
    asin: 'B0RDG7TEE3',
    thumb: bySku['SHIRT-BLU-L'].img,
    skus: ['SHIRT-BLU-L', 'SHIRT-BLU-M'],
    price: 24.99, cogs: 3.90,
    nodata: [[0, 78]],
    low: [[94, 5], [268, 8], [340, 7], [432, 5], [503, 7]],
    none: [[116, 6], [295, 8], [462, 6], [528, 4]],
  },
  {
    key: 'cap-navy', scale: 6.9,
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Navy',
    asin: 'B0RDG4CAP4',
    thumb: bySku['HAT-NVY-OS'].img,
    skus: ['HAT-NVY-OS'],
    price: 18.99, cogs: 2.80,
    nodata: [[0, 62]],
    low: [[86, 4], [288, 6], [402, 6], [516, 5]],
    none: [[102, 4], [326, 5], [448, 4], [535, 2]],
  },
];

const DAYS = 540;                                // ~18 months of history
const START = new Date(2025, 1, 19);             // 19 Feb 2025 → 12 Aug 2026
const RANGES = [
  { key: 'All Time', days: DAYS },
  { key: '30D', days: 30 },
  { key: '90D', days: 90 },
  { key: '12M', days: 365 },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/* Q4 lift, matching the multipliers the forecasting demo uses. */
const SEASON = [0.85, 0.80, 0.85, 0.90, 0.95, 1.05, 1.15, 1.00, 1.05, 1.35, 1.65, 1.40];

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

const dayAt = (i) => {
  const d = new Date(START);
  d.setDate(d.getDate() + i);
  return d;
};

const expand = (spans) => {
  const out = new Set();
  spans.forEach(([from, len]) => { for (let i = 0; i < len; i++) out.add(from + i); });
  return out;
};

/* One series per SKU: daily units, the baseline we'd have expected,
   and the inventory state behind each day. */
function buildSeries(row) {
  const rand = seeded(row.key.length * 7919 + Math.round(row.scale * 100));
  const nodata = expand(row.nodata);
  const low = expand(row.low);
  const none = expand(row.none);

  return Array.from({ length: DAYS }, (_, i) => {
    const date = dayAt(i);
    const status = none.has(i) ? 'none' : low.has(i) ? 'low' : nodata.has(i) ? 'nodata' : 'ok';
    const ramp = 0.35 + 0.65 * Math.min(1, i / 200);          // the listing finding its feet
    const baseline = row.scale * SEASON[date.getMonth()] * ramp;
    const factor = status === 'none' ? 0 : status === 'low' ? 0.3 : 1;
    const units = Math.max(0, Math.round(baseline * factor * (1 + (rand() - 0.5) * 0.45)));
    return { i, date, status, baseline, units };
  });
}

/* Totals derive from whichever window is selected, so switching range
   recomputes the tiles, the row figures and the chart together —
   nothing on screen is a leftover from another period. */
function summarise(row, series) {
  const net = netPerUnit(row.price, row.cogs);
  let noStock = 0, lowStock = 0, missed = 0, revenue = 0, sold = 0, okDays = 0, base = 0;
  series.forEach(d => {
    base += d.baseline;
    if (d.status === 'none') { noStock++; missed += d.baseline; revenue += d.baseline * row.price; }
    else if (d.status === 'low') { lowStock++; missed += d.baseline * 0.7; revenue += d.baseline * 0.7 * row.price; }
    else if (d.status === 'ok') { sold += d.units; okDays++; }
  });
  return {
    series, net, noStock, lowStock,
    avgDaily: okDays ? sold / okDays : 0,
    baseline: base / series.length,
    missed: Math.round(missed),
    revenue: Math.round(revenue),
    profit: Math.round((revenue / row.price) * net),
  };
}

/* Built once over the full spine; windows are slices of it. */
const FULL = ROWS.map(r => ({ row: r, series: buildSeries(r) }));

function viewFor(days) {
  const rows = FULL.map(({ row, series }) => ({
    ...row,
    ...summarise(row, series.slice(DAYS - days)),
  }));
  const from = dayAt(DAYS - days), to = dayAt(DAYS - 1);
  return {
    rows,
    revenue: rows.reduce((n, r) => n + r.revenue, 0),
    missed: rows.reduce((n, r) => n + r.missed, 0),
    avgNo: (rows.reduce((n, r) => n + r.noStock, 0) / rows.length).toFixed(1),
    avgLow: (rows.reduce((n, r) => n + r.lowStock, 0) / rows.length).toFixed(1),
    short: `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}`,
    long: `${MONTHS[from.getMonth()]} ${from.getDate()}, ${from.getFullYear()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`,
  };
}

const VIEWS = Object.fromEntries(RANGES.map(r => [r.key, viewFor(r.days)]));

const BAND = {
  none: { fill: 'rgba(248,113,113,0.16)', dot: '#F87171', label: 'No stock' },
  low: { fill: 'rgba(250,204,21,0.20)', dot: '#FACC15', label: 'Low stock' },
  nodata: { fill: 'rgba(148,163,184,0.16)', dot: '#94A3B8', label: 'No inventory data' },
};

const money = (n) => `$${Math.round(n).toLocaleString()}`;
const GRID = 'grid grid-cols-[20px_minmax(0,1fr)_128px_74px_84px] items-center gap-3';

/* ─── the chart ─── */
const W = 1000, H = 210, PAD = { l: 30, r: 8, t: 12, b: 26 };

function StockoutChart({ row, label }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const { series } = row;
  const n = series.length;

  const max = Math.max(...series.map(d => d.units), 1);
  const top = Math.ceil(max / 7) * 7;
  const x = (k) => PAD.l + (n === 1 ? 0.5 : k / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b);

  /* contiguous runs of the same state, so each becomes one rect */
  const bands = [];
  series.forEach((d, k) => {
    const prev = bands[bands.length - 1];
    if (d.status === 'ok') return;
    if (prev && prev.status === d.status && prev.to === k - 1) prev.to = k;
    else bands.push({ status: d.status, from: k, to: k });
  });

  const line = series.map((d, k) => `${x(k)},${y(d.units)}`).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(top * f));
  const labelEvery = Math.max(1, Math.round(n / 20));

  const onMove = (e) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const rel = ((e.clientX - box.left) / box.width) * W;
    const k = Math.round(((rel - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(k >= 0 && k < n ? k : null);
  };

  const h = hover != null ? series[hover] : null;
  const lostRevenue = h ? (h.status === 'none' ? h.baseline * row.price : h.status === 'low' ? h.baseline * 0.7 * row.price : 0) : 0;
  const lostProfit = h ? (lostRevenue / row.price) * row.net : 0;

  return (
    <div className="bg-white rounded-xl border border-[#1A1A1A]/8 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-1.5">
          <LineChart className="w-3.5 h-3.5" style={{ color: C.indigo }} />
          <span className="text-[12px] font-bold text-[#1A1A1A]">Sales History &amp; Stockout Analysis</span>
        </span>
        <span className="text-[10px] text-[#1A1A1A]/40">{label}</span>
      </div>

      <div ref={ref} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
          aria-label={`Daily units for ${row.asin} with out-of-stock and low-stock periods shaded`}>
          {ticks.map(tk => (
            <g key={tk}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(tk)} y2={y(tk)} stroke="#1A1A1A" strokeOpacity="0.07" strokeDasharray="3 3" />
              <text x={PAD.l - 5} y={y(tk) + 3} textAnchor="end" fontSize="8.5" fill="#1A1A1A" fillOpacity="0.35">{tk}</text>
            </g>
          ))}

          {bands.map((b, k) => (
            <rect key={k} x={x(b.from)} width={Math.max(1.2, x(b.to) - x(b.from) + (W - PAD.l - PAD.r) / n)}
              y={PAD.t} height={H - PAD.t - PAD.b} fill={BAND[b.status].fill} />
          ))}

          {/* the baseline we'd have expected to sell */}
          <line x1={PAD.l} x2={W - PAD.r} y1={y(row.baseline)} y2={y(row.baseline)}
            stroke="#1A1A1A" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="4 4" />

          <polyline points={line} fill="none" stroke="#5B5BD6" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />

          {h && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#5B5BD6" strokeOpacity="0.5" strokeWidth="1" />
              <circle cx={x(hover)} cy={y(h.units)} r="3.5" fill="#5B5BD6" stroke="#fff" strokeWidth="1.5" />
            </g>
          )}

          {series.map((d, k) => (k % labelEvery === 0 ? (
            <text key={k} x={x(k)} y={H - PAD.b + 13} textAnchor="middle" fontSize="8" fill="#1A1A1A" fillOpacity="0.35">
              {MONTHS[d.date.getMonth()]} {d.date.getDate()}
            </text>
          ) : null))}
        </svg>

        {/* tooltip */}
        {h && (
          <div className="absolute top-2 pointer-events-none z-10"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n * 0.6 ? '-104%' : '12px'})` }}>
            <div className="rounded-xl bg-white border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 px-3.5 py-3 w-[228px]">
              <div className="text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/45 mb-1.5">
                {WEEKDAYS[h.date.getDay()]}, {MONTHS[h.date.getMonth()]} {h.date.getDate()}, {h.date.getFullYear()}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-clash font-semibold text-[22px] leading-none text-[#1A1A1A]">{h.units}</span>
                <span className="text-[11px] text-[#1A1A1A]/50">units sold</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1 mb-2">
                <span className="text-[12px] font-semibold italic text-[#1A1A1A]/70">{h.baseline.toFixed(1)}</span>
                <span className="text-[10px] text-[#1A1A1A]/40">expected baseline</span>
              </div>

              {h.status === 'ok' ? (
                <div className="rounded-md px-2 py-1.5 text-[10px] font-semibold"
                  style={{ backgroundColor: 'rgba(47,125,79,0.09)', color: C.green }}>
                  In stock — nothing lost
                </div>
              ) : h.status === 'nodata' ? (
                <div className="rounded-md px-2 py-1.5 text-[10px] font-semibold text-[#1A1A1A]/45"
                  style={{ backgroundColor: 'rgba(148,163,184,0.16)' }}>
                  No inventory record for this day
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-semibold"
                    style={h.status === 'none'
                      ? { backgroundColor: 'rgba(220,38,38,0.09)', color: C.red }
                      : { backgroundColor: 'rgba(245,158,11,0.16)', color: '#B45309' }}>
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {h.status === 'none' ? 'No stock' : 'Low stock'} — est. revenue loss {money(lostRevenue)}
                  </div>
                  <div className="mt-1 rounded-md px-2 py-1.5 text-[10px] font-semibold"
                    style={{ backgroundColor: 'rgba(47,125,79,0.09)', color: C.green }}>
                    Est. profit loss: {money(lostProfit)}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-2.5 pt-2.5 border-t border-[#1A1A1A]/6 text-[9.5px] font-medium text-[#1A1A1A]/45">
        {Object.values(BAND).map(b => (
          <span key={b.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.dot }} />{b.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          Expected baseline
        </span>
      </div>
    </div>
  );
}

function Row({ row, open, onToggle, label, interactive }) {
  const Tag = interactive ? 'button' : 'div';
  return (
    <div className={`border-b border-[#1A1A1A]/6 last:border-b-0 ${open ? 'bg-[#5B5BD6]/[0.03]' : ''}`}
      style={open ? { borderLeft: `3px solid ${C.indigo}` } : { borderLeft: '3px solid transparent' }}>
      <Tag {...(interactive ? { type: 'button', onClick: onToggle, 'aria-expanded': open } : {})}
        className={`${GRID} w-full px-4 py-3 text-left ${interactive ? 'hover:bg-[#1A1A1A]/[0.02] transition-colors' : ''}`}>
        {interactive
          ? <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A1A]/30 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          : <span />}

        <span className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={row.thumb} alt="" className="w-7 h-7" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11.5px] font-medium text-[#1A1A1A]/85 truncate">{row.title}</span>
            <span className="block text-[10px] font-medium truncate" style={{ color: '#2563EB' }}>
              {row.asin}
              <span className="text-[#1A1A1A]/35 font-normal"> · {row.skus.length} SKU{row.skus.length > 1 ? 's' : ''}</span>
            </span>
            <span className="block text-[9px] text-[#1A1A1A]/35 truncate font-mono">{row.skus.join('  ·  ')}</span>
          </span>
        </span>

        <span className="flex flex-col items-end gap-1">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
            style={{ color: C.red, backgroundColor: 'rgba(220,38,38,0.10)' }}>{row.noStock} NO STOCK</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
            style={{ color: '#B45309', backgroundColor: 'rgba(245,158,11,0.16)' }}>{row.lowStock} LOW STOCK</span>
        </span>

        <span className="text-right text-[12px] tabular-nums text-[#1A1A1A]/70">{row.avgDaily.toFixed(1)}</span>
        <span className="text-right text-[13px] font-semibold tabular-nums text-[#1A1A1A]">{money(row.revenue)}</span>
      </Tag>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <StockoutChart row={row} label={label} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({ children, className = '', style }) {
  return (
    <div className={`rounded-2xl px-5 py-6 flex flex-col items-center justify-center text-center ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function LostSalesDemo({ interactive = true }) {
  const [open, setOpen] = useState('tee-red');
  const [range, setRange] = useState('12M');
  const view = VIEWS[interactive ? range : '12M'];

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-clash font-semibold text-[19px] tracking-normal text-[#1A1A1A]">Lost Sales Analysis</h4>
            <Info className="w-3.5 h-3.5 text-[#1A1A1A]/25" />
          </div>
          <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Identify and recover revenue from out-of-stock events.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#1A1A1A]/10 p-0.5">
            {RANGES.map(({ key }) => {
              const on = interactive ? range === key : key === '12M';
              const Pill = interactive ? 'button' : 'span';
              return (
                <Pill key={key}
                  {...(interactive ? { type: 'button', onClick: () => setRange(key), 'aria-pressed': on } : {})}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold whitespace-nowrap transition-colors ${
                    on
                      ? 'border border-[#2F7D4F]/40 text-[#2F7D4F] bg-[#2F7D4F]/[0.06]'
                      : `text-[#1A1A1A]/45 ${interactive ? 'hover:text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/[0.04]' : ''}`
                  }`}>{key}</Pill>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white rounded-lg border border-[#2F7D4F]/30 px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: C.green }} />
            <span className="text-[10.5px] font-semibold" style={{ color: C.green }}>{view.long}</span>
          </div>
        </div>
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile className="text-white shadow-lg shadow-[#2F7D4F]/20"
          style={{ background: `linear-gradient(140deg, ${C.green} 0%, ${C.deep} 100%)` }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75 flex items-center gap-1.5">
            Total lost sales <Info className="w-3 h-3 opacity-60" />
          </span>
          <span className="font-clash font-semibold text-[38px] leading-none tracking-[-0.03em] mt-2">{money(view.revenue)}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[9.5px] font-bold uppercase tracking-wide">
            <TrendingUp className="w-3 h-3" /> Recoverable
          </span>
        </StatTile>

        <StatTile className="text-white shadow-lg shadow-[#F59E0B]/20"
          style={{ background: `linear-gradient(140deg, ${C.amberBright} 0%, #E07C00 100%)` }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 flex items-center gap-1.5">
            Missed units <Info className="w-3 h-3 opacity-60" />
          </span>
          <span className="font-clash font-semibold text-[38px] leading-none tracking-[-0.03em] mt-2">{view.missed.toLocaleString()}</span>
          <span className="mt-2 text-[9.5px] font-semibold uppercase tracking-wide text-white/75">Checkout opportunities</span>
        </StatTile>

        <StatTile className="bg-white border border-[#1A1A1A]/8 shadow-sm gap-3">
          <span className="rounded-full bg-[#1A1A1A]/[0.05] px-3 py-1 text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/50">
            Avg impact
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-clash font-semibold text-[26px] leading-none tracking-[-0.02em] text-[#1A1A1A]">{view.avgNo}</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">days</span>
          </div>
          <div className="-mt-2 flex items-center gap-1.5">
            <span className="w-4 h-[3px] rounded-full" style={{ backgroundColor: C.red }} />
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/45">Avg no stock</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-clash font-semibold text-[26px] leading-none tracking-[-0.02em] text-[#1A1A1A]">{view.avgLow}</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">days</span>
          </div>
          <div className="-mt-2 flex items-center gap-1.5">
            <span className="w-4 h-[3px] rounded-full" style={{ backgroundColor: C.amber }} />
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/45">Avg low stock</span>
          </div>
        </StatTile>
      </div>

      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#1A1A1A]/10 px-3 py-2 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#1A1A1A]/30" />
          <span className="text-[11.5px] text-[#1A1A1A]/35">Search by ASIN or SKU…</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className={`${GRID} px-4 py-2.5 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span />
              <span>ASIN</span>
              <span className="text-right leading-tight">Days out<br />of stock</span>
              <span className="text-right leading-tight">Avg daily<br />sales</span>
              <span className="text-right leading-tight">Lost<br />sales</span>
            </div>
            {view.rows.map(r => (
              <Row key={r.key} row={r} label={view.short} interactive={interactive}
                open={interactive && open === r.key} onToggle={() => setOpen(open === r.key ? null : r.key)} />
            ))}
          </div>
        </div>
        <p className="mt-2.5 text-[10px] text-[#1A1A1A]/40">
          {interactive
            ? 'Open any product to see the year behind the number — hover a day for what it cost.'
            : 'Twelve months on one seller’s account. The day-by-day breakdown is in the demo.'}
        </p>
      </div>
    </div>
  );
}
