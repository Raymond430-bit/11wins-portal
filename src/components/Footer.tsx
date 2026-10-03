import { supabase } from "@/lib/supabase";
import NewsletterForm from "@/components/NewsletterForm";
import { Mail, Globe, MessageCircle, Briefcase } from "lucide-react";

export default async function Footer() {
  // Fetch live settings from the database
  const { data: settings } = await supabase
    .from('site_settings')
    .select('contact_email, contact_phone, contact_address, social_instagram, social_twitter, social_linkedin')
    .single();

  const email = settings?.contact_email || 'contact@11wins.online';
  const phone = settings?.contact_phone || '+49 89 3450 8820';
  const address = settings?.contact_address || 'Ludwig-Ganghofer-Straße 1\n82031 Grünwald, Germany';
  const ig = settings?.social_instagram;
  const tw = settings?.social_twitter;
  const li = settings?.social_linkedin;

  return (
    // Deep charcoal in Light Mode, Pitch Black in Dark Mode
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 w-full mt-auto dark:bg-black dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white dark:text-gray-100"><span className="text-amber-400">11</span>WINS</h3>
            <div className="mb-8">
              <h4 className="font-bold text-gray-100 dark:text-gray-200 mb-3 uppercase tracking-wider text-sm">Contact Us</h4>
              <p className="mb-2 whitespace-pre-line">{address}</p>
              <p className="mb-2">{phone}</p>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors mt-2">
                <Mail size={18} /> {email}
              </a>
            </div>
            
            {/* Dynamic Social Links */}
            {(ig || tw || li) && (
              <div className="mb-8">
                <h4 className="font-bold text-gray-100 dark:text-gray-200 mb-3 uppercase tracking-wider text-sm">Follow Us</h4>
                <div className="flex gap-4">
                  {ig && <a href={ig} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"><Globe size={20} /></a>}
                  {tw && <a href={tw} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"><MessageCircle size={20} /></a>}
                  {li && <a href={li} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"><Briefcase size={20} /></a>}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="font-bold text-gray-100 dark:text-gray-200 mb-3 uppercase tracking-wider text-sm">Legal</h4>
              <p className="text-sm mb-1">Managing Director: Christian Schmid</p>
              <p className="text-sm mb-1">HRB 243881 - Amtsgericht München</p>
              <p className="text-sm">VAT ID: DED2601V.HRB220145</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white dark:text-gray-100">Newsletter</h3>
            <p className="mb-4">Subscribe for the latest transfers and agency updates</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 11WINS GmbH. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/impressum" className="hover:text-amber-400 transition-colors">Impressum</a>
            <span className="text-gray-700 dark:text-gray-800">|</span>
            <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}