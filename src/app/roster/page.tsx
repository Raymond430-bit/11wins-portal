import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import SearchablePlayerGrid from "@/components/SearchablePlayerGrid";
import NewsletterForm from "@/components/NewsletterForm";
import Header from "@/components/Header"; // <-- CRITICAL IMPORT
import Footer from "@/components/Footer";

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
      <Footer />
    </main>
  );
}