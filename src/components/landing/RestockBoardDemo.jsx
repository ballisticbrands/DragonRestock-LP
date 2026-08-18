import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, ChevronDown, AlertCircle, Clock, Sparkles, Check, Minus, Info } from 'lucide-react';
import { C, ease } from './theme';
import { SUPPLIERS, bySku } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   RestockBoardDemo — the Restock Recommendations page.

   A merge of the two conventions in this category:

     · From SoStocked — the action IS the control, and it sits right
       beside the product rather than at the far end of the row: a
       dated, quantified button ("Order 1,200 by Aug 11") you can read
       without crossing the metrics. Each supplier group carries a bulk
       action with the money attached, and velocity stays auditable
       across seven lookback windows.
     · From the newer AI tools — orientation. Summary tiles, urgency
       as a first-class column, filter tabs, and an honest inventory
       decomposition (FBA / inbound / 3PL / total).

   What neither of them does, and the reason this page exists:
   REASON CHIPS. Any row whose order quantity isn't plain demand says
   so on its face — "MOQ inflated", "Q4 lift 1.6×", "CNY shutdown".
   Indigo chips are things the model worked out; grey chips are
   mechanical constraints. That's "it tells you what to do" made
   literal: the justification travels with the instruction.

   Row checkboxes drive the group button: tick a subset and the bulk
   action reprices to that selection, so you can see what a partial
   order costs before committing to it.

   Inline velocity is the 7-day figure, a sparkline, and the trend
   against 90 days — stacked so it has room to breathe. Expand a row
   and the full seven-window grid is there, alongside the lead-time
   legs and the quantity rationale.

   Lead times are uniform across the story — 25d production, 45d
   freight, 7d check-in (77 days door to door) — so a reader can do
   the arithmetic in their head and have it come out right.

   Story data throughout: Ridgeline Apparel, shirts from Lianfa,
   hats from Dongfeng.
   ────────────────────────────────────────────────────────────── */

const LEAD_LEGS = '25d production · 45d freight · 7d check-in';

const URGENCY = {
  critical: { label: 'Critical', color: C.red, bg: 'rgba(220,38,38,0.10)' },
  warning: { label: 'Warning', color: '#B45309', bg: 'rgba(245,158,11,0.16)' },
  ok: { label: 'OK', color: C.green, bg: 'rgba(47,125,79,0.10)' },
  nosales: { label: 'No sales', color: 'rgba(26,26,26,0.45)', bg: 'rgba(26,26,26,0.06)' },
};

/* kind: 'ai' = the model worked it out · 'rule' = a mechanical constraint */
const CHIP = {
  ai: { color: C.indigo, bg: 'rgba(91,91,214,0.09)', border: 'rgba(91,91,214,0.20)' },
  rule: { color: 'rgba(26,26,26,0.55)', bg: 'rgba(26,26,26,0.045)', border: 'rgba(26,26,26,0.10)' },
};

/* `windows` runs oldest → newest (180d, 90d, 60d, 30d, 15d, 7d, 2d).
   `velocity` is the 7d figure and `delta` is it measured against 90d,
   so the three velocity readouts on a row always agree with each other. */
const GROUPS = [
  {
    supplier: SUPPLIERS.lianfa,
    rows: [
      {
        sku: 'SHIRT-RED-M', asin: 'B0RDG7TEE1', urgency: 'critical',
        fba: 120, inbound: 260, offsite: 0,
        velocity: 42.3, delta: '+18%',
        windows: [33.1, 35.8, 37.4, 39.2, 40.6, 42.3, 44.9],
        order: { qty: 1200, by: 'Aug 11' },
        chips: [
          { text: 'Prime Day excluded', kind: 'ai' },
          { text: 'Q4 lift 1.6×', kind: 'ai' },
          { text: 'Container fill', kind: 'rule' },
        ],
        why: {
          qty: 'Units tripled between July 23 and July 26 — that was Prime Day, not a change in demand, so it’s out of the baseline and the forecast runs on the 42.3/day trend either side of it. Ordering against the spike would have put roughly 900 units of dead stock into Q4. 980 units covers demand to the Q4 lift; rounded to 1,200 to fill the container — the extra 220 ship for free.',
          season: 'Q4 multiplier 1.6× from Oct 12',
        },
      },
      {
        sku: 'SHIRT-BLU-L', asin: 'B0RDG7TEE3', urgency: 'warning',
        fba: 323, inbound: 0, offsite: 240,
        velocity: 15.4, delta: '−4%',
        windows: [17.2, 16.1, 15.9, 15.7, 15.6, 15.4, 15.1],
        order: { qty: 800, by: 'Aug 28' },
        transfer: { qty: 240, by: 'Aug 14' },
        chips: [{ text: '3PL stock counted', kind: 'rule' }],
        why: {
          qty: '240 units at the 3PL cover the next 15 days if you send them in now. The 800 covers the gap after that.',
          season: 'No seasonal adjustment',
        },
      },
      {
        sku: 'SHIRT-GRN-S', asin: 'B0RDG7TEE5', urgency: 'ok',
        fba: 493, inbound: 0, offsite: 0,
        velocity: 11.2, delta: '−6%',
        windows: [12.8, 11.9, 11.7, 11.5, 11.3, 11.2, 10.6],
        order: { qty: 500, by: 'Sep 12' },
        chips: [{ text: 'MOQ inflated', kind: 'rule' }],
        why: {
          qty: 'Demand only justifies 340 units. Lianfa’s MOQ is 500, so you either buy 500 or don’t run this SKU.',
          season: 'Q4 multiplier 1.3× from Nov 1',
        },
      },
    ],
  },
  {
    supplier: SUPPLIERS.dongfeng,
    rows: [
      {
        sku: 'HAT-BLK-OS', asin: 'B0RDG4CAP2', urgency: 'critical',
        fba: 374, inbound: 0, offsite: 180,
        velocity: 17.8, delta: '+2%',
        windows: [16.6, 17.4, 17.5, 17.6, 17.7, 17.8, 18.1],
        order: { qty: 800, by: 'Aug 14' },
        transfer: { qty: 180, by: 'Aug 12' },
        chips: [
          { text: 'CNY shutdown', kind: 'ai' },
          { text: 'Stockout-adjusted', kind: 'ai' },
        ],
        why: {
          qty: 'Dongfeng closes for three weeks over Chinese New Year. Ordering by Aug 14 clears production before the shutdown; miss it and the next slot is February.',
          season: '11 stockout days in March excluded from the baseline',
        },
      },
      {
        sku: 'HAT-RED-OS', asin: 'B0RDG4CAP6', urgency: 'nosales',
        fba: 210, inbound: 0, offsite: 0,
        velocity: 0, delta: '0%',
        windows: [0.4, 0.1, 0, 0, 0, 0, 0],
        chips: [{ text: 'Liquidation candidate', kind: 'ai' }],
        why: {
          qty: '210 units sitting in FBA with no sales in 90 days. This is a liquidation decision, not a restock one — see what it costs you to keep holding it.',
          season: 'No baseline — excluded from forecasting',
        },
      },
      {
        sku: 'HAT-NVY-OS', asin: 'B0RDG4CAP4', urgency: 'ok',
        fba: 284, inbound: 240, offsite: 0,
        velocity: 6.9, delta: '−1%',
        windows: [7.2, 7.0, 6.9, 7.1, 6.8, 6.9, 7.0],
        chips: [{ text: 'In transit counted', kind: 'rule' }],
        why: {
          qty: '640 units already in transit, landing Sep 8. Nothing to order this cycle.',
          season: 'No seasonal adjustment',
        },
      },
    ],
  },
];

/* The `short` cut for the landing page: two Lianfa rows and the Dongfeng
   row carrying the Chinese New Year shutdown — enough to play with, and
   enough to show both AI reasoning and a hard supplier constraint, without
   the full six-row board the /demo walkthrough gets. */
const SHORT_SKUS = ['SHIRT-RED-M', 'SHIRT-BLU-L', 'HAT-BLK-OS'];

const WINDOW_LABELS = ['180d', '90d', '60d', '30d', '15d', '7d', '2d'];

const GRID =
  'grid items-center gap-2 ' +
  'grid-cols-[24px_20px_104px_190px_142px_minmax(72px,1fr)_minmax(96px,1.3fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(50px,1fr)_minmax(62px,1fr)]';

const lineValue = (row) => row.order.qty * bySku[row.sku].cogs;

function Checkbox({ checked, indeterminate, onChange, label }) {
  const on = checked || indeterminate;
  return (
    <button
      type="button" role="checkbox" aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label} onClick={onChange}
      className={`w-[15px] h-[15px] rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
        on ? '' : 'border-[#1A1A1A]/25 bg-white hover:border-[#1A1A1A]/45'
      }`}
      style={on ? { backgroundColor: C.green, borderColor: C.green } : undefined}
    >
      {indeterminate
        ? <Minus className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
        : checked ? <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} /> : null}
    </button>
  );
}

function Sparkline({ values, color }) {
  const w = 52, h = 14;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / span) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 overflow-visible" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chip({ text, kind }) {
  const c = CHIP[kind];
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[8.5px] font-semibold whitespace-nowrap"
      style={{ color: c.color, backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
      {kind === 'ai' && <Sparkles className="w-2.5 h-2.5" />}
      {text}
    </span>
  );
}

/* Column header with an optional hover tooltip.

   Tooltips open DOWNWARD rather than above the label the way the source
   UIs do it: the board lives in an overflow-x-auto container, and that
   computes overflow-y to auto, so anything rising above the header row
   gets clipped. Caret sits on top instead. */
function Tip({ children }) {
  return (
    <span className="pointer-events-none absolute top-full right-0 mt-2 z-30 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <span className="relative block rounded-lg bg-[#1E293B] px-3 py-2.5 text-left text-[10px] font-medium normal-case tracking-normal leading-relaxed text-white shadow-xl">
        <span className="absolute -top-1 right-5 w-2 h-2 rotate-45 bg-[#1E293B]" />
        {children}
      </span>
    </span>
  );
}

function ColHead({ label, tip, left }) {
  return (
    <span className={`relative group flex items-start gap-1 leading-tight ${left ? '' : 'justify-end text-right'}`}>
      <span>{label}</span>
      {tip && (
        <>
          <Info className="w-2.5 h-2.5 mt-px shrink-0 text-[#1A1A1A]/30 group-hover:text-[#2563EB] transition-colors" />
          <Tip>{tip}</Tip>
        </>
      )}
    </span>
  );
}

function StatTile({ label, value, valueColor = '#1A1A1A', accent }) {
  return (
    <div className="rounded-xl bg-white border border-[#1A1A1A]/8 px-3.5 py-3"
      style={accent ? { borderColor: accent } : undefined}>
      <div className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]/40 whitespace-nowrap">{label}</div>
      <div className="font-clash font-semibold text-[22px] leading-none tracking-[-0.02em] mt-1.5" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
}

/* `large` matches the type scale ForecastDemo uses on the landing page, so
   the two "Why this quantity" panels read the same size when a visitor
   meets them a screen apart. The board's own row chrome stays at UI scale
   either way — it's only the reasoning panel that has to be readable in
   passing. */
function Why({ row, large }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease }} className="overflow-hidden"
    >
      <div className={`mx-2 mb-2.5 rounded-xl ${large ? 'p-5' : 'p-3.5'}`}
        style={{ backgroundColor: 'rgba(91,91,214,0.045)', border: '1px solid rgba(91,91,214,0.14)' }}>
        <div className={`flex items-center gap-1.5 font-bold uppercase tracking-wide ${large ? 'text-[11.5px] mb-3' : 'text-[9px] mb-2.5'}`} style={{ color: C.indigo }}>
          <Sparkles className={large ? 'w-3.5 h-3.5' : 'w-3 h-3'} /> Why this quantity
        </div>
        <p className={`leading-relaxed text-[#1A1A1A]/70 ${large ? 'text-[15px] mb-4' : 'text-[10.5px] mb-3'}`}>{row.why.qty}</p>

        <div className={`flex flex-wrap gap-1.5 ${large ? 'mb-4' : 'mb-3.5'}`}>
          <span className={`rounded-md bg-white border border-[#1A1A1A]/8 ${large ? 'px-2.5 py-1.5 text-[11.5px]' : 'px-2 py-1 text-[9px]'}`}>
            <span className="text-[#1A1A1A]/40 font-semibold">Lead time </span>
            <span className="text-[#1A1A1A]/75 font-medium">{LEAD_LEGS}</span>
          </span>
          <span className={`rounded-md bg-white border border-[#1A1A1A]/8 ${large ? 'px-2.5 py-1.5 text-[11.5px]' : 'px-2 py-1 text-[9px]'}`}>
            <span className="text-[#1A1A1A]/40 font-semibold">Seasonality </span>
            <span className="text-[#1A1A1A]/75 font-medium">{row.why.season}</span>
          </span>
        </div>

        {/* the seven-window velocity grid — available, not mandatory */}
        <div className={`font-bold uppercase tracking-wide text-[#1A1A1A]/40 ${large ? 'text-[10.5px] mb-2' : 'text-[8.5px] mb-1.5'}`}>Past daily sales velocity</div>
        <div className="grid grid-cols-7 gap-1">
          {row.windows.map((v, i) => (
            <div key={WINDOW_LABELS[i]} className={`rounded-md bg-white border border-[#1A1A1A]/8 text-center ${large ? 'px-1.5 py-2' : 'px-1 py-1.5'}`}>
              <div className={`font-semibold text-[#1A1A1A]/35 ${large ? 'text-[10px]' : 'text-[8px]'}`}>{WINDOW_LABELS[i]}</div>
              <div className={`font-semibold tabular-nums text-[#1A1A1A]/80 ${large ? 'text-[13.5px]' : 'text-[11px]'}`}>{v.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Row({ row, open, onToggle, checked, onCheck, large }) {
  const p = bySku[row.sku];
  const u = URGENCY[row.urgency];
  const total = row.fba + row.inbound + row.offsite;
  // Cover counts Fulfillable on hand + units inbound direct to FBA. Off-site
  // stock doesn't count until it's sent in — which is what the Transfer
  // action on some rows is for.
  const daysWithInbound = row.velocity > 0 ? Math.round((row.fba + row.inbound) / row.velocity) : null;
  const rising = row.delta.startsWith('+');
  const flat = row.delta === '0%';
  const trendColor = rising ? C.green : flat ? 'rgba(26,26,26,0.4)' : '#B45309';

  return (
    <div className="border-b border-[#1A1A1A]/6 last:border-b-0">
      <div className={`${GRID} px-3 py-3`}>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={`Show reasoning for ${row.sku}`}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#1A1A1A]/[0.05] transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A1A]/35 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>

        <span className="flex justify-center">
          {row.order && <Checkbox checked={checked} onChange={onCheck} label={`Include ${row.sku} in the order`} />}
        </span>

        <div className="flex flex-col items-start gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
            style={{ color: u.color, backgroundColor: u.bg }}>
            {row.urgency !== 'ok' && <AlertCircle className="w-2.5 h-2.5" />}{u.label}
          </span>
          {row.chips.map(c => <Chip key={c.text} {...c} />)}
        </div>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
            <img src={p.img} alt="" className="w-6 h-6" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11.5px] font-semibold text-[#1A1A1A]/85 truncate">{row.sku}</span>
            <span className="block text-[9.5px] text-[#1A1A1A]/45 truncate">{p.name}</span>
            <span className="block text-[9px] font-medium truncate" style={{ color: '#2563EB' }}>{row.asin}</span>
          </span>
        </div>

        <span className="flex flex-col items-stretch gap-1">
          {row.order ? (
            <span className={`rounded-lg px-2.5 py-1.5 text-center leading-tight text-white shadow-sm transition-opacity ${checked ? '' : 'opacity-35'}`}
              style={{ backgroundColor: C.green }}>
              <span className="block text-[10.5px] font-bold">Order {row.order.qty.toLocaleString()}</span>
              <span className="block text-[9px] font-medium text-white/80">by {row.order.by}</span>
            </span>
          ) : (
            <span className="rounded-lg px-2.5 py-1.5 text-center text-[9.5px] font-semibold text-[#1A1A1A]/35 border border-dashed border-[#1A1A1A]/15">
              No order needed
            </span>
          )}
          {row.transfer && (
            <span className="rounded-lg px-2.5 py-1 text-center leading-tight text-white"
              style={{ backgroundColor: '#2563EB' }}>
              <span className="block text-[10px] font-bold">Transfer {row.transfer.qty} → FBA</span>
              <span className="block text-[8.5px] font-medium text-white/80">by {row.transfer.by}</span>
            </span>
          )}
        </span>

        {/* days until stock out — Fulfillable + inbound, over velocity */}
        <span className="text-right text-[21px] font-bold tabular-nums leading-none tracking-[-0.02em]" style={{ color: u.color }}>
          {daysWithInbound ?? '—'}
        </span>

        {/* velocity — stacked so the number leads and the trend has room */}
        <span className="flex flex-col items-end gap-1">
          <span className="text-[19px] font-bold tabular-nums leading-none tracking-[-0.02em] text-[#1A1A1A]">{row.velocity.toFixed(1)}</span>
          <Sparkline values={row.windows} color={rising ? C.green : flat ? 'rgba(26,26,26,0.35)' : '#B45309'} />
          <span className="text-[8.5px] font-semibold tabular-nums leading-none whitespace-nowrap" style={{ color: trendColor }}>
            {row.delta} vs 90d
          </span>
        </span>

        {/* availability — Inventory Hero's vocabulary and its "– –" for nothing incoming */}
        <span className="text-right text-[11.5px] tabular-nums text-[#1A1A1A]/70">{row.fba}</span>
        <span className="text-right text-[11.5px] tabular-nums text-[#1A1A1A]/40">{row.inbound || '– –'}</span>
        <span className="text-right text-[11.5px] tabular-nums text-[#1A1A1A]/70">{row.offsite}</span>
        <span className="text-right text-[11.5px] font-semibold tabular-nums text-[#1A1A1A]">{total}</span>

      </div>

      <AnimatePresence initial={false}>{open && <Why row={row} large={large} />}</AnimatePresence>
    </div>
  );
}

export default function RestockBoardDemo({ short = false, large = false }) {
  const [open, setOpen] = useState('SHIRT-RED-M');
  const [tab, setTab] = useState('All');

  /* everything below counts off the rows this instance actually shows, so
     the tabs, the tiles and the bulk selection all agree in either cut */
  const boardGroups = short
    ? GROUPS.map(g => ({ ...g, rows: g.rows.filter(r => SHORT_SKUS.includes(r.sku)) })).filter(g => g.rows.length > 0)
    : GROUPS;
  const allRows = boardGroups.flatMap(g => g.rows);
  const countOf = (key) => allRows.filter(r => r.urgency === key).length;
  const orderableRows = allRows.filter(r => r.order).map(r => r.sku);
  const ordered = allRows.filter(r => r.order);
  const totalQty = ordered.reduce((sum, r) => sum + r.order.qty, 0);
  const totalValue = ordered.reduce((sum, r) => sum + lineValue(r), 0);

  const TABS = [
    { label: 'All', count: allRows.length },
    { label: 'Critical', urgency: 'critical', count: countOf('critical') },
    { label: 'Warning', urgency: 'warning', count: countOf('warning') },
    { label: 'OK', urgency: 'ok', count: countOf('ok') },
    { label: 'No sales', urgency: 'nosales', count: countOf('nosales') },
  ];

  // The tabs filter; the search box is decorative on purpose — it's here to
  // show the affordance, not to be a working search on five rows.
  const groups = boardGroups
    .map(g => ({ ...g, rows: tab === 'All' ? g.rows : g.rows.filter(r => URGENCY[r.urgency].label === tab) }))
    .filter(g => g.rows.length > 0);
  const [selected, setSelected] = useState(() => new Set(orderableRows));

  const toggleRow = (sku) => setSelected(prev => {
    const next = new Set(prev);
    next.has(sku) ? next.delete(sku) : next.add(sku);
    return next;
  });

  const allSelected = selected.size === orderableRows.length;
  const someSelected = selected.size > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(orderableRows));

  const toggleGroup = (rows) => setSelected(prev => {
    const next = new Set(prev);
    const skus = rows.filter(r => r.order).map(r => r.sku);
    const allOn = skus.every(s => next.has(s));
    skus.forEach(s => (allOn ? next.delete(s) : next.add(s)));
    return next;
  });

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      {/* header */}
      <div className="px-5 pt-5 pb-4">
        <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">Restock Recommendations</h4>
        <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Order quantities and dates from sales velocity, lead times, and the events on your calendar.</p>
      </div>

      {/* summary tiles */}
      <div className="px-5 grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        <StatTile label="Critical SKUs" value={String(countOf('critical'))} valueColor={C.red} accent="rgba(220,38,38,0.30)" />
        <StatTile label="Warning SKUs" value={String(countOf('warning'))} valueColor="#B45309" accent="rgba(245,158,11,0.35)" />
        <StatTile label="Total order qty" value={totalQty.toLocaleString()} />
        <StatTile label="Est. order value" value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        {/* SHIRT-RED-M is in every cut and is always the earliest */}
        <StatTile label="Earliest order by" value="Aug 11" valueColor={C.red} />
      </div>

      {/* controls */}
      <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#1A1A1A]/10 px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#1A1A1A]/30" />
          <span className="text-[11px] text-[#1A1A1A]/35">Search by SKU or ASIN…</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold"
          style={{ color: C.green, borderColor: 'rgba(47,125,79,0.35)', backgroundColor: 'rgba(47,125,79,0.06)' }}>
          <Users className="w-3.5 h-3.5" /> Group by supplier
        </span>
        <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#1A1A1A]/10 p-0.5">
          {TABS.map(({ label, count }) => (
            <button key={label} type="button" onClick={() => setTab(label)}
              aria-pressed={tab === label}
              disabled={count === 0}
              className={`px-2.5 py-1 rounded-md text-[10.5px] whitespace-nowrap transition-colors ${
                tab === label
                  ? 'bg-[#1A1A1A]/[0.06] font-bold text-[#1A1A1A]/80'
                  : count === 0
                    ? 'font-medium text-[#1A1A1A]/25 cursor-not-allowed'
                    : 'font-medium text-[#1A1A1A]/45 hover:bg-[#1A1A1A]/[0.035] hover:text-[#1A1A1A]/70'
              }`}>
              {label} <span className="text-[#1A1A1A]/30">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* board */}
      <div className="px-5 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[960px]">
            {/* column headers */}
            <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span className="flex justify-start">
                <Checkbox checked={allSelected} indeterminate={someSelected}
                  onChange={toggleAll} label="Select every SKU" />
              </span>
              <span />
              <ColHead left label="Urgency" />
              <ColHead left label="Product" />
              <ColHead left label="Action" />
              <ColHead
                label={<>Days until<br />S.O.</>}
                tip={<><span className="font-bold">Days Until Stock Out</span> — how long you stay in stock at Amazon, counting Fulfillable inventory plus units already inbound to FBA.</>}
              />
              <ColHead
                label="Velocity"
                tip={<><span className="font-bold">Adjusted velocity</span> — 7-day average daily sales with stockout and suppressed days removed. The trend compares it to the 90-day baseline.</>}
              />
              <ColHead label="Fulfillable" tip="Buyable now (FBA fulfillable + FBM)" />
              <ColHead label="Incoming" tip="On the way to Amazon (FBA inbound)" />
              <ColHead label={<>Off-<br />Site</>} tip="Owned, off-site (AWD + 3PL)" />
              <ColHead label={<>Total<br />Available</>} tip="Everything sellable within the planning window (the order-planning number)" />
            </div>

            {groups.map(({ supplier, rows }) => {
              const orderRows = rows.filter(r => r.order);
              const picked = orderRows.filter(r => selected.has(r.sku));
              const units = picked.reduce((n, r) => n + r.order.qty, 0);
              const value = picked.reduce((n, r) => n + lineValue(r), 0);
              const allOn = picked.length === orderRows.length;
              const someOn = picked.length > 0 && !allOn;

              return (
                <div key={supplier.key}>
                  {/* supplier group header — bulk action, repriced by the selection */}
                  <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#1A1A1A]/[0.025] border-b border-[#1A1A1A]/8">
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Checkbox checked={allOn} indeterminate={someOn}
                        onChange={() => toggleGroup(rows)} label={`Select all ${supplier.name} items`} />
                      <span className="text-[12px] font-bold text-[#1A1A1A] truncate">{supplier.name}</span>
                      <span className="text-[10px] text-[#1A1A1A]/40 whitespace-nowrap">
                        {supplier.line} · {picked.length} of {orderRows.length} selected · {supplier.city}
                      </span>
                    </span>

                    {picked.length ? (
                      <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white text-[10.5px] font-bold whitespace-nowrap shadow-sm"
                        style={{ backgroundColor: C.deep }}>
                        Order {allOn ? 'all ' : ''}{units.toLocaleString()} units
                        <span className="text-white/70 font-semibold">
                          · ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </span>
                    ) : (
                      <span className="rounded-lg px-3 py-1.5 text-[10.5px] font-semibold whitespace-nowrap text-[#1A1A1A]/35 border border-dashed border-[#1A1A1A]/20">
                        Select items to order
                      </span>
                    )}
                  </div>

                  {rows.map(r => (
                    <Row
                      key={r.sku} row={r}
                      open={open === r.sku} onToggle={() => setOpen(open === r.sku ? null : r.sku)}
                      checked={selected.has(r.sku)} onCheck={() => toggleRow(r.sku)}
                      large={large}
                    />
                  ))}
                </div>
              );
            })}
            {groups.length === 0 && (
              <div className="px-3 py-10 text-center text-[11px] text-[#1A1A1A]/35">
                Nothing in this bucket right now.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#1A1A1A]/40">
          <Clock className="w-3 h-3" /> Recalculated this morning · {allRows.length} SKUs need a decision · 38 in catalog
        </div>
      </div>
    </div>
  );
}
