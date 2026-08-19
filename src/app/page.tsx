import { supabase } from "@/lib/supabase";
import { TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import SearchablePlayerGrid from "@/components/SearchablePlayerGrid";
import PlayerCard from "@/components/PlayerCard";
import NewsletterForm from "@/components/NewsletterForm";
import Header from "@/components/Header"; // <-- NEW HEADER IMPORT

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPlayers() {
  const { data, error } = await supabase.from("players").select("*").order("market_value", { ascending: false });
  if (error) return [];
  return data || [];
}

export default async function Home() {
  const players = await getPlayers();
  const featuredPlayers = players.slice(0, 6);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      
      {/* NEW HEADER COMPONENT */}
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Elite Football <span className="italic font-serif text-amber-400">Representation</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          Discover our roster of world-class talent. Track market values, contract details, and sponsorship opportunities.
        </p>
      </section>

      {/* Stats Ticker */}
      <section className="max-w-7xl mx-auto px-6 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-lg p-6 flex items-center gap-4 hover:border-amber-400 transition-colors duration-300 shadow-sm">
            <div className="p-3 bg-gray-50 rounded-md"><TrendingUp className="text-amber-400" size={24} /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Market Value</p>
              <p className="text-2xl font-bold text-gray-900">€{(players.reduce((acc, p) => acc + p.market_value, 0) / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 flex items-center gap-4 hover:border-amber-400 transition-colors duration-300 shadow-sm">
            <div className="p-3 bg-gray-50 rounded-md"><CreditCard className="text-amber-400" size={24} /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Active Roster</p>
              <p className="text-2xl font-bold text-gray-900">{players.length} Players</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 flex items-center gap-4 hover:border-amber-400 transition-colors duration-300 shadow-sm">
            <div className="p-3 bg-gray-50 rounded-md"><TrendingUp className="text-amber-400" size={24} /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Pending Sponsorships</p>
              <p className="text-2xl font-bold text-gray-900">€{(players.reduce((acc, p) => acc + (p.sponsor_owed || 0), 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Players */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Featured Roster</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/roster" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 text-lg shadow-lg hover:shadow-amber-400/20">
            See Full Roster <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">What Our Clients Say</h3>
            <p className="text-gray-600 mt-2">Trusted by top clubs and athletes worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">J</div>
                <div>
                  <h4 className="font-bold text-gray-900">James Wilson</h4>
                  <p className="text-gray-500 text-sm">CEO, Premier League Club</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"11WINS transformed our talent acquisition strategy. Their expertise in international transfers is unmatched."</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">S</div>
                <div>
                  <h4 className="font-bold text-gray-900">Sophie Chen</h4>
                  <p className="text-gray-500 text-sm">Global Sponsorship Director</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"The level of service and professionalism from 11WINS has been instrumental in our sponsorship success."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["FIFA Licensed", "Global Reach", "10+ Years", "200+ Deals"].map((title, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm hover:border-amber-400 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-amber-400 font-bold text-xl">{i + 1}</div>
              <h4 className="font-bold text-gray-900">{title}</h4>
              <p className="text-gray-500 text-sm mt-1">Officially certified agency</p>
            </div>
          ))}
        </div>
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
                         <p>&copy; {new Date().getFullYear()} 11WINS GmbH. All rights reserved.</p>
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <a href="/impressum" className="text-gray-400 hover:text-amber-400 transition-colors">Impressum</a>
                <a href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
              </div>
          </div>
        </div>
      </footer>
    </main>
  );
}