import { t } from './theme';

/* ──────────────────────────────────────────────────────────────
   ScreenshotSlot — a reserved, correctly-shaped space for a product
   screenshot that hasn't landed yet.

   Renders a themed placeholder until `src` is set; once the real
   image drops in, the layout doesn't move. Default shape is 16:10
   (a 1600×1000 dashboard capture; supply 2× for retina).

     <ScreenshotSlot label="Liquidation dashboard" accent="orange" />
     <ScreenshotSlot src="/shots/liquidation.png" alt="…" />
   ────────────────────────────────────────────────────────────── */
export default function ScreenshotSlot({
  dark,
  src,
  alt = '',
  label,
  accent = 'green',
  icon: Icon,
  ratio = '16 / 10',
  className = '',
}) {
  const frame = dark
    ? 'border border-white/10 shadow-2xl shadow-black/40'
    : 'border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/10';

  if (src) {
    return (
      <div className={`rounded-2xl overflow-hidden ${frame} ${className}`}>
        <img src={src} alt={alt} className="w-full h-auto block" />
      </div>
    );
  }

  const accentText = accent === 'orange' ? 'text-[#F59E0B]' : t.green(dark);
  const fill = dark
    ? 'border border-white/10 bg-gradient-to-br from-[#141618] to-[#1A1D21]'
    : (accent === 'orange'
        ? 'border border-[#F59E0B]/12 bg-gradient-to-br from-[#fdf7ef] to-[#fdf4e8]'
        : 'border border-[#2F7D4F]/12 bg-gradient-to-br from-[#f4faf6] to-[#e8f5ed]');

  return (
    <div
      className={`relative w-full rounded-2xl flex items-center justify-center overflow-hidden ${dark ? 'shadow-xl shadow-black/30' : 'shadow-xl shadow-[#1A1A1A]/5'} ${fill} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className={`flex flex-col items-center gap-3 px-6 text-center ${accentText}`}>
        {Icon && <Icon className="w-10 h-10" />}
        <span className={`text-sm font-medium ${dark ? 'text-white/45' : 'text-[#1A1A1A]/45'}`}>
          Screenshot — {label}
        </span>
      </div>
    </div>
  );
}
