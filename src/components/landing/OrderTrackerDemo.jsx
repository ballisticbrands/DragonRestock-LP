import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Columns3, CalendarDays, Sparkles, Check, X, Search, Factory, Ship, Warehouse, PackageCheck } from 'lucide-react';
import { C, ease } from './theme';
import { SUPPLIERS, bySku } from '../../data/story';
import Copyable from './Copyable';

/* ──────────────────────────────────────────────────────────────
   OrderTrackerDemo — every purchase order, deposit to check-in.

   Three views, following the convention the category has settled on:
   Grid, Kanban, Calendar. Kanban is the default because that's where
   the argument lives.

   The Kanban board carries a RECONCILE SHIPMENTS column — a shipment
   has landed at FBA or AWD and nobody has told the system which PO
   it belongs to. Every other tool leaves that as manual matching, and
   an unreconciled shipment quietly corrupts the restock number,
   because units you own aren't counted as cover.

   So each card in that column carries an indigo AI block proposing
   the match, with its confidence and its reasoning: same SKU, same
   carton count, the dates line up. One of the two is a clean match;
   the other is 20 units short-received, which is the case that
   actually matters — the discrepancy is the thing a human would miss.

   A PO carries line items, so one order can cover several SKUs —
   PO SHIRT#191 is 1,200 red tees plus 500 green. Unit and dollar
   totals are derived from those lines and the story's COGS.

   PO IDs follow the seller's own scheme: PO SHIRT#191, PO HAT#22,
   incrementing as orders are placed.
   ────────────────────────────────────────────────────────────── */

const STAGE = {
  reconcile: { label: 'Reconcile Shipments', color: C.indigo, icon: Sparkles },
  production: { label: 'In Production', color: '#B45309', icon: Factory },
  enroute: { label: 'Enroute', color: '#2563EB', icon: Ship },
  warehouse: { label: 'Warehouse & Prep', color: '#0F766E', icon: Warehouse },
  checkin: { label: 'FBA Check-In', color: C.green, icon: PackageCheck },
};

const COLUMNS = ['reconcile', 'production', 'enroute', 'warehouse', 'checkin'];

/* Day offsets are counted from Jun 1 2026 so the calendar bars can be
   positioned without any date maths at render time. Today = Aug 11. */
const TODAY = 71;
const SPAN = 214;
const MONTHS = [
  { label: 'Jun', at: 0 }, { label: 'Jul', at: 30 }, { label: 'Aug', at: 61 },
  { label: 'Sep', at: 92 }, { label: 'Oct', at: 122 }, { label: 'Nov', at: 153 }, { label: 'Dec', at: 183 },
];

const POS = [
  {
    id: 'SHIRT#191', supplier: 'lianfa', stage: 'production', ordered: 'Aug 11', eta: 'Oct 27', from: 71, to: 148,
    items: [{ sku: 'SHIRT-RED-M', units: 1200 }, { sku: 'SHIRT-GRN-S', units: 500 }],
  },
  {
    id: 'HAT#22', supplier: 'dongfeng', stage: 'production', ordered: 'Aug 14', eta: 'Oct 30', from: 74, to: 151,
    items: [{ sku: 'HAT-BLK-OS', units: 800 }],
  },
  {
    id: 'SHIRT#190', supplier: 'lianfa', stage: 'enroute', ordered: 'Jul 22', eta: 'Oct 11', from: 51, to: 132,
    items: [{ sku: 'SHIRT-BLU-L', units: 1200 }],
  },
  {
    id: 'HAT#21', supplier: 'dongfeng', stage: 'enroute', ordered: 'Jun 20', eta: 'Sep 8', from: 19, to: 99,
    items: [{ sku: 'HAT-NVY-OS', units: 640 }],
  },
  {
    id: 'SHIRT#189', supplier: 'lianfa', stage: 'warehouse', ordered: 'Jun 14', eta: 'Sep 2', from: 13, to: 93,
    items: [{ sku: 'SHIRT-BLU-L', units: 300 }],
  },
  {
    id: 'HAT#20', supplier: 'dongfeng', stage: 'checkin', ordered: 'Apr 2', eta: 'Jul 14', from: 0, to: 43,
    items: [{ sku: 'HAT-RED-OS', units: 400 }],
  },
];

/* Totals are derived from the line items and the story's COGS, so a PO
   can never disagree with the products inside it. */
const poUnits = (po) => po.items.reduce((n, i) => n + i.units, 0);
const poCost = (po) => po.items.reduce((n, i) => n + i.units * bySku[i.sku].cogs, 0);

const RECONCILE = [
  {
    id: 'FBA18X9K2QM', dest: 'Amazon FBA', units: 1180, expected: 1200, sku: 'SHIRT-BLU-L', arrived: 'Oct 11',
    match: {
      po: 'SHIRT#190', confidence: 97,
      note: 'Same SKU, same carton count, and 1,200 units left Lianfa on Aug 20 with an Oct 11 ETA. Received 1,180 — I’ve raised a 20-unit short-receipt on the PO and left it out of your cover until it’s settled.',
    },
  },
  {
    id: 'AWD7742KP', dest: 'Amazon AWD', units: 640, expected: 640, sku: 'HAT-NVY-OS', arrived: 'Sep 8',
    match: {
      po: 'HAT#21', confidence: 99,
      note: 'Exact unit match against the only open Dongfeng PO for this SKU. Left production Jul 6, 45 days freight, landed the day I projected. Nothing to query.',
    },
  },
];

const money = (n) => `$${n.toLocaleString()}`;
const VIEWS = [{ label: 'Grid', icon: LayoutGrid }, { label: 'Kanban', icon: Columns3 }, { label: 'Calendar', icon: CalendarDays }];

function Thumb({ sku, size = 'w-6 h-6', box = 'w-9 h-9' }) {
  return (
    <span className={`${box} rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0`}>
      <img src={bySku[sku].img} alt="" className={size} />
    </span>
  );
}

/* ─── the card that carries the whole argument ─── */
function ReconcileCard({ item }) {
  const short = item.expected - item.units;
  return (
    <div className="rounded-xl bg-white border border-[#1A1A1A]/10 shadow-sm overflow-hidden">
      <div className="px-3 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
            style={{ color: '#B45309', backgroundColor: 'rgba(245,158,11,0.16)' }}>
            {item.dest}
          </span>
          <span className="text-[9px] font-mono text-[#1A1A1A]/40">{item.id}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Thumb sku={item.sku} />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold text-[#1A1A1A]/85 truncate">
              <Copyable value={item.sku} kind="SKU">{item.sku}</Copyable>
            </span>
            <span className="block text-[9.5px] text-[#1A1A1A]/45">
              {item.units.toLocaleString()} units received · {item.arrived}
            </span>
          </span>
        </div>
        {short > 0 && (
          <div className="mt-2 text-[9.5px] font-semibold px-2 py-1 rounded"
            style={{ color: C.red, backgroundColor: 'rgba(220,38,38,0.08)' }}>
            {short} units short of the {item.expected.toLocaleString()} shipped
          </div>
        )}
      </div>

      {/* the AI match proposal — the reasoning here is read as prose, so it
          runs at reading size rather than the card's UI scale */}
      <div className="px-3.5 py-3" style={{ backgroundColor: 'rgba(91,91,214,0.055)', borderTop: '1px solid rgba(91,91,214,0.16)' }}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: C.indigo }}>
            <Sparkles className="w-3 h-3" /> Likely match
          </span>
          <span className="text-[10.5px] font-bold tabular-nums" style={{ color: C.indigo }}>{item.match.confidence}% confident</span>
        </div>
        <div className="text-[13px] font-bold text-[#1A1A1A] mb-1">PO {item.match.po}</div>
        <p className="text-[12.5px] leading-relaxed text-[#1A1A1A]/60">{item.match.note}</p>
        <div className="flex gap-1.5 mt-3">
          <span className="flex-1 flex items-center justify-center gap-1 rounded-md py-2 text-[11px] font-bold text-white" style={{ backgroundColor: C.green }}>
            <Check className="w-3.5 h-3.5" /> Confirm
          </span>
          <span className="flex items-center justify-center gap-1 rounded-md px-2.5 py-2 text-[11px] font-semibold text-[#1A1A1A]/45 border border-[#1A1A1A]/12">
            <X className="w-3.5 h-3.5" /> Not a match
          </span>
        </div>
      </div>
    </div>
  );
}

function POCard({ po }) {
  const s = STAGE[po.stage];
  return (
    <div className="rounded-xl bg-white border border-[#1A1A1A]/10 shadow-sm px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-[#1A1A1A]">PO {po.id}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {po.items.length > 1 && (
            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded" style={{ color: C.indigo, backgroundColor: 'rgba(91,91,214,0.10)' }}>
              {po.items.length} items
            </span>
          )}
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
        </span>
      </div>

      <div className="space-y-1.5 mb-2">
        {po.items.map(it => (
          <div key={it.sku} className="flex items-center gap-2.5">
            <Thumb sku={it.sku} box="w-8 h-8" size="w-5 h-5" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10.5px] font-semibold text-[#1A1A1A]/80 truncate">
                <Copyable value={it.sku} kind="SKU">{it.sku}</Copyable>
              </span>
              <span className="block text-[9px] text-[#1A1A1A]/40 tabular-nums">{it.units.toLocaleString()} units</span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[9.5px] pt-2 border-t border-[#1A1A1A]/6">
        <span className="font-semibold text-[#1A1A1A]/70 tabular-nums">{poUnits(po).toLocaleString()} units</span>
        <span className="text-[#1A1A1A]/40 tabular-nums">{money(poCost(po))}</span>
      </div>
      <div className="mt-1 text-[9px] text-[#1A1A1A]/40">
        {po.stage === 'checkin' ? `Checked in ${po.eta}` : `ETA ${po.eta}`} · {SUPPLIERS[po.supplier].name}
      </div>
    </div>
  );
}

function KanbanView() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {COLUMNS.map(key => {
        const s = STAGE[key];
        const Icon = s.icon;
        const cards = key === 'reconcile' ? RECONCILE : POS.filter(po => po.stage === key);
        return (
          <div key={key} className="w-[236px] shrink-0">
            <div className="flex items-center gap-1.5 px-1 pb-2">
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
              <span className="text-[11px] font-bold" style={{ color: key === 'reconcile' ? s.color : '#1A1A1A' }}>{s.label}</span>
              <span className="text-[10px] text-[#1A1A1A]/35 tabular-nums">{cards.length}</span>
            </div>
            <div className={`rounded-xl p-2 space-y-2 min-h-[180px] ${key === 'reconcile' ? '' : 'bg-[#1A1A1A]/[0.025]'}`}
              style={key === 'reconcile' ? { backgroundColor: 'rgba(91,91,214,0.05)', border: '1px dashed rgba(91,91,214,0.28)' } : undefined}>
              {key === 'reconcile'
                ? cards.map(c => <ReconcileCard key={c.id} item={c} />)
                : cards.map(po => <POCard key={po.id} po={po} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const GRID = 'grid grid-cols-[minmax(120px,1fr)_112px_150px_64px_78px_78px_74px] items-center gap-2';

function GridView() {
  return (
    <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
      <div className="min-w-[720px]">
        <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
          <span>Order</span><span>Status</span><span>Products</span>
          <span className="text-right">Units</span><span className="text-right">Ordered</span>
          <span className="text-right">Delivery</span><span className="text-right">Total</span>
        </div>
        {POS.map(po => {
          const st = STAGE[po.stage];
          return (
            <div key={po.id} className={`${GRID} px-3 py-2.5 border-b border-[#1A1A1A]/6 last:border-b-0 text-[11px]`}>
              <span className="font-semibold text-[#1A1A1A]/85 truncate">PO {po.id}</span>
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                <span className="text-[10.5px] truncate" style={{ color: st.color }}>{st.label}</span>
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                {po.items.map(it => (
                  <span key={it.sku} className="flex items-center gap-2 min-w-0">
                    <Thumb sku={it.sku} box="w-6 h-6" size="w-4 h-4" />
                    <span className="text-[10px] text-[#1A1A1A]/70 truncate">
                      <Copyable value={it.sku} kind="SKU">{it.sku}</Copyable>
                    </span>
                    <span className="text-[9px] text-[#1A1A1A]/35 tabular-nums shrink-0">{it.units.toLocaleString()}</span>
                  </span>
                ))}
              </span>
              <span className="text-right tabular-nums text-[#1A1A1A]/70">{poUnits(po).toLocaleString()}</span>
              <span className="text-right tabular-nums text-[#1A1A1A]/50">{po.ordered}</span>
              <span className="text-right tabular-nums text-[#1A1A1A]/70">{po.eta}</span>
              <span className="text-right font-semibold tabular-nums text-[#1A1A1A]">{money(poCost(po))}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarView() {
  const pct = (d) => `${(d / SPAN) * 100}%`;
  return (
    <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
      <div className="min-w-[680px] p-3">
        {/* month scale */}
        <div className="relative h-5 ml-[128px] border-b border-[#1A1A1A]/8">
          {MONTHS.map(m => (
            <span key={m.label} className="absolute top-0 text-[9px] font-semibold text-[#1A1A1A]/40" style={{ left: pct(m.at) }}>
              {m.label}
            </span>
          ))}
        </div>

        <div className="relative">
          {/* today */}
          <div className="absolute top-0 bottom-0 border-l border-dashed z-10" style={{ left: `calc(128px + (100% - 128px) * ${TODAY / SPAN})`, borderColor: 'rgba(220,38,38,0.45)' }}>
            <span className="absolute -top-0.5 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap" style={{ backgroundColor: C.red }}>
              Today
            </span>
          </div>

          {POS.map(po => {
            const st = STAGE[po.stage];
            return (
              <div key={po.id} className="flex items-center gap-2 py-1.5 border-b border-[#1A1A1A]/5 last:border-b-0">
                <span className="w-[120px] shrink-0 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                  <span className="text-[10px] font-semibold text-[#1A1A1A]/75 truncate">PO {po.id}</span>
                  {po.items.length > 1 && (
                    <span className="text-[8px] font-bold shrink-0" style={{ color: C.indigo }}>×{po.items.length}</span>
                  )}
                </span>
                <span className="relative flex-1 h-5">
                  <span className="absolute h-5 rounded-full flex items-center px-2"
                    style={{
                      left: pct(po.from), width: pct(po.to - po.from),
                      background: `linear-gradient(90deg, ${st.color}CC, ${st.color}88)`,
                    }}>
                    <span className="text-[8.5px] font-bold text-white whitespace-nowrap tabular-nums">{poUnits(po).toLocaleString()}</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 pt-2.5 border-t border-[#1A1A1A]/6 text-[9px] font-medium text-[#1A1A1A]/45">
          {['production', 'enroute', 'warehouse', 'checkin'].map(k => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE[k].color }} />
              {STAGE[k].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackerDemo() {
  const [view, setView] = useState('Kanban');

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">Order Tracker</h4>
          <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Every PO from deposit to FBA check-in — and every landed shipment matched back to it.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#1A1A1A]/10 px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#1A1A1A]/30" />
          <span className="text-[11px] text-[#1A1A1A]/35">Search POs…</span>
        </div>
      </div>

      {/* view switcher */}
      <div className="px-5 pb-3">
        <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-[#1A1A1A]/10 p-1">
          {VIEWS.map(({ label, icon: Icon }) => (
            <button key={label} type="button" onClick={() => setView(label)} aria-pressed={view === label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                view === label ? 'text-white shadow-sm' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]/75 hover:bg-[#1A1A1A]/[0.04]'
              }`}
              style={view === label ? { backgroundColor: C.green } : undefined}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          <motion.div key={view}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}>
            {view === 'Kanban' && <KanbanView />}
            {view === 'Grid' && <GridView />}
            {view === 'Calendar' && <CalendarView />}
          </motion.div>
        </AnimatePresence>

        {view === 'Kanban' && (
          <p className="mt-3 text-[10px] text-[#1A1A1A]/40">
            Two shipments landed without a PO attached. Until they’re reconciled, those units don’t count toward your cover.
          </p>
        )}
      </div>
    </div>
  );
}
