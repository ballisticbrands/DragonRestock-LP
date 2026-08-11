import { motion } from 'framer-motion';
import Eyebrow from './Eyebrow';
import { ease, fadeUp, t } from './theme';

/* Centred section heading — eyebrow, title, optional sub. Shared by the
   landing page and the features page so the two stay typographically
   identical. */
export default function SectionHead({ dark, eyebrow, accent = 'green', title, sub, className = '' }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, ease }} className={`text-center ${className}`}>
      {eyebrow && <Eyebrow dark={dark} accent={accent}>{eyebrow}</Eyebrow>}
      <h2 className={`font-clash font-semibold text-3xl sm:text-4xl lg:text-[46px] leading-tight tracking-[-0.02em] max-w-3xl mx-auto ${t.heading(dark)}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 text-[17px] sm:text-[18px] max-w-2xl mx-auto leading-[1.6] ${t.muted(dark)}`}>{sub}</p>
      )}
    </motion.div>
  );
}
