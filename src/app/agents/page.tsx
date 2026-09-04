import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Award, Globe, Mail, Phone } from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      name: "Christian Schmid",
      role: "CEO / Managing Director",
      initials: "CS",
      bio: "Founder and CEO of 11WINS. Extensive experience in player representation, contract negotiation, and career planning across European football markets.",
      location: "Munich, Germany",
      specialty: "Player Representation & Contract Negotiation"
    },
    {
      name: "Gregor Falter",
      role: "Chief Operating Officer",
      initials: "GF",
      bio: "Oversees daily operations and strategic partnerships. Expert in cross-border placements and market access.",
      location: "Munich, Germany",
      specialty: "Operations & Strategic Partnerships"
    },
    {
      name: "Stephan Kallass",
      role: "Partner",
      initials: "SK",
      bio: "Licensed agent with deep connections in German football. Specializes in youth development and Bundesliga placements.",
      location: "Germany",
      specialty: "Youth Development & Bundesliga"
    },
    {
      name: "Louis Downing",
      role: "Partner",
      initials: "LD",
      bio: "UK-licensed agent with extensive Premier League and Championship networks. Expert in British market access.",
      location: "United Kingdom",
      specialty: "Premier League & UK Market"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="agents" />
      
      <section className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Meet the experienced professionals behind 11WINS. Our team combines decades of expertise in player representation, contract negotiation, and career development.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {agents.map((agent, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:border-amber-400 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-amber-600">{agent.initials}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                  <p className="text-amber-600 font-medium text-sm mb-3">{agent.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{agent.bio}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe size={12} /> {agent.location}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700">
                      <Award size={12} className="inline mr-1 text-amber-500" />
                      {agent.specialty}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-amber-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Player Representation</h3>
              <p className="text-gray-600 text-sm">Contract negotiation, transfers/loans, and renewals</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-amber-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Career Planning</h3>
              <p className="text-gray-600 text-sm">Youth through post-career development and performance support</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-amber-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cross-Border Placements</h3>
              <p className="text-gray-600 text-sm">Market access in DE/UK/Continental Europe</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a player seeking representation or a club looking for talent, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="/apply" 
              className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Submit Application
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}