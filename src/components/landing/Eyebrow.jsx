/* ─── Eyebrow pill (accent: 'green' | 'orange' | 'indigo') ───
   Amber is a light hue, so it needs a stronger fill than the darker
   green to read as a pill on white — otherwise the orange eyebrows
   look border-less. Indigo (#5B5BD6) is the site's AI color: anything
   the model does rather than a setting you configure. */
const TINTS = {
  orange: {
    light: 'bg-[#F59E0B]/20 text-[#B45309]',
    dark: 'bg-[#F59E0B]/20 text-[#F5C451]',
    dot: 'bg-[#FF9900]',
  },
  indigo: {
    light: 'bg-[#5B5BD6]/12 text-[#4B4BC4]',
    dark: 'bg-[#5B5BD6]/20 text-[#A5A5F0]',
    dot: 'bg-[#5B5BD6]',
  },
  green: {
    light: 'bg-[#2F7D4F]/10 text-[#2F7D4F]',
    dark: 'bg-[#98CC65]/15 text-[#98CC65]',
    dot: 'bg-[#98CC65]',
  },
};

export default function Eyebrow({ dark, accent = 'green', children }) {
  const { light, dark: darkTint, dot } = TINTS[accent] ?? TINTS.green;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-7 ${dark ? darkTint : light}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {children}
    </span>
  );
}
