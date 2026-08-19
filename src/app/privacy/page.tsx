import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="contact" />
      
      <section className="max-w-4xl mx-auto px-6 py-16 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Privacy Policy (Datenschutzerklärung)</h1>
        
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. General Information</h2>
            <p className="leading-relaxed">
              The following notices will provide you with a simple overview of what happens to your personal data when you visit our website. Personal data is any data that can be used to identify you personally. 
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Collection on Our Website</h2>
            <p className="leading-relaxed mb-2">
              <strong>Cookies:</strong> Our website uses cookies. These are small text files that your web browser stores on your end device. Cookies help us make our offer more user-friendly, effective, and secure.
            </p>
            <p className="leading-relaxed">
              <strong>Server Log Files:</strong> The provider of the pages automatically collects and stores information that your browser automatically transmits to us in "server log files". These are: Browser type and version, operating system used, referrer URL, host name of the accessing computer, and time of the server request.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Scouting Applications & Player Profiles</h2>
            <p className="leading-relaxed">
              If you submit a scouting application via our "Apply" form, we collect your personal data (name, age, contact details, images, and video links) solely for the purpose of evaluating your footballing profile. This data is processed in accordance with Art. 6 (1) (b) GDPR (pre-contractual measures) and stored securely via our encrypted database provider (Supabase). You have the right to request the deletion of this data at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Newsletter</h2>
            <p className="leading-relaxed">
              If you subscribe to our newsletter, we need an email address from you. The data is stored on our secure servers. You can revoke your consent to the storage of the data and the email address at any time, for example via the unsubscribe link in the newsletter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to free information about your stored personal data, the origin of the data, its recipients, and the purpose of data processing at any time. You also have a right to correction, blocking, or deletion of this data.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} 11WINS GmbH. All rights reserved.</p>
      </footer>
    </main>
  );
}