import { MessageCircle, Award, Globe, TrendingUp } from 'lucide-react';
import NewsletterForm from "@/components/NewsletterForm";
import Header from "@/components/Header";

// Real, heavy-hitting agents from Transfermarkt
const agents = [
  { 
    name: "Rafaela Pimenta", 
    title: "CEO & Partner, Base Soccer Ltd.", 
    bio: "One of the most powerful agents in world football. Specializes in elite, high-profile global transfers and contract negotiations for generational talents like Erling Haaland and Paul Pogba.",
    initials: "RP",
    specialty: "Global Superstars"
  },
  { 
    name: "Volker Struth", 
    title: "Senior Partner, Stellar Group", 
    bio: "The leading football agent in Germany and a powerhouse in the Premier League. Expert in Bundesliga placements, with a proven track record of developing youth prospects into global icons.",
    initials: "VS",
    specialty: "Bundesliga & Premier League"
  },
  { 
    name: "Pini Zahavi", 
    title: "Founder, PZ Sports Management", 
    bio: "A legendary figure in football representation with over 30 years of experience. Pioneered the modern super-agent model and brokered some of the most expensive transfers in football history.",
    initials: "PZ",
    specialty: "High-Value Transfers"
  },
  { 
    name: "Alessandro Lucci", 
    title: "Managing Director, YouFirst Sport", 
    bio: "A dominant force in European football. Known for securing massive commercial endorsements and image rights alongside elite sporting contracts for top-tier European talent.",
    initials: "AL",
    specialty: "Commercial & Image Rights"
  }
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      
      {/* Header */}
      <Header activePage="agents" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Our <span className="italic font-serif text-amber-400">Network</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          11WINS partners exclusively with FIFA-licensed super-agents and industry veterans who dictate the global transfer market.
        </p>
      </section>

      {/* Agents Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agents.map((agent, index) => (
            <div key={index} className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/10 transition-all duration-300 flex flex-col sm:flex-row gap-6">
              
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-900 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl font-bold text-amber-400 group-hover:bg-amber-400 group-hover:text-gray-900 transition-colors duration-300 shadow-md">
                {agent.initials}
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold mb-3">
                  <Award size={14} /> {agent.title}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{agent.bio}</p>
                
                {/* Specialty Tag & Contact */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <TrendingUp size={12} className="text-amber-500" /> {agent.specialty}
                  </span>
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-500 transition-colors">
                    <MessageCircle size={16} /> Contact
                  </button>
                </div>
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
                <p className="text-gray-400 mb-2">Ludwig-Ganghofer-Straße 1</p>
                <p className="text-gray-400 mb-2">82031 Grünwald, Germany</p>
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