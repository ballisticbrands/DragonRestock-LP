import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { C } from './theme';

/* ──────────────────────────────────────────────────────────────
   KnowledgeCenterDemo — the AI Knowledge Center, as a document
   browser rather than a notes feed.

   The operating knowledge that never makes it into a system: when a
   factory shuts, which SKU needs a fatter buffer, who signs off a big
   PO. It lives as plain markdown files in a folder tree, so it can be
   read, edited, and versioned — and every teammate's Claude reads the
   same files.

   The completeness meter at the top is the honest part: it says how
   much of the handbook actually exists yet. Amber and red segments
   are folders the model knows it's missing, which is what turns this
   from a passive store into something that chases you for the rest.

   Story data throughout — Lianfa and Dongfeng, the flag SKUs, the
   77-day lead time, the $10k approval rule.
   ────────────────────────────────────────────────────────────── */

const TREE = [
  {
    name: 'BUSINESS', captured: 3, total: 3,
    files: ['overview.md', 'brands-and-portfolio.md', 'marketplaces.md'],
  },
  {
    name: 'PRODUCTS', captured: 5, total: 7,
    files: ['catalog.md', 'seasonality-and-events.md', 'pricing-tiers.md', 'bundles.md', 'returns-and-defects.md'],
  },
  {
    name: 'SOURCING', captured: 5, total: 5,
    files: ['supplier-directory.md', 'freight-and-lanes.md', 'quality-and-inspection.md', 'payment-terms.md', 'packaging-specs.md'],
  },
  {
    name: 'INVENTORY', captured: 4, total: 6,
    files: ['safety-stock-rules.md', 'restock-policy.md', 'liquidation-policy.md', 'warehouse-map.md'],
  },
  {
    name: 'OPERATIONS', captured: 3, total: 5,
    files: ['approval-policy.md', 'team-and-roles.md', 'sop-po-to-checkin.md'],
  },
];

const DOCS = {
  'supplier-directory.md': {
    path: '04-sourcing/supplier-directory.md',
    title: 'Supplier Directory',
    description: 'All suppliers: contacts, terms, lead times, quirks',
    purpose: 'Every supplier in ONE doc — contacts, terms, MOQ and lead-time behaviour, reliability, relationship history.',
    sections: [
      {
        heading: 'Lianfa Textiles — Ningbo',
        lines: [
          ['Lines', 'Crew tees (SHIRT-RED-M, SHIRT-BLU-L, SHIRT-GRN-S) and the flag tee (SHIRT-USA-M). Roughly 70% of units.'],
          ['Contact', 'Wei, production. WeChat preferred — replies inside 40 minutes before 10am China time. Email averages two days.'],
          ['Terms', '30% deposit on PO, 70% on completion. MOQ 500 units per SKU, case pack 40.'],
          ['Lead time', '25 days production + 45 days ocean + 7 days check-in (77 total — plan against this, not their quoted 60).'],
          ['CNY', 'Closes Feb 10 to Mar 3 every year. The real cutoff is one week before closure; POs placed after that do not start until they reopen. This pulls the January reorder point three weeks earlier.'],
          ['Reliability', '8/10. Last four orders ran 3–6 days late — the forecast already assumes it.'],
        ],
      },
      {
        heading: 'Dongfeng Headwear — Dongguan',
        lines: [
          ['Lines', 'Dad caps (HAT-BLK-OS, HAT-NVY-OS, HAT-RED-OS) and the flag cap (HAT-USA-OS).'],
          ['Contact', 'Mei, email, cc the shared inbox. Slower than Wei but never misses a message.'],
          ['Terms', '30% deposit, 70% before the container ships. MOQ 400 units, case pack 40.'],
          ['Lead time', '25 + 45 + 7, consistent. No padding needed.'],
          ['CNY', 'Closes Feb 12 to Mar 1. Also takes Golden Week, Oct 1–7 — a week nobody remembers until a PO stalls.'],
          ['Reliability', '9/10. One late shipment in two years.'],
        ],
      },
    ],
  },
  'seasonality-and-events.md': {
    path: '02-products/seasonality-and-events.md',
    title: 'Seasonality & Events',
    description: 'What moves demand, and what only looks like it does',
    purpose: 'Calendar effects per SKU group, so the forecast separates real demand from events.',
    sections: [
      {
        heading: 'Flag SKUs — SHIRT-USA-M, HAT-USA-OS',
        lines: [
          ['Window', 'Sell from roughly June 20 to July 4. Dead on July 5, back the following June.'],
          ['Rule', 'Never discount them in August. Holding to next June returns more than clearing, even after ten months of storage.'],
          ['Ordering', 'Place with Lianfa and Dongfeng by mid-March to land before the window opens.'],
        ],
      },
      {
        heading: 'Prime Day',
        lines: [
          ['2026', 'July 23–26. Units ran about 3× baseline across the whole catalogue.'],
          ['Rule', 'Excluded from the velocity baseline. It shapes the Q4 buy; it does not set the daily run rate.'],
        ],
      },
      {
        heading: 'Q4',
        lines: [
          ['Lift', '1.6× from Oct 12 on tees, 1.3× from Nov 1 on caps.'],
          ['Source', 'Learned from three years of this account, not a category average.'],
        ],
      },
    ],
  },
  'safety-stock-rules.md': {
    path: '03-inventory/safety-stock-rules.md',
    title: 'Safety Stock Rules',
    description: 'Buffer days by SKU and why they differ',
    purpose: 'The cushion each SKU carries, and the reasoning, so nobody quietly resets it to the default.',
    sections: [
      {
        heading: 'Defaults',
        lines: [
          ['Baseline', '14 days on everything unless overridden below.'],
          ['Off-site', '3PL stock does not count toward cover until it is sent in to FBA.'],
        ],
      },
      {
        heading: 'Overrides',
        lines: [
          ['SHIRT-RED-M', '21 days. Q4 swings hard on this SKU and Lianfa runs 3–6 days late.'],
          ['HAT-BLK-OS', '18 days. Ordering has to clear Dongfeng before Chinese New Year or the next slot is February.'],
          ['Flag SKUs', 'No buffer. The window is fixed; leftover units are a liquidation problem, not a stockout risk.'],
        ],
      },
    ],
  },
  'approval-policy.md': {
    path: '05-operations/approval-policy.md',
    title: 'Approvals & Ownership',
    description: 'Who can approve what, and who to ask',
    purpose: 'Stops POs sitting unapproved because nobody knew whose call it was.',
    sections: [
      {
        heading: 'Who’s who',
        lines: [
          ['Priya (VA)', 'Day-to-day ordering and supplier follow-up. Places routine POs, chases production, keeps the tracker current.'],
          ['Dana (logistics manager)', 'Freight, liquidation, and anything with real money attached. Owns the container bookings and the removal orders.'],
        ],
      },
      {
        heading: 'Purchase orders',
        lines: [
          ['Under $10,000', 'Priya can approve and place the order without asking.'],
          ['Over $10,000', 'Needs Dana. Applies to every supplier, no exceptions.'],
          ['Air freight', 'Always Dana, at any value.'],
        ],
      },
      {
        heading: 'Pricing',
        lines: [
          ['Tier changes', 'Priya can move a SKU down one tier. Two or more tiers needs Dana.'],
          ['Liquidation', 'Removal orders and disposals always need Dana.'],
        ],
      },
    ],
  },
};

function Meta({ label, children, mono }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2 border-b border-[#1A1A1A]/6 last:border-b-0">
      <span className="w-[86px] shrink-0 text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#1A1A1A]/40 pt-0.5">{label}</span>
      <span className={`text-[10.5px] leading-relaxed text-[#1A1A1A]/70 ${mono ? 'font-mono text-[10px]' : ''}`}>{children}</span>
    </div>
  );
}

export default function KnowledgeCenterDemo() {
  const [active, setActive] = useState('supplier-directory.md');
  const doc = DOCS[active];

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      {/* completeness readout. No segmented bar under it: sixteen blocks
          coloured green/amber/red implied a per-segment meaning the demo
          never had — the folder counts in the tree are the real breakdown. */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]/50">
            Memory completeness <span className="text-[#1A1A1A] text-[11px]">79%</span>
          </span>
          <span className="text-[10px] text-[#1A1A1A]/40 tabular-nums">68 / 86 documents captured</span>
        </div>
      </div>

      <div className="px-5 pb-5 grid md:grid-cols-[188px_1fr] gap-3">
        {/* file tree */}
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 p-2 max-h-[400px] overflow-y-auto">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
            <FileText className="w-3 h-3 shrink-0" style={{ color: '#2563EB' }} />
            <span className="text-[10.5px] font-medium" style={{ color: '#2563EB' }}>README.md</span>
          </div>

          {TREE.map(folder => (
            <div key={folder.name} className="mb-2">
              <div className="flex items-center justify-between px-2 py-1 rounded-md bg-[#1F2937]">
                <span className="text-[8.5px] font-bold tracking-[0.08em] text-white">{folder.name}</span>
                <span className="text-[8.5px] font-bold tabular-nums"
                  style={{ color: folder.captured === folder.total ? '#4ADE80' : '#FBBF24' }}>
                  {folder.captured}/{folder.total}
                </span>
              </div>
              <div className="pt-1">
                {folder.files.map(f => {
                  const isDoc = Boolean(DOCS[f]);
                  const isActive = f === active;
                  return (
                    <button key={f} type="button" disabled={!isDoc}
                      onClick={() => isDoc && setActive(f)}
                      className={`w-full flex items-center gap-1.5 px-2 py-[5px] rounded-md text-left transition-colors ${
                        isActive ? 'bg-[#2563EB]/10' : isDoc ? 'hover:bg-[#1A1A1A]/[0.04]' : ''
                      }`}>
                      <FileText className="w-3 h-3 shrink-0" style={{ color: isDoc ? '#2563EB' : 'rgba(26,26,26,0.25)' }} />
                      <span className={`text-[10px] truncate ${isActive ? 'font-bold' : ''}`}
                        style={{ color: isDoc ? '#2563EB' : 'rgba(26,26,26,0.35)' }}>{f}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* document */}
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 p-4 max-h-[400px] overflow-y-auto">
          <div className="rounded-lg border border-[#1A1A1A]/8 px-3.5 py-1 mb-4">
            <Meta label="Description">{doc.description}</Meta>
            <Meta label="Purpose">{doc.purpose}</Meta>
            <Meta label="File" mono>{doc.path}</Meta>
          </div>

          <h5 className="font-clash font-semibold text-[20px] tracking-[-0.015em] text-[#1A1A1A] mb-3">{doc.title}</h5>

          {doc.sections.map(sec => (
            <div key={sec.heading} className="mb-4 last:mb-0">
              <h6 className="font-clash font-semibold text-[14px] tracking-[-0.01em] text-[#1A1A1A] mb-1.5">{sec.heading}</h6>
              <p className="text-[11px] leading-[1.75] text-[#1A1A1A]/70">
                {sec.lines.map(([label, text], i) => (
                  <span key={label}>
                    {i > 0 && ' '}
                    <span className="font-bold text-[#1A1A1A]">{label}:</span> {text}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* the point of the whole thing */}
      <div className="mx-5 mb-5 rounded-xl px-5 py-4 flex items-start gap-3"
        style={{ backgroundColor: 'rgba(91,91,214,0.05)', border: '1px solid rgba(91,91,214,0.16)' }}>
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.indigo }} />
        <p className="text-[14px] leading-relaxed text-[#1A1A1A]/65">
          <span className="font-bold text-[#1A1A1A]">Priya, your VA, reads the same files you do.</span>{' '}
          Ask either one when Lianfa shuts for New Year and you get the same answer — and the amber counts beside each folder are
          the parts DragonRestock knows are still missing, so it keeps asking until they’re filled in.
        </p>
      </div>
    </div>
  );
}
