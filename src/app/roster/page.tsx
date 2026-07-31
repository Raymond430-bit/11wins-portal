import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import SearchablePlayerGrid from "@/components/SearchablePlayerGrid";
import NewsletterForm from "@/components/NewsletterForm";
import Header from "@/components/Header"; // <-- CRITICAL IMPORT

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPlayers() {
  const { data, error } = await supabase.from("players").select("*").order("market_value", { ascending: false });
  if (error) return [];
  return data || [];
}

export default async function RosterPage() {
  const players = await getPlayers();

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      
      {/* NEW HEADER COMPONENT */}
      <Header activePage="roster" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center flex-grow">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Home
        </a>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Full Player <span className="italic font-serif text-amber-400">Roster</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our complete roster of world-class talent across all major leagues.
        </p>
      </section>

      {/* Searchable Players Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full">
        <SearchablePlayerGrid initialPlayers={players} />
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6"><span className="text-amber-400">11</span>WINS</h3>
              <div className="mb-8">
                <h4 className="font-bold text-gray-300 mb-3 uppercase tracking-wider text-sm">Contact Us</h4>
                <p className="text-gray-400 mb-2">123 Football Avenue</p>
                <p className="text-gray-400 mb-2">Munich, Germany</p>
                <p className="text-gray-400 mb-2">+49 89 12345678</p>
                <p className="text-gray-400">contact@11wins-agency.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe for the latest transfers and agency updates</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} 11WINS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}