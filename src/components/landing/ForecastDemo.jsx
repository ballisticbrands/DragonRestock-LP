import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, AlertCircle, Info } from 'lucide-react';
import { C, ease } from './theme';
import { bySku } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   ForecastDemo — one restock row, zoomed in, with its reasoning open.

   The argument: a Prime Day spike is an event, not demand. The row's
   inline sparkline shows the spike; opening the chart shows the whole
   history with the Prime Day window shaded and labelled EXCLUDED, and
   the forecast running on past it without replicating it.

   The sales history is generated once from a seeded model rather than
   hand-typed: a growing baseline, month-of-year seasonality, a Q4
   lift, ±12% noise, and a ×3.2 multiplier over Jul 23–26 2026. The
   forecast half runs the same model with the Prime Day term removed
   and the noise damped — which is exactly the claim the copy makes,
   so the picture can't contradict the words.

   Daily / Weekly / Monthly are three aggregations of that one daily
   series, so the three views always agree with each other.
   ────────────────────────────────────────────────────────────── */

const SKU = 'SHIRT-RED-M';
const START = new Date(2025, 7, 4);        // Mon 4 Aug 2025
const TODAY = 372;                          // days from START to 11 Aug 2026
const HORIZON = 560;                        // through ~mid Feb 2027
const PRIME_FROM = 353, PRIME_TO = 356;     // 23–26 Jul 2026

const MONTH_SEASON = [0.90, 0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.00, 1.05, 1.30, 1.60, 1.40];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Deterministic noise — the chart must render identically every time. */
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

function addDays(n) {
  const d = new Date(START);
  d.setDate(d.getDate() + n);
  return d;
}

/* One daily series for the whole window. Past and future come from the
   same model; the future simply drops the Prime Day term. */
const DAILY = (() => {
  const rand = seeded(20260811);
  const out = [];
  for (let i = 0; i < HORIZON; i++) {
    const d = addDays(i);
    const future = i > TODAY;
    const base = 30 + (i / HORIZON) * 14;                       // gentle growth
    const season = MONTH_SEASON[d.getMonth()];
    const noise = future ? 1 + (rand() - 0.5) * 0.10 : 1 + (rand() - 0.5) * 0.24;
    const prime = !future && i >= PRIME_FROM && i <= PRIME_TO ? 3.2 : 1;
    out.push({ i, date: d, future, v: Math.max(0, Math.round(base * season * noise * prime)) });
  }
  return out;
})();

const fmtDay = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
const fmtMonth = (d) => `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

/* Aggregations. Each returns { label, v, future, prime } buckets. */
function aggregate(mode) {
  if (mode === 'Daily') {
    const from = TODAY - 89, to = TODAY + 60;
    return DAILY.filter(d => d.i >= from && d.i <= to).map(d => ({
      label: fmtDay(d.date), v: d.v, future: d.future,
      prime: d.i >= PRIME_FROM && d.i <= PRIME_TO,
    }));
  }
  if (mode === 'Weekly') {
    const out = [];
    for (let i = 0; i + 7 <= HORIZON; i += 7) {
      const week = DAILY.slice(i, i + 7);
      out.push({
        label: fmtDay(week[0].date),
        v: week.reduce((n, d) => n + d.v, 0),
        future: week[0].i > TODAY,
        prime: week.some(d => d.i >= PRIME_FROM && d.i <= PRIME_TO),
      });
    }
    return out;
  }
  const byMonth = new Map();
  DAILY.forEach(d => {
    const k = `${d.date.getFullYear()}-${d.date.getMonth()}`;
    const cur = byMonth.get(k) ?? { label: fmtMonth(d.date), v: 0, future: d.future, prime: false };
    cur.v += d.v;
    cur.prime = cur.prime || (d.i >= PRIME_FROM && d.i <= PRIME_TO);
    byMonth.set(k, cur);
  });
  return [...byMonth.values()];
}

/* ─── the chart ─── */
const W = 900, H = 230, PAD = { l: 38, r: 10, t: 14, b: 34 };

function Chart({ mode }) {
  const data = useMemo(() => aggregate(mode), [mode]);
  const max = Math.max(...data.map(d => d.v));
  const step = Math.pow(10, Math.floor(Math.log10(max))) / 2;
  const top = Math.ceil(max / step) * step;

  const x = (i) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b);

  const lastPast = data.reduce((n, d, i) => (d.future ? n : i), 0);
  const pts = (from, to) => data.slice(from, to + 1).map((d, k) => `${x(from + k)},${y(d.v)}`).join(' ');

  const primeIdx = data.map((d, i) => (d.prime ? i : -1)).filter(i => i >= 0);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(top * f));
  const labelEvery = Math.ceil(data.length / 9);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
      aria-label={`${mode} sales history for ${SKU}, with the Prime Day window excluded from the forecast baseline`}>
      {/* gridlines */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#1A1A1A" strokeOpacity="0.07" strokeWidth="1" />
          <text x={PAD.l - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#1A1A1A" fillOpacity="0.35">{t}</text>
        </g>
      ))}

      {/* Prime Day window — the whole point of the picture */}
      {primeIdx.length > 0 && (
        <g>
          <rect
            x={x(primeIdx[0]) - 3} width={Math.max(8, x(primeIdx[primeIdx.length - 1]) - x(primeIdx[0]) + 6)}
            y={PAD.t} height={H - PAD.t - PAD.b}
            fill={C.amberBright} fillOpacity="0.14" stroke={C.amberBright} strokeOpacity="0.35" strokeWidth="1"
          />
          <text x={x(primeIdx[0])} y={PAD.t - 4} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#B45309">
            PRIME DAY · EXCLUDED
          </text>
        </g>
      )}

      {/* today divider */}
      <line x1={x(lastPast)} x2={x(lastPast)} y1={PAD.t} y2={H - PAD.b} stroke="#1A1A1A" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 3" />

      {/* past · solid */}
      <polyline points={pts(0, lastPast)} fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {/* forecast · dotted, carrying on without the spike */}
      <polyline points={pts(lastPast, data.length - 1)} fill="none" stroke={C.green} strokeWidth="1.8" strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />

      {/* x labels */}
      {data.map((d, i) => (i % labelEvery === 0 ? (
        <text key={i} x={x(i)} y={H - PAD.b + 14} textAnchor="middle" fontSize="8.5" fill="#1A1A1A" fillOpacity="0.35">{d.label}</text>
      ) : null))}
    </svg>
  );
}

/* ─── inline sparkline, the thing you click ─── */
const SPARK_WEEKS = aggregate('Weekly').filter(d => !d.future).slice(-26);

function SpikeSpark() {
  const week = SPARK_WEEKS;
  const w = 88, h = 26;
  const max = Math.max(...week.map(d => d.v));
  const pts = week.map((d, i) => `${(i / (week.length - 1)) * w},${h - (d.v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function ForecastDemo() {
  const [chartOpen, setChartOpen] = useState(true);
  const [mode, setMode] = useState('Weekly');
  const p = bySku[SKU];

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      {/* the zoomed-in restock row */}
      <div className="bg-white px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-[#1A1A1A]/8">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-12 h-12 rounded-xl bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={p.img} alt="" className="w-8 h-8" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#1A1A1A]">{SKU}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ color: C.red, backgroundColor: 'rgba(220,38,38,0.10)' }}>
                <AlertCircle className="w-2.5 h-2.5" />Critical
              </span>
            </span>
            <span className="block text-[11px] text-[#1A1A1A]/45">{p.name} · Lianfa Textiles</span>
          </span>
        </div>

        <span className="rounded-lg px-3.5 py-2 text-center leading-tight text-white shadow-sm" style={{ backgroundColor: C.green }}>
          <span className="block text-[12px] font-bold">Order 1,200</span>
          <span className="block text-[10px] font-medium text-white/80">by Aug 11</span>
        </span>

        <span className="text-center">
          <span className="block text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">Days until S.O.</span>
          <span className="block text-[24px] font-bold tabular-nums leading-none mt-1" style={{ color: C.red }}>9</span>
        </span>

        {/* the sparkline is the control */}
        <button type="button" onClick={() => setChartOpen(v => !v)} aria-expanded={chartOpen}
          className="ml-auto flex items-center gap-3 rounded-xl border border-[#1A1A1A]/10 bg-white px-3 py-2 hover:border-[#2563EB]/40 hover:bg-[#2563EB]/[0.03] transition-colors">
          <span className="text-right">
            <span className="block text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">Velocity</span>
            <span className="block text-[20px] font-bold tabular-nums leading-none text-[#1A1A1A]">42.3</span>
          </span>
          <SpikeSpark />
          <ChevronDown className={`w-4 h-4 text-[#1A1A1A]/35 transition-transform duration-300 ${chartOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* the AI explanation */}
      <div className="px-5 py-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(91,91,214,0.05)', border: '1px solid rgba(91,91,214,0.16)' }}>
          <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wide mb-2" style={{ color: C.indigo }}>
            <Sparkles className="w-3 h-3" /> Why this quantity
          </div>
          <p className="text-[12px] leading-relaxed text-[#1A1A1A]/75">
            Units tripled between <span className="font-semibold">July 23 and July 26</span> — that was Prime Day, not a change
            in demand. I’ve excluded that window from the baseline and I’m forecasting on the 42.3/day trend either side of it.
            Ordering against the spike would have put roughly 900 units of dead stock into Q4.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Prime Day Jul 23–26 excluded', 'Q4 multiplier 1.6× from Oct 12', '25d production · 45d freight · 7d check-in'].map(chip => (
              <span key={chip} className="rounded-md bg-white px-2 py-1 text-[9px] font-medium text-[#1A1A1A]/70 border border-[#1A1A1A]/8">{chip}</span>
            ))}
          </div>
        </div>
      </div>

      {/* the chart the sparkline opens */}
      <AnimatePresence initial={false}>
        {chartOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }} className="overflow-hidden">
            <div className="px-5 pb-5">
              <div className="bg-white rounded-xl border border-[#1A1A1A]/8">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#1A1A1A]/8">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-[#1A1A1A]">Past Sales On Amazon</span>
                    <Info className="w-3 h-3 text-[#1A1A1A]/25" />
                  </span>
                  <span className="flex items-center gap-1">
                    {['Daily', 'Weekly', 'Monthly'].map(m => (
                      <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] transition-colors ${
                          mode === m ? 'font-bold text-[#1A1A1A]/85 bg-[#1A1A1A]/[0.05]' : 'font-medium text-[#1A1A1A]/45 hover:text-[#1A1A1A]/70'
                        }`}>
                        <span className={`w-2.5 h-2.5 rounded-full border-[3px] ${mode === m ? '' : 'border-[#1A1A1A]/20'}`}
                          style={mode === m ? { borderColor: C.green } : undefined} />
                        {m}
                      </button>
                    ))}
                  </span>
                </div>

                <div className="px-2 pt-3 pb-1">
                  <Chart mode={mode} />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-5 px-4 pb-3 text-[10px] font-medium">
                  <span className="flex items-center gap-1.5 text-[#1A1A1A]/55">
                    <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="#2563EB" strokeWidth="2" /></svg>
                    Past sales
                  </span>
                  <span className="flex items-center gap-1.5 text-[#1A1A1A]/55">
                    <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={C.green} strokeWidth="2" strokeDasharray="4 3" /></svg>
                    Forecast velocity
                  </span>
                  <span className="flex items-center gap-1.5 text-[#1A1A1A]/55">
                    <span className="w-3.5 h-3 rounded-sm" style={{ backgroundColor: 'rgba(255,153,0,0.20)', border: '1px solid rgba(255,153,0,0.45)' }} />
                    Excluded from baseline
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
