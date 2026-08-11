import { Search, TrendingUp, Info, Calendar } from 'lucide-react';
import { C } from './theme';
import { bySku } from '../../data/story';

/* ──────────────────────────────────────────────────────────────
   LostSalesDemo — "Lost Sales Analysis" screen.

   Reconstructs every stockout in the seller's history and prices it,
   so the cost of getting restocking wrong stops being abstract. Used
   in the problem section as evidence, not as a feature pitch.

   Layout follows the category convention (headline stat tiles over a
   per-ASIN table); colors are ours — green for the headline number,
   amber for units, red/amber pills for the no-stock / low-stock split.

   Data is the shared story: Ridgeline Apparel, shirts from Lianfa,
   hats from Dongfeng. Numbers are internally consistent — lost sales
   across the four rows sum to the headline figure, and missed units
   are avg-daily × days-out per row.
   ────────────────────────────────────────────────────────────── */

const ROWS = [
  {
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Red',
    asin: 'B0RDG7TEE1',
    thumb: bySku['SHIRT-RED-M'].img,
    skus: ['SHIRT-RED-M', 'SHIRT-RED-L'],
    noStock: 31, lowStock: 24, avgDaily: 42.3, lost: 18340,
  },
  {
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Black',
    asin: 'B0RDG4CAP2',
    thumb: bySku['HAT-BLK-OS'].img,
    skus: ['HAT-BLK-OS'],
    noStock: 22, lowStock: 18, avgDaily: 17.8, lost: 6930,
  },
  {
    title: 'Ridgeline Crew Tee — 100% Cotton, Preshrunk, Blue',
    asin: 'B0RDG7TEE3',
    thumb: bySku['SHIRT-BLU-L'].img,
    skus: ['SHIRT-BLU-L', 'SHIRT-BLU-M'],
    noStock: 14, lowStock: 20, avgDaily: 15.4, lost: 4180,
  },
  {
    title: 'Ridgeline Dad Cap — Washed Cotton, Adjustable, Navy',
    asin: 'B0RDG4CAP4',
    thumb: bySku['HAT-NVY-OS'].img,
    skus: ['HAT-NVY-OS'],
    noStock: 9, lowStock: 12, avgDaily: 6.9, lost: 1905,
  },
];

const RANGES = ['All Time', '30D', '90D', '12M'];
const ACTIVE_RANGE = '12M';

const GRID = 'grid grid-cols-[minmax(0,1fr)_128px_74px_84px] items-center gap-3';

function StatTile({ children, className = '', style }) {
  return (
    <div className={`rounded-2xl px-5 py-6 flex flex-col items-center justify-center text-center ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function LostSalesDemo() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      {/* header */}
      <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-clash font-semibold text-[19px] tracking-[-0.02em] text-[#1A1A1A]">Lost Sales Analysis</h4>
            <Info className="w-3.5 h-3.5 text-[#1A1A1A]/25" />
          </div>
          <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Identify and recover revenue from out-of-stock events.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#1A1A1A]/10 p-0.5">
            {RANGES.map(r => (
              <span key={r}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold whitespace-nowrap ${
                  r === ACTIVE_RANGE
                    ? 'border border-[#2F7D4F]/40 text-[#2F7D4F] bg-[#2F7D4F]/[0.06]'
                    : 'text-[#1A1A1A]/45'
                }`}>{r}</span>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white rounded-lg border border-[#2F7D4F]/30 px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: C.green }} />
            <span className="text-[10.5px] font-semibold" style={{ color: C.green }}>Aug 10, 2025 – Aug 10, 2026</span>
          </div>
        </div>
      </div>

      {/* stat tiles */}
      <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile className="text-white shadow-lg shadow-[#2F7D4F]/20"
          style={{ background: `linear-gradient(140deg, ${C.green} 0%, ${C.deep} 100%)` }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75 flex items-center gap-1.5">
            Total lost sales <Info className="w-3 h-3 opacity-60" />
          </span>
          <span className="font-clash font-semibold text-[38px] leading-none tracking-[-0.03em] mt-2">$31,355</span>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[9.5px] font-bold uppercase tracking-wide">
            <TrendingUp className="w-3 h-3" /> Recoverable
          </span>
        </StatTile>

        <StatTile className="text-white shadow-lg shadow-[#F59E0B]/20"
          style={{ background: `linear-gradient(140deg, ${C.amberBright} 0%, #E07C00 100%)` }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 flex items-center gap-1.5">
            Missed units <Info className="w-3 h-3 opacity-60" />
          </span>
          <span className="font-clash font-semibold text-[38px] leading-none tracking-[-0.03em] mt-2">1,978</span>
          <span className="mt-2 text-[9.5px] font-semibold uppercase tracking-wide text-white/75">Checkout opportunities</span>
        </StatTile>

        <StatTile className="bg-white border border-[#1A1A1A]/8 shadow-sm gap-3">
          <span className="rounded-full bg-[#1A1A1A]/[0.05] px-3 py-1 text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/50">
            Avg impact
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-clash font-semibold text-[26px] leading-none tracking-[-0.02em] text-[#1A1A1A]">19.0</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">days</span>
          </div>
          <div className="-mt-2 flex items-center gap-1.5">
            <span className="w-4 h-[3px] rounded-full" style={{ backgroundColor: C.red }} />
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/45">Avg no stock</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-clash font-semibold text-[26px] leading-none tracking-[-0.02em] text-[#1A1A1A]">18.5</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40">days</span>
          </div>
          <div className="-mt-2 flex items-center gap-1.5">
            <span className="w-4 h-[3px] rounded-full" style={{ backgroundColor: C.amber }} />
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/45">Avg low stock</span>
          </div>
        </StatTile>
      </div>

      {/* search */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#1A1A1A]/10 px-3 py-2 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#1A1A1A]/30" />
          <span className="text-[11.5px] text-[#1A1A1A]/35">Search by ASIN or SKU…</span>
        </div>
      </div>

      {/* table */}
      <div className="px-5 pb-5">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[540px]">
            <div className={`${GRID} px-4 py-2.5 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span>ASIN</span>
              <span className="text-right leading-tight">Days out<br />of stock</span>
              <span className="text-right leading-tight">Avg daily<br />sales</span>
              <span className="text-right leading-tight">Lost<br />sales</span>
            </div>

            {ROWS.map((r) => (
              <div key={r.asin} className={`${GRID} px-4 py-3 border-b border-[#1A1A1A]/6 last:border-b-0`}>
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-lg bg-[#1A1A1A]/[0.04] border border-[#1A1A1A]/8 flex items-center justify-center shrink-0">
                    <img src={r.thumb} alt="" className="w-7 h-7" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-medium text-[#1A1A1A]/85 truncate">{r.title}</span>
                    <span className="block text-[10px] font-medium truncate" style={{ color: '#2563EB' }}>
                      {r.asin}
                      <span className="text-[#1A1A1A]/35 font-normal"> · {r.skus.length} SKU{r.skus.length > 1 ? 's' : ''}</span>
                    </span>
                    <span className="block text-[9px] text-[#1A1A1A]/35 truncate font-mono">{r.skus.join('  ·  ')}</span>
                  </span>
                </span>

                <span className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
                    style={{ color: C.red, backgroundColor: 'rgba(220,38,38,0.10)' }}>
                    {r.noStock} NO STOCK
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
                    style={{ color: '#B45309', backgroundColor: 'rgba(245,158,11,0.16)' }}>
                    {r.lowStock} LOW STOCK
                  </span>
                </span>

                <span className="text-right text-[12px] tabular-nums text-[#1A1A1A]/70">{r.avgDaily.toFixed(1)}</span>
                <span className="text-right text-[13px] font-semibold tabular-nums text-[#1A1A1A]">
                  ${r.lost.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
