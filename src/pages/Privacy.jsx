const sysFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function Privacy() {
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
          <h1 className="font-extrabold text-4xl">Privacy &amp; Data Protection Policy</h1>
          <p className="mt-3 text-white/40 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-white/70 leading-relaxed mb-8">
          Your privacy matters to us. This Privacy &amp; Data Protection Policy explains how DragonRestock, operated by Chacha Advisory LLC ("we", "us", "our"), collects, uses, stores, shares, and protects your information when you use our application (the "App"). DragonRestock is an authorized Amazon Selling Partner API (SP-API) application. Chacha Advisory LLC is located at 30 N Gould St Ste R, Sheridan, WY 82801, USA.
        </p>
        <p className="text-white/70 leading-relaxed mb-12">
          By using the App, you acknowledge that you have read and understood this Policy and consent to the collection and use of your information as described below. You may withdraw your consent at any time by contacting us.
        </p>

        <div className="space-y-12">

          <section>
            <h2 className="font-bold text-xl mb-4">1. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">We may collect the following types of information:</p>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold mb-2">a. Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
                  <li>Account details (such as name, email address, or username)</li>
                  <li>Content you submit or upload within the App</li>
                  <li>Supply-chain data you provide so the App can plan restocks: unit costs, lead times, minimum order quantities, case packs, supplier names and contacts, purchase orders, and supplier invoices you upload</li>
                  <li>Spreadsheets and files you choose to import — including a Google Sheet you link or a CSV you upload — read only to map their rows to your SKUs</li>
                  <li>Communications you send to us (support requests, feedback, etc.)</li>
                  <li>Authorization credentials for third-party services you choose to connect (stored as secure OAuth tokens only — we never store your passwords)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">b. Information from Amazon Selling Partner API</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
                  <li>Order data, product listings, inventory levels, inbound shipments, fees, and advertising metrics from your Amazon Seller Central account — this is the sales history the restock forecast is built from</li>
                  <li>Customer Personally Identifiable Information (PII) only as necessary for order fulfillment, tax compliance, and legally required documentation</li>
                  <li>Business reports, keyword data, and performance analytics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">c. Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
                  <li>Device and browser information</li>
                  <li>IP address and general location (e.g., country or region)</li>
                  <li>Usage data such as pages viewed, features used, and interaction timestamps</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">d. Third-Party Data</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
                  <li>Information received from integrated third-party services you choose to connect to the App (e.g., Google Sheets, Notion, Shopify)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">2. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2 mb-4">
              <li>Provide, operate, and improve the App</li>
              <li>Perform tasks you request on your behalf (e.g., PPC audits, keyword research, customer support triage)</li>
              <li>Generate reports, spreadsheets, and analytics deliverables</li>
              <li>Personalize your experience and remember your preferences</li>
              <li>Communicate with you about updates, features, or support</li>
              <li>Monitor performance, security, and usage trends</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="text-white/70 leading-relaxed mb-3">
              We do <strong className="text-white font-semibold">not</strong> sell your personal data.
            </p>
            <p className="text-white/70 leading-relaxed">
              We do <strong className="text-white font-semibold">not</strong> use your data to train AI models. Your data is used solely to provide services to you.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">3. Transparency &amp; Disclosure</h2>
            <p className="text-white/70 leading-relaxed mb-3">We are committed to being clear and honest about our data practices:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
              <li>We clearly disclose what data we access from your connected accounts and for what purpose</li>
              <li>Our application uses artificial intelligence to analyze data and generate outputs — we are transparent about the use of AI models, their accuracy, and data freshness</li>
              <li>We disclose any third parties with whom your data is shared, and for what purposes</li>
              <li>We will notify you of any material changes to our data practices</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">4. Amazon Data Handling</h2>
            <p className="text-white/70 leading-relaxed mb-3">As an authorized Amazon SP-API application, we adhere to Amazon's Data Protection Policy and Acceptable Use Policy:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2">
              <li>We access Amazon data only to perform activities you have explicitly authorized</li>
              <li>Customer PII from Amazon is retained for no longer than 30 days after order delivery and only for order fulfillment, tax calculation, tax invoices, and legal requirements</li>
              <li>Non-PII Amazon data is deleted within 18 months unless longer retention is required by applicable law</li>
              <li>We do not use Customer PII for marketing, advertising, or any purpose other than merchant-fulfilled shipping and legal compliance</li>
              <li>We do not aggregate data across multiple seller accounts</li>
              <li>We do not disclose your Amazon data to other application users, affiliated entities, or outside parties except as required to perform authorized activities on your behalf</li>
              <li>Upon Amazon's request, we will permanently and securely delete all Amazon data within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">5. Legal Basis for Processing</h2>
            <p className="text-white/70 leading-relaxed mb-3">Depending on your location, we process your data based on:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2 mb-4">
              <li>Your consent</li>
              <li>Performance of a contract (providing the App)</li>
              <li>Legitimate business interests</li>
              <li>Legal obligations</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              You may withdraw your consent at any time where consent is the legal basis for processing. We comply with applicable privacy laws and regulations including GDPR and other data protection frameworks.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">6. Data Storage &amp; Security</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We implement robust technical and organizational measures to protect your information from unauthorized access, loss, or misuse:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2 mb-4">
              <li>All data is encrypted in transit (TLS) and at rest</li>
              <li>We store only secure OAuth tokens — never your passwords or raw credentials</li>
              <li>Each workspace is fully isolated — your data is never shared or mixed with other users</li>
              <li>Access to production systems is restricted and monitored</li>
              <li>Security logs are retained for at least 12 months for incident response purposes</li>
              <li>We maintain documented incident response and data breach procedures</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              Your data may be stored and processed on secure servers operated by us or trusted third-party service providers who are contractually bound to protect your data.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">7. Data Sharing</h2>
            <p className="text-white/70 leading-relaxed mb-3">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2 mb-4">
              <li>Service providers who help us operate the App (e.g., hosting, analytics) — all bound by data protection agreements</li>
              <li>Third-party services you explicitly choose to connect (e.g., Google Drive, Slack, Notion) — only to perform tasks you request</li>
              <li>Legal authorities if required by law</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              We perform due diligence on all third-party providers' data security practices before sharing any data. All third parties are contractually required to protect your data and use it only for authorized purposes.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">8. Data Retention &amp; Deletion</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70 leading-relaxed ml-2">
              <li><strong className="text-white">Amazon Customer PII:</strong> Retained for no longer than 30 days after order delivery, solely for order fulfillment, tax compliance, and legal requirements</li>
              <li><strong className="text-white">Amazon Non-PII Data:</strong> Deleted within 18 months unless longer retention is required by applicable law</li>
              <li><strong className="text-white">General Account Data:</strong> Retained for as long as your account is active or as needed to provide services. Deleted upon account closure or your request</li>
              <li><strong className="text-white">Security Logs:</strong> Retained for at least 12 months for incident response</li>
              <li><strong className="text-white">On Amazon's Request:</strong> All Amazon data permanently and securely deleted within 30 days of notice; all live instances removed within 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">9. Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 leading-relaxed ml-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct or update your data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Stop sharing or processing of your information</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              We maintain technical and organizational processes to assist you with data subject access requests. You can exercise these rights by contacting us at{' '}
              <a href="mailto:info@dragonrestock.com" className="text-[#98CC65] hover:text-[#2F7D4F] underline transition-colors">info@dragonrestock.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">10. Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              The App is not intended for children under the age of 13 (or the minimum age required by applicable law). We do not knowingly collect personal data from children.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">11. Employee Data Handling</h2>
            <p className="text-white/70 leading-relaxed">
              All employees who process PII are bound by contractual confidentiality obligations regarding the handling of personal information.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">12. Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy &amp; Data Protection Policy from time to time. Any changes will be effective when posted in the App. We will notify you of material changes. Continued use of the App constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl mb-4">13. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions or requests regarding this Policy, your data, or your privacy rights, please contact us at:{' '}
              <a href="mailto:info@dragonrestock.com" className="text-[#98CC65] hover:text-[#2F7D4F] underline transition-colors">
                info@dragonrestock.com
              </a>
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              We respond to all inquiries within 24 hours, Sunday through Friday.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Chacha Advisory LLC. All rights reserved.
          </p>
          <p className="text-xs text-white/20 mt-1">30 N Gould St Ste R, Sheridan, WY 82801, USA</p>
        </div>
      </div>
    </div>
  );
}