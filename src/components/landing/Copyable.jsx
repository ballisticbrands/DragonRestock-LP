import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/* ──────────────────────────────────────────────────────────────
   Copyable — click an ASIN or a SKU to put it on the clipboard.

   No icon: an identifier in a dense table has no room for one, and a
   row of little clipboard glyphs reads as clutter. The affordance is
   the hover instead — a dotted underline and a tooltip naming what
   will be copied — and the tooltip doubles as the confirmation once
   the click lands.

   The tooltip renders through a PORTAL, positioned fixed from the
   element's own rect. Every one of these sits inside a table row with
   `overflow-hidden` and `truncate`, often inside an animated
   framer-motion wrapper, so an absolutely-positioned tooltip would be
   clipped by its own row — and a `transform` on any ancestor would
   capture position:fixed too. Going out to <body> escapes both.

   Copying stops propagation: nearly every one of these identifiers
   lives inside a button that expands the row, and copying an ASIN
   must not also toggle the panel underneath it.
   ────────────────────────────────────────────────────────────── */

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* clipboard API needs a secure context and a permissions grant;
       fall back to the old selection trick so http:// previews work */
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Copyable({ value, kind = 'SKU', className = '', children }) {
  const [tip, setTip] = useState(null);           // { x, y } in viewport coords
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const place = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setTip({ x: r.left + r.width / 2, y: r.top });
  };

  const hide = () => {
    setTip(null);
    setCopied(false);
    clearTimeout(timer.current);
  };

  const copy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await writeClipboard(value);
    setCopied(ok);
    place();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  const label = copied ? `Copied ${value}` : `Click to copy ${kind}`;

  return (
    <>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={`Copy ${kind} ${value}`}
        onClick={copy}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') copy(e);
          if (e.key === 'Escape') hide();
        }}
        onMouseEnter={place}
        onMouseLeave={hide}
        onFocus={place}
        onBlur={hide}
        className={`cursor-pointer underline decoration-dotted decoration-from-font underline-offset-2 decoration-transparent hover:decoration-current focus-visible:decoration-current transition-colors ${className}`}
      >
        {children ?? value}
      </span>

      {tip && createPortal(
        <span
          role="status"
          style={{ position: 'fixed', left: tip.x, top: tip.y - 8, transform: 'translate(-50%,-100%)', zIndex: 9999 }}
          className={`pointer-events-none whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold text-white shadow-lg ${
            copied ? 'bg-[#2F7D4F]' : 'bg-[#1A1A1A]/90'
          }`}
        >
          {label}
        </span>,
        document.body,
      )}
    </>
  );
}
