import { createClient } from '@supabase/supabase-js';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchablePlayerGrid from "@/components/SearchablePlayerGrid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function RosterPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('age', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="roster" />
      
      <section className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Roster</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the next generation of football talent. Filter by age group or search by name.
          </p>
        </div>

        <SearchablePlayerGrid initialPlayers={players || []} />
      </section>

      <Footer />
    </main>
  );
}