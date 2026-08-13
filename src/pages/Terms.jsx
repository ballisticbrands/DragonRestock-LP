const sysFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function Terms() {
  return (
    <div className="db-page min-h-screen bg-[#0F0F0F] text-white" style={{ fontFamily: sysFont }}>
      <style>{`.db-page h1,.db-page h2,.db-page h3,.db-page h4,.db-page h5,.db-page h6{font-family:inherit!important}`}</style>
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <a href="/" className="inline-flex items-center gap-2 mb-10 text-sm text-[#98CC65] hover:text-[#2F7D4F] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to DragonRestock
          </a>
          <div className="flex items-center gap-3 mb-4">
            <img src="/DragonBot-logo.png" alt="DragonRestock" className="h-8" />
            <span className="text-sm font-medium text-[#2F7D4F] bg-[#2F7D4F]/10 px-3 py-1 rounded-full">Legal</span>
          </div>
          <h1 className="font-extrabold text-4xl">Terms of Service</h1>
          <p className="mt-3 text-white/40 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-white/70 leading-relaxed mb-8">
          These Terms of Service ("Terms") govern your use of DragonRestock, operated by Chacha Advisory LLC ("Company", "we", "us", "our"), located at 30 N Gould St Ste R, Sheridan, WY 82801, USA. By accessing or using DragonRestock (the "Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <div className="space-y-12">

          <section>
            <h2 className="font-bold text-xl mb-4">1. Description of Service</h2>
            <p className="text-white/70 leading-relaxed">DragonRestock is an AI-powered assistant that connects to your eCommerce tools (including Amazon Seller Central via the official SP-API) and performs tasks on your behalf. The Service operates through Slack and integrates with third-party platforms you choose to connect.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">2. Eligibility</h2>
            <p className="text-white/70 leading-relaxed">You must be at least 18 years old and have the authority to bind the entity on whose behalf you are using the Service. By using DragonRestock, you represent and warrant that you meet these requirements.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">3. Account Registration</h2>
            <p className="text-white/70 leading-relaxed">You create an account by signing in through Slack. You are responsible for maintaining the security of your account and all activities that occur under it. You agree to notify us immediately of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">4. Acceptable Use</h2>
            <p className="text-white/70 leading-relaxed mb-3">You agree to use the Service only for lawful purposes and in compliance with these Terms. You may not:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
              <li>Use the Service to violate any applicable law or regulation</li>
              <li>Use the Service to violate Amazon's Terms of Service or any other platform's terms</li>
              <li>Attempt to gain unauthorized access to other users' data or accounts</li>
              <li>Use the Service to send spam, phishing, or malicious content</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use the Service to scrape, crawl, or otherwise extract data from third-party platforms in violation of their terms</li>
              <li>Resell, sublicense, or redistribute access to the Service without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">5. Third-Party Integrations</h2>
            <p className="text-white/70 leading-relaxed">The Service integrates with third-party platforms (Amazon, Google, Shopify, Slack, etc.). Your use of these integrations is subject to the respective platform's terms of service. We are not responsible for the availability, accuracy, or policies of third-party services. You authorize DragonRestock to access and interact with these services on your behalf within the permission level you configure.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">6. Amazon SP-API Usage</h2>
            <p className="text-white/70 leading-relaxed">DragonRestock accesses Amazon data through the official Selling Partner API. We comply with Amazon's Data Protection Policy and Acceptable Use Policy. You acknowledge that your use of DragonRestock in connection with Amazon is also subject to Amazon's terms. We will not use Amazon data for purposes other than providing the Service to you as authorized.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">7. Credits & Billing</h2>
            <p className="text-white/70 leading-relaxed mb-3">The Service uses a credit-based billing model:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
              <li>New accounts receive $100 in free credits. Free credits do not expire.</li>
              <li>Paid plans provide monthly credits that refresh each billing cycle and do not roll over.</li>
              <li>Credits represent actual AI model costs passed through without a platform markup.</li>
              <li>You may upgrade, downgrade, or cancel your plan at any time.</li>
              <li>All fees are non-refundable except as described in our refund policy or as required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">8. AI-Generated Outputs</h2>
            <p className="text-white/70 leading-relaxed">DragonRestock uses artificial intelligence to analyze data and generate outputs (reports, recommendations, drafted messages, etc.). While we strive for accuracy, AI outputs may contain errors. You are responsible for reviewing and verifying all outputs before acting on them. We are not liable for decisions made based on AI-generated content.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">9. Supervised & Autonomous Modes</h2>
            <p className="text-white/70 leading-relaxed">DragonRestock offers configurable permission modes (read-only, supervised, autonomous). In supervised mode, DragonRestock requests your approval before taking actions. In autonomous mode, DragonRestock may take routine actions without prior approval. You are responsible for configuring the appropriate permission level for your use case. We are not liable for actions taken in autonomous mode that you have authorized.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">10. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed">The Service, including its design, code, features, and documentation, is owned by Chacha Advisory LLC and protected by intellectual property laws. You retain ownership of your data. You grant us a limited license to use your data solely to provide and improve the Service.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">11. Privacy & Data Protection</h2>
            <p className="text-white/70 leading-relaxed">
              Your use of the Service is also governed by our{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#98CC65] hover:text-[#2F7D4F] underline transition-colors">Privacy & Data Protection Policy</a>,
              which describes how we collect, use, store, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">12. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHACHA ADVISORY LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            <p className="text-white/70 leading-relaxed mt-3">OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">13. Disclaimer of Warranties</h2>
            <p className="text-white/70 leading-relaxed">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">14. Indemnification</h2>
            <p className="text-white/70 leading-relaxed">You agree to indemnify and hold harmless Chacha Advisory LLC, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising out of your use of the Service, your violation of these Terms, or your violation of any third party's rights.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">15. Termination</h2>
            <p className="text-white/70 leading-relaxed">We may suspend or terminate your access to the Service at any time for any reason, including violation of these Terms. You may terminate your account at any time by contacting us. Upon termination, your right to use the Service ceases immediately. Sections that by their nature should survive termination will survive (including liability, indemnification, and dispute resolution).</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">16. Dispute Resolution</h2>
            <p className="text-white/70 leading-relaxed">Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in the State of Wyoming. You waive any right to participate in a class action lawsuit or class-wide arbitration.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">17. Governing Law</h2>
            <p className="text-white/70 leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law principles.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">18. Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">19. Contact</h2>
            <p className="text-white/70 leading-relaxed">
              If you have questions about these Terms, contact us at:{' '}
              <a href="mailto:info@dragonrestock.com" className="text-[#98CC65] hover:text-[#2F7D4F] underline transition-colors">info@dragonrestock.com</a>
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Chacha Advisory LLC<br />
              30 N Gould St Ste R<br />
              Sheridan, WY 82801, USA
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} Chacha Advisory LLC. All rights reserved.</p>
          <p className="text-xs text-white/20 mt-1">30 N Gould St Ste R, Sheridan, WY 82801, USA</p>
        </div>
      </div>
    </div>
  );
}