import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Sparkles, Check, X, FileText, AlertTriangle, Link2, Play, ArrowRight, Mail } from 'lucide-react';
import { C, ease } from './theme';

/* ──────────────────────────────────────────────────────────────
   CashflowDemo — the cashflow planner.

   Three phases, driven by one real click:

     1. UPLOAD    an invoice PDF is read (auto-plays on mount so the
                  panel demonstrates itself)
     2. MATCH     the model proposes which PO the invoice belongs to,
                  with its reasoning, and waits for you to approve —
                  this is the one interaction, and it stays a real
                  decision rather than something done silently
     3. REPORT    with the invoice linked, the cashflow report runs

   The report is modelled on the seller's own cash-flow skill output:
   due-now vs not-yet-due, Amazon settlements and reimbursements, cash
   on hand across Wise and Payoneer, a net 30-day position, and a
   heads-up section.

   The ledger's last column closes the loop the other way: once an
   invoice is linked it can be posted to Xero or QuickBooks, so the
   seller isn't keying the same bill in twice. That's the second real
   click in the panel.

   The heads-up is the part that earns the feature. The 30-day net
   position is positive — but the Lianfa deposit falls due a week
   before the Amazon payout clears, so there's a gap in the middle of
   an otherwise healthy month. A total can't show you that; a timeline
   can. Every figure below is derived from the invoice rows.
   ────────────────────────────────────────────────────────────── */

const money = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const INVOICES = [
  { inv: 'LF-2026-089', supplier: 'Lianfa Textiles', po: 'SHIRT#189', type: 'Production', deposit: 351, balance: 819, dep: 'Y', bal: 'Y', due: 'Jul 4', synced: true },
  { inv: 'DF-2026-041', supplier: 'Dongfeng Headwear', po: 'HAT#20', type: 'Production', deposit: 336, balance: 784, dep: 'Y', bal: 'Y', due: 'Jun 18', synced: true },
  { inv: 'TX-2060', supplier: 'Talex Freight', po: null, type: 'Shipping', deposit: 0, balance: 2840, dep: '—', bal: 'N', due: 'Aug 5', overdue: true, synced: false },
  { inv: 'DF-2026-047', supplier: 'Dongfeng Headwear', po: 'HAT#21', type: 'Production', deposit: 538, balance: 1254, dep: 'Y', bal: 'N', due: 'Aug 22', synced: true },
  { inv: 'LF-2026-094', supplier: 'Lianfa Textiles', po: 'SHIRT#190', type: 'Production', deposit: 1404, balance: 3276, dep: 'Y', bal: 'P', due: 'Sep 2', synced: true },
];

/* The connected stack is shown as a logo strip above this panel, on the
   page itself — see INTEGRATIONS in pages/Demo.jsx. */

const NEW_INVOICE = {
  inv: 'LF-2026-101', supplier: 'Lianfa Textiles', po: 'SHIRT#191', type: 'Production',
  deposit: 1989, balance: 4641, dep: 'N', bal: 'N', due: 'Aug 18', isNew: true, synced: false,
};

const DUE_30 = [
  { label: 'TX-2060 · Talex freight', amount: 2840, due: 'Aug 5', overdue: true },
  { label: 'LF-2026-101 deposit · PO SHIRT#191', amount: 1989, due: 'Aug 18', fresh: true },
  { label: 'DF-2026-047 balance · PO HAT#21', amount: 1254, due: 'Aug 22' },
  { label: 'LF-2026-094 balance · PO SHIRT#190', amount: 3276, due: 'Sep 2' },
];
const DUE_TOTAL = DUE_30.reduce((n, d) => n + d.amount, 0);      // 9,359
const LATER = [
  { label: 'LF-2026-101 balance · PO SHIRT#191', amount: 4641 },
  { label: 'DF-2026-053 · PO HAT#22', amount: 2240 },
];
const LATER_TOTAL = LATER.reduce((n, d) => n + d.amount, 0);     // 6,881

const CASH = 3120;
const PAYOUT = 8420;
const REIMB = 412;          // already inside the payout above, shown separately
const PAYOUT_DATE = 'Aug 25';
const NET = CASH - DUE_TOTAL + PAYOUT;                            // +5,301
/* The squeeze: everything falling due before the payout lands. */
const BEFORE_PAYOUT = DUE_30.filter(d => ['Aug 5', 'Aug 18', 'Aug 22'].includes(d.due)).reduce((n, d) => n + d.amount, 0);
const GAP = CASH - BEFORE_PAYOUT;                                 // −(shortfall)

const PAID = { Y: { text: 'Y', color: C.green, bg: 'rgba(47,125,79,0.12)' }, P: { text: 'P', color: '#B45309', bg: 'rgba(245,158,11,0.20)' }, N: { text: 'N', color: C.red, bg: 'rgba(220,38,38,0.10)' }, '—': { text: '–', color: 'rgba(26,26,26,0.30)', bg: 'transparent' } };

const GRID = 'grid grid-cols-[100px_minmax(120px,1fr)_78px_72px_72px_58px_58px_62px_96px] items-center gap-2';

function Flag({ v }) {
  const p = PAID[v];
  return (
    <span className="flex justify-center">
      <span className="w-5 h-5 rounded flex items-center justify-center text-[9.5px] font-bold"
        style={{ color: p.color, backgroundColor: p.bg }}>{p.text}</span>
    </span>
  );
}

/* The sync cell. Every row but the new one is settled either way; the
   new one carries the button, which is the second click in the demo. */
function SyncCell({ r, state, onSend }) {
  if (!r.isNew) {
    return r.synced ? (
      <span className="flex items-center justify-center gap-1" title="Synced to Xero">
        <Check className="w-3 h-3 shrink-0" style={{ color: C.green }} />
        <img src="/logos/xero.svg" alt="Xero" className="w-3 h-3 opacity-80" />
      </span>
    ) : (
      <span className="flex justify-center text-[9.5px] text-[#1A1A1A]/25">Not synced</span>
    );
  }

  if (state === 'sent') {
    return (
      <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
        className="flex items-center justify-center gap-1 text-[9px] font-bold" style={{ color: C.green }}>
        <Check className="w-3 h-3 shrink-0" /> Sent
        <img src="/logos/xero.svg" alt="Xero" className="w-3 h-3" />
      </motion.span>
    );
  }

  if (state === 'sending') {
    return (
      <span className="flex items-center justify-center gap-1 text-[9px] font-semibold text-[#1A1A1A]/55">
        <Loader2 className="w-3 h-3 shrink-0 animate-spin" style={{ color: C.indigo }} /> Sending…
      </span>
    );
  }

  return (
    <motion.button type="button" onClick={onSend}
      animate={{ scale: [1, 1.045, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      className="flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
      style={{ backgroundColor: C.green }}>
      <img src="/logos/xero.svg" alt="" className="w-3 h-3" /> Send to Xero
    </motion.button>
  );
}

function InvoiceRow({ r, syncState, onSend }) {
  return (
    <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/6 last:border-b-0 text-[10.5px] ${r.isNew ? 'bg-[#2F7D4F]/[0.05]' : ''}`}>
      <span className="font-mono text-[9.5px] font-semibold text-[#1A1A1A]/80 truncate">{r.inv}</span>
      <span className="min-w-0">
        <span className="block text-[#1A1A1A]/75 truncate">{r.supplier}</span>
        {r.po && (
          <span className="inline-flex items-center gap-1 text-[8.5px] font-semibold" style={{ color: C.indigo }}>
            <Link2 className="w-2.5 h-2.5" />PO {r.po}
          </span>
        )}
      </span>
      <span className="text-[9.5px] text-[#1A1A1A]/45">{r.type}</span>
      <span className="text-right tabular-nums text-[#1A1A1A]/60">{r.deposit ? money(r.deposit) : '—'}</span>
      <span className="text-right tabular-nums font-semibold text-[#1A1A1A]/85">{money(r.balance)}</span>
      <Flag v={r.dep} />
      <Flag v={r.bal} />
      <span className={`text-right tabular-nums text-[9.5px] ${r.overdue ? 'font-bold' : 'text-[#1A1A1A]/50'}`}
        style={r.overdue ? { color: C.red } : undefined}>{r.due}</span>
      <SyncCell r={r} state={syncState} onSend={onSend} />
    </div>
  );
}

function Section({ emoji, title, amount, tone }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-1.5">
      <span className="text-[11.5px] font-bold text-[#1A1A1A]">{emoji} {title}</span>
      {amount != null && (
        <span className="text-[13px] font-bold tabular-nums" style={{ color: tone ?? '#1A1A1A' }}>{amount}</span>
      )}
    </div>
  );
}

export default function CashflowDemo() {
  /* idle → reading → matched → (click) → linked → report */
  const [phase, setPhase] = useState('idle');
  /* the ledger hand-off, driven by its own click: idle → sending → sent */
  const [syncState, setSyncState] = useState('idle');

  useEffect(() => {
    if (phase !== 'reading') return;
    const t = setTimeout(() => setPhase('matched'), 1100);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'linked') return;
    const t = setTimeout(() => setPhase('report'), 700);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (syncState !== 'sending') return;
    const t = setTimeout(() => setSyncState('sent'), 1400);
    return () => clearTimeout(t);
  }, [syncState]);

  const replay = () => { setPhase('idle'); setSyncState('idle'); };

  const rows = phase === 'linked' || phase === 'report' ? [NEW_INVOICE, ...INVOICES] : INVOICES;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/15 select-none text-left">
      <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-clash font-semibold text-[19px] tracking-normal text-[#1A1A1A]">Cashflow Planner</h4>
          <p className="text-[12px] text-[#1A1A1A]/50 mt-0.5">Supplier invoices, matched to POs, priced against the money actually coming in.</p>
        </div>
        {phase === 'report' && (
          /* Same nudge as the Process button, so anyone who watched it
             run once can see how to run it again. */
          <span className="flex items-center gap-2 shrink-0">
            <motion.span className="flex items-center gap-1.5 text-[10.5px] font-semibold"
              style={{ color: C.indigo }}
              animate={{ x: [0, 4, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
              Run it again <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
            <button type="button" onClick={replay}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10.5px] font-semibold transition-colors hover:bg-[#5B5BD6]/[0.06]"
              style={{ borderColor: 'rgba(91,91,214,0.35)', color: C.indigo }}>
              <Play className="w-3 h-3" /> Replay
            </button>
          </span>
        )}
      </div>

      {/* phase 1–2 · upload and match */}
      <div className="px-5 pb-4">
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'reading') && (
            <motion.div key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {/* Set the scene, so a visitor knows which moment they're
                  standing in and what they're being asked to do. */}
              <div className="flex items-start gap-2 mb-2.5 px-0.5">
                <Mail className="w-3.5 h-3.5 shrink-0 mt-[1px] text-[#1A1A1A]/35" />
                <p className="text-[11px] leading-snug text-[#1A1A1A]/55">
                  <span className="font-semibold text-[#1A1A1A]/75">Wei has just emailed the invoice</span> for the tees you
                  ordered from Lianfa. Process it — everything after that is DragonRestock’s job.
                </p>
              </div>

              <div className="rounded-xl border border-[#1A1A1A]/12 bg-white px-4 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}>
                    <FileText className="w-4 h-4" style={{ color: C.red }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-[#1A1A1A]/85 truncate">LF-2026-101.pdf</span>
                    <span className="block text-[10px] text-[#1A1A1A]/40">Attached · 248 KB · Lianfa Textiles</span>
                  </span>
                </span>

                {phase === 'idle' && (
                  <motion.span className="flex items-center gap-1.5 text-[10.5px] font-semibold shrink-0"
                    style={{ color: C.indigo }}
                    animate={{ x: [0, 4, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
                    Click to read it <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                )}

                <button type="button" onClick={() => setPhase('reading')} disabled={phase === 'reading'}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[11.5px] font-bold text-white shadow-sm shrink-0 hover:opacity-90 transition-opacity disabled:opacity-70"
                  style={{ backgroundColor: C.green }}>
                  {phase === 'reading'
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing…</>
                    : <><Upload className="w-3.5 h-3.5" /> Process invoice</>}
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'matched' && (
            <motion.div key="match" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease }}
              className="rounded-xl px-4 py-3.5" style={{ backgroundColor: 'rgba(91,91,214,0.055)', border: '1px solid rgba(91,91,214,0.20)' }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide" style={{ color: C.indigo }}>
                  <Sparkles className="w-3 h-3" /> Invoice read · likely match
                </span>
                <span className="text-[9px] font-bold tabular-nums" style={{ color: C.indigo }}>98% confident</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 shrink-0 text-[#1A1A1A]/40" />
                <span className="text-[12px] font-bold text-[#1A1A1A]">LF-2026-101 → PO SHIRT#191</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-[#1A1A1A]/65">
                $6,630 from Lianfa Textiles for 1,700 units — 1,200 × SHIRT-RED-M and 500 × SHIRT-GRN-S, which is
                exactly what PO SHIRT#191 covers at your $3.90 landed cost. The 30/70 split matches Lianfa’s terms on file.
                Link them so the deposit and balance land on your cashflow?
              </p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => setPhase('linked')}
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[10.5px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: C.green }}>
                  <Check className="w-3.5 h-3.5" /> Yes, link them
                </button>
                <button type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-[#1A1A1A]/12 bg-white px-3 py-2 text-[10.5px] font-semibold text-[#1A1A1A]/45">
                  <X className="w-3.5 h-3.5" /> Not a match
                </button>
              </div>
            </motion.div>
          )}

          {(phase === 'linked' || phase === 'report') && (
            <motion.div key="linked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
              className="rounded-xl px-4 py-2.5 flex items-center gap-2.5"
              style={{ backgroundColor: 'rgba(47,125,79,0.07)', border: '1px solid rgba(47,125,79,0.22)' }}>
              {phase === 'linked'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: C.green }} />
                : <Check className="w-3.5 h-3.5 shrink-0" style={{ color: C.green }} />}
              <span className="text-[11px] font-semibold text-[#1A1A1A]/75">
                {phase === 'linked' ? 'Linked. Running the cashflow report…' : 'LF-2026-101 linked to PO SHIRT#191 · cashflow updated'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the invoice ledger */}
      <div className="px-5 pb-4">
        <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className={`${GRID} px-3 py-2 border-b border-[#1A1A1A]/8 text-[8.5px] font-bold uppercase tracking-wide text-[#1A1A1A]/40`}>
              <span>Invoice #</span><span>Supplier</span><span>Type</span>
              <span className="text-right leading-tight">Deposit<br />30%</span>
              <span className="text-right leading-tight">Balance<br />70%</span>
              <span className="text-center leading-tight">Deposit<br />paid</span>
              <span className="text-center leading-tight">Balance<br />paid</span>
              <span className="text-right">Due</span>
              <span className="text-center leading-tight">Synced<br />to Xero</span>
            </div>
            {rows.map(r => (
              <InvoiceRow key={r.inv} r={r}
                syncState={syncState} onSend={() => setSyncState('sending')} />
            ))}
          </div>
        </div>

        {/* the second prompt — only once the invoice is actually on the ledger */}
        <AnimatePresence mode="wait">
          {phase === 'report' && syncState !== 'sent' && (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="mt-2 px-1 text-[10px] text-[#1A1A1A]/45">
              {syncState === 'sending'
                ? 'Posting LF-2026-101 to Xero…'
                : 'LF-2026-101 is the only one not in your books yet — send it across.'}
            </motion.p>
          )}
          {syncState === 'sent' && (
            <motion.p key="sent" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease }}
              className="mt-2 px-1 flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: C.green }}>
              <Check className="w-3 h-3 shrink-0" />
              Posted to Xero as bill LF-2026-101 — Lianfa Textiles, $6,630, due Aug 18. No re-keying.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* phase 3 · the report */}
      <AnimatePresence>
        {phase === 'report' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }} className="overflow-hidden">
            <div className="px-5 pb-5">
              <div className="bg-white rounded-xl border border-[#1A1A1A]/8 p-4">
                <h5 className="font-clash font-semibold text-[15px] text-[#1A1A1A] mb-3 pb-2.5 border-b border-[#1A1A1A]/8">
                  💸 Cash Flow Summary — August 11, 2026
                </h5>

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Section emoji="⚠️" title="Due within 30 days" amount={money(DUE_TOTAL)} tone={C.red} />
                    {DUE_30.map(d => (
                      <div key={d.label} className="flex items-baseline justify-between gap-2 py-[3px] text-[10px]">
                        <span className={`truncate ${d.fresh ? 'font-semibold' : ''}`} style={d.fresh ? { color: C.green } : { color: 'rgba(26,26,26,0.6)' }}>
                          {d.label}{d.fresh && ' ← new'}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0 tabular-nums">
                          <span className="font-semibold text-[#1A1A1A]/80">{money(d.amount)}</span>
                          <span className="text-[9px]" style={d.overdue ? { color: C.red, fontWeight: 700 } : { color: 'rgba(26,26,26,0.35)' }}>
                            {d.due}{d.overdue ? ' ⚠️' : ''}
                          </span>
                        </span>
                      </div>
                    ))}

                    <div className="mt-3.5">
                      <Section emoji="📅" title="Not yet due (30+ days)" amount={money(LATER_TOTAL)} />
                      {LATER.map(d => (
                        <div key={d.label} className="flex items-baseline justify-between gap-2 py-[3px] text-[10px]">
                          <span className="truncate text-[#1A1A1A]/60">{d.label}</span>
                          <span className="tabular-nums font-semibold text-[#1A1A1A]/80">{money(d.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Section emoji="💵" title="Amazon payouts" />
                    <div className="flex items-baseline justify-between gap-2 py-[3px] text-[10px]">
                      <span className="text-[#1A1A1A]/60">US · settled Jul 28 – Aug 11</span>
                      <span className="tabular-nums font-semibold text-[#1A1A1A]/80">{money(PAYOUT)}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 py-[3px] text-[10px]">
                      <span className="text-[#1A1A1A]/60">of which reimbursements approved</span>
                      <span className="tabular-nums text-[#1A1A1A]/55">{money(REIMB)}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 py-[3px] text-[10px]">
                      <span className="text-[#1A1A1A]/60">Deposits {PAYOUT_DATE}</span>
                      <span className="text-[9px] text-[#1A1A1A]/35">in transit</span>
                    </div>

                    <div className="mt-3.5">
                      <Section emoji="💰" title="Cash on hand" amount={money(CASH)} />
                      <div className="flex items-center gap-1.5 py-[3px]">
                        <img src="/logos/wise.svg" alt="Wise" className="w-3 h-3" />
                        <span className="text-[9.5px] text-[#1A1A1A]/45">Wise $2,180</span>
                        <img src="/logos/payoneer.svg" alt="Payoneer" className="w-3 h-3 ml-1" />
                        <span className="text-[9.5px] text-[#1A1A1A]/45">Payoneer $940 · synced 09:40 UTC</span>
                      </div>
                    </div>

                    <div className="mt-3.5 rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(47,125,79,0.07)', border: '1px solid rgba(47,125,79,0.20)' }}>
                      <Section emoji="📊" title="Net 30-day position" amount={`+${money(NET)}`} tone={C.green} />
                      <div className="text-[9.5px] text-[#1A1A1A]/50">
                        {money(CASH)} on hand − {money(DUE_TOTAL)} due + {money(PAYOUT)} inbound
                      </div>
                    </div>
                  </div>
                </div>

                {/* the reason the feature exists */}
                <div className="mt-4 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
                  style={{ backgroundColor: '#F5ECEE', border: '1px solid #F0C4C5' }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.red }} />
                  <p className="text-[10.5px] leading-relaxed text-[#1A1A1A]/70">
                    <span className="font-bold text-[#1A1A1A]">The month nets out fine — the middle of it doesn’t.</span>{' '}
                    {money(BEFORE_PAYOUT)} falls due before the Amazon payout lands on {PAYOUT_DATE}, and you’re holding {money(CASH)}.
                    That’s <span className="font-bold" style={{ color: C.red }}>{money(Math.abs(GAP))} short on Aug 22</span>, three days early.
                    Ask Lianfa to bill the deposit on the 26th, or move {money(Math.abs(GAP))} across now — either one closes it.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
