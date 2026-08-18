import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, ChevronDown } from 'lucide-react';
import { C, ease } from './theme';
import { SUPPLIERS, bySku } from '../../data/story';
import Copyable from './Copyable';

/* ──────────────────────────────────────────────────────────────
   RestockTableDemo — the hero product visual.

   The restock plan: every SKU with its days of cover, the date it
   goes dark, and the quantity to order. Clicking a row expands the
   reasoning behind the recommendation — velocity, lead-time
   breakdown, seasonal multiplier, and the resulting order-by date.

   That expansion is the whole AI-native pitch, shown rather than
   claimed: the number is auditable, not a black box.

   Rendered in the app's own light chrome (like the DragonReply
   demos) so it reads as a real screenshot dropped onto the page in
   both themes. Replace with a real capture once the UI is final.
   ────────────────────────────────────────────────────────────── */

const ROWS = [
  {
    sku: 'SHIRT-RED-M', cover: 9, out: 'Aug 19', qty: 1200, status: 'urgent',
    why: {
      velocity: '42.3/day · +18% vs 90d',
      lead: '25d production + 45d freight + 7d check-in',
      season: 'Q4 multiplier 1.6× from Oct 12',
      note: 'Order from Lianfa today. Even placed now, the shipment lands 4 days after you hit zero.',
    },
  },
  {
    sku: 'HAT-BLK-OS', cover: 21, out: 'Aug 31', qty: 800, status: 'soon',
    why: {
      velocity: '17.8/day · +2% vs 90d',
      lead: '25d production + 45d freight + 7d check-in',
      season: 'No seasonal adjustment',
      note: 'Order from Dongfeng by Aug 14 to keep 21 days of buffer at landing.',
    },
  },
  {
    sku: 'SHIRT-GRN-S', cover: 44, out: 'Sep 23', qty: 500, status: 'ok',
    why: {
      velocity: '11.2/day · −6% vs 90d',
      lead: '25d production + 45d freight + 7d check-in',
      season: 'Q4 multiplier 1.3× from Nov 1',
      note: 'Healthy today, but the Q4 lift pulls the order date into September.',
    },
  },
  {
    sku: 'HAT-NVY-OS', cover: 76, out: 'Oct 25', qty: 0, status: 'ok',
    why: {
      velocity: '6.9/day · −1% vs 90d',
      lead: '25d production + 45d freight + 7d check-in',
      season: 'No seasonal adjustment',
      note: '640 units already in transit from Dongfeng. Nothing to order this cycle.',
    },
  },
];

const STATUS = {
  urgent: { label: 'Order now', color: C.red, bg: 'rgba(220,38,38,0.10)' },
  soon: { label: 'Order soon', color: '#B45309', bg: 'rgba(245,158,11,0.14)' },
  ok: { label: 'Healthy', color: C.green, bg: 'rgba(47,125,79,0.10)' },
};

const GRID = 'grid grid-cols-[1fr_50px_58px_58px_74px_16px] items-center gap-2';

function Why({ why }) {
  const chips = [
    ['Velocity', why.velocity],
    ['Lead time', why.lead],
    ['Seasonality', why.season],
  ];
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease }}
      className="overflow-hidden"
    >
      <div className="mt-1 mb-2 rounded-xl p-3" style={{ backgroundColor: 'rgba(91,91,214,0.05)', border: '1px solid rgba(91,91,214,0.14)' }}>
        <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wide mb-2" style={{ color: C.indigo }}>
          <Sparkles className="w-3 h-3" /> Why this recommendation
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {chips.map(([k, v]) => (
            <span key={k} className="rounded-md bg-white px-2 py-1 text-[9.5px] border border-[#1A1A1A]/8">
              <span className="text-[#1A1A1A]/40 font-semibold">{k} </span>
              <span className="text-[#1A1A1A]/75 font-medium">{v}</span>
            </span>
          ))}
        </div>
        <p className="text-[10.5px] leading-snug text-[#1A1A1A]/65">{why.note}</p>
      </div>
    </motion.div>
  );
}

export default function RestockTableDemo() {
  const [open, setOpen] = useState(ROWS[0].sku);

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      {/* header strip */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]/8">
        <div className="text-[13px] font-bold text-[#1A1A1A]">
          Restock plan <span className="text-[#1A1A1A]/40 font-medium">· Ridgeline Apparel (38 SKUs)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: C.indigo }}>
          <Sparkles className="w-3.5 h-3.5" /> Forecast updated today
        </div>
      </div>

      {/* stockout warning */}
      <div className="flex items-center gap-2 px-4 py-2 text-[11.5px] font-medium"
        style={{ backgroundColor: '#F5ECEE', color: C.red }}>
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        1 SKU goes out of stock before your next shipment lands.
      </div>

      {/* column headers */}
      <div className={`${GRID} px-4 pt-3 pb-1.5 border-b border-[#1A1A1A]/8 text-[9px] font-semibold uppercase tracking-wide text-[#1A1A1A]/40`}>
        <span>SKU</span>
        <span className="text-right">Cover</span>
        <span className="text-right">Stocks out</span>
        <span className="text-right">Order qty</span>
        <span className="text-right">Status</span>
        <span />
      </div>

      {/* rows */}
      <div className="px-4 pb-3">
        {ROWS.map((r) => {
          const s = STATUS[r.status];
          const p = bySku[r.sku];
          const supplier = SUPPLIERS[p.supplier];
          const isOpen = open === r.sku;
          return (
            <div key={r.sku} className="border-b border-[#1A1A1A]/6 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.sku)}
                aria-expanded={isOpen}
                className={`${GRID} w-full py-2.5 text-[11px] text-left rounded-lg transition-colors hover:bg-[#1A1A1A]/[0.03]`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <img src={p.img} alt="" className="w-7 h-7 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#1A1A1A]/85 truncate">
                      <Copyable value={r.sku} kind="SKU">{r.sku}</Copyable>
                    </span>
                    <span className="block text-[9.5px] text-[#1A1A1A]/40 truncate">{p.name} · {supplier.name}</span>
                  </span>
                </span>
                <span className="text-right font-semibold tabular-nums" style={{ color: s.color }}>{r.cover}d</span>
                <span className="text-right tabular-nums text-[#1A1A1A]/60">{r.out}</span>
                <span className="text-right font-semibold tabular-nums text-[#1A1A1A]/85">
                  {r.qty ? r.qty.toLocaleString() : '—'}
                </span>
                <span className="flex justify-end">
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold whitespace-nowrap"
                    style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#1A1A1A]/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && <Why why={r.why} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
