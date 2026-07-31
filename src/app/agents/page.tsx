import { MessageCircle, Award } from 'lucide-react';
import NewsletterForm from "@/components/NewsletterForm";
import Header from "@/components/Header"; // <-- CRITICAL IMPORT

const agents = [
  { name: "Marcus Weber", title: "Founder & CEO", bio: "Over 15 years of experience in top-tier European football negotiations. Specializing in Bundesliga and Premier League transfers.", initials: "MW" },
  { name: "Elena Rostova", title: "Head of International Scouting", bio: "Expert in emerging markets and youth talent acquisition. Holds a FIFA-licensed agent certification.", initials: "ER" },
  { name: "David Chen", title: "Senior Contract Negotiator", bio: "Secured over €200M in total contract value for our roster in the last 24 months.", initials: "DC" },
  { name: "Sarah Jenkins", title: "Head of Commercial & Sponsorships", bio: "Connecting our elite athletes with global brands. Manages all sponsorship and image rights deals.", initials: "SJ" }
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      
      {/* NEW HEADER COMPONENT */}
      <Header activePage="agents" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Meet Our <span className="italic font-serif text-amber-400">Team</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Our roster of FIFA-licensed agents and industry veterans dedicated to maximizing your potential on and off the pitch.
        </p>
      </section>

      {/* Agents Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agents.map((agent, index) => (
            <div key={index} className="group bg-white border border-gray-100 rounded-xl p-8 hover:border-amber-400 transition-all duration-300 flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl font-bold text-gray-400 group-hover:text-amber-400 transition-colors duration-300">
                {agent.initials}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
                  <Award size={14} /> {agent.title}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{agent.bio}</p>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-400 transition-colors">
                  <MessageCircle size={16} /> Contact Agent
                </button>
              </div>
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
            <p>&copy; {new Date().getFullYear()} 11WINS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}