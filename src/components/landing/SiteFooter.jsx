import { CONTACT_EMAIL, COMPANY, COMPANY_ADDRESS } from '../../config';

/* ─── Site footer — deep-green band, mirrors the DragonReply footer ─── */
export default function SiteFooter() {
  return (
    <footer className="bg-[#0F3D2E] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <img src="/DragonBot-logo.png" alt="DragonRestock" className="h-8" />
            <span className="font-bold text-lg text-white">DragonRestock</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">Product</a>
            <a href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Privacy</a>
            <a href="/tos" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Terms</a>
            <a href="/support" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Support</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-white/50 hover:text-white transition-colors">{CONTACT_EMAIL}</a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} {COMPANY}. All rights reserved.</p>
            <p className="text-xs text-white/20 mt-1">{COMPANY_ADDRESS}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
