import Header from "@/components/Header";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="contact" />
      
      <section className="max-w-4xl mx-auto px-6 py-16 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Impressum (Legal Notice)</h1>
        
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information according to § 5 TMG</h2>
            <p className="leading-relaxed">
              11WINS Football Agency GmbH<br />
              123 Football Avenue<br />
              80331 Munich, Germany
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Represented by</h2>
            <p className="leading-relaxed">Managing Director: [Client's Name / Placeholder]</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="leading-relaxed">
              Phone: +49 89 12345678<br />
              E-mail: contact@11wins-agency.com
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Commercial Register</h2>
            <p className="leading-relaxed">
              Registration number: HRB [Placeholder Number]<br />
              Register court: Munich Local Court (Amtsgericht München)
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">VAT ID</h2>
            <p className="leading-relaxed">
              VAT identification number according to §27 a Value Added Tax Act:<br />
              DE [Placeholder VAT Number]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Responsible for content according to § 55 Abs. 2 RStV</h2>
            <p className="leading-relaxed">
              [Client's Name / Placeholder]<br />
              123 Football Avenue<br />
              80331 Munich, Germany
            </p>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Liability for Content</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Abs.1 TMG. However, according to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer for Legal Pages */}
      <footer className="bg-black text-white py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} 11WINS GmbH. All rights reserved.</p>
      </footer>
    </main>
  );
}