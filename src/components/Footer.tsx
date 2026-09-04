import NewsletterForm from "@/components/NewsletterForm";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6"><span className="text-amber-400">11</span>WINS</h3>
            <div className="mb-8">
              <h4 className="font-bold text-gray-300 mb-3 uppercase tracking-wider text-sm">Contact Us</h4>
              <p className="text-gray-400 mb-2">Ludwig-Ganghofer-Straße 1</p>
              <p className="text-gray-400 mb-2">82031 Grünwald, Germany</p>
              <p className="text-gray-400 mb-2">+49 89 3450 8820</p>
              <a href="mailto:contact@11wins.online" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mt-2">
                <Mail size={18} />
              </a>
            </div>
            <div className="mb-8">
              <h4 className="font-bold text-gray-300 mb-3 uppercase tracking-wider text-sm">Legal</h4>
              <p className="text-gray-400 text-sm mb-1">Managing Director: Christian Schmid</p>
              <p className="text-gray-400 text-sm mb-1">HRB 243881 - Amtsgericht München</p>
              <p className="text-gray-400 text-sm">VAT ID: DED2601V.HRB220145</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for the latest transfers and agency updates</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} 11WINS GmbH. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/impressum" className="hover:text-amber-400 transition-colors">Impressum</a>
            <span className="text-gray-700">|</span>
            <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}