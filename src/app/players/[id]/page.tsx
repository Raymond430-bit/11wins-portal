import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import    import { ArrowLeft, TrendingUp, Calendar, MapPin, Ruler, Flag, Shield, Award, ExternalLink, FileSignature, FileText, Check } from "lucide-react";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";

// Next.js 15 requires params to be awaited
export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !player) {
    notFound();
  }

  const formatValue = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}m`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
    return `€${val}`;
  };

  // Mocking an agent based on the player's region/club for realism
  const assignedAgent = player.club?.toLowerCase().includes('munich') || player.club?.toLowerCase().includes('dortmund') 
    ? 'Volker Struth' : 'Patrick Williams';

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="roster" />

      <div className="max-w-6xl mx-auto px-4 pt-6 w-full">
        <a href="/roster" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-500 transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Roster
        </a>
      </div>

      {/* ========================================== */}
      {/* SECTION 1: PLAYER HEADER (Transfermarkt Style) */}
      {/* ========================================== */}
      <section className="max-w-6xl mx-auto px-4 w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          
          {/* Left: Image & Basic Info */}
          <div className="md:col-span-1 p-6 bg-gray-50 border-r border-gray-200 flex flex-col items-center text-center">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4 flex items-center justify-center">
              {player.image_url ? (
                <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-gray-300">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{player.name}</h1>
            <p className="text-gray-500 text-sm mb-3">{player.club}</p>
            
            {/* Position Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
              <Shield size={12} /> {player.position}
            </div>
          </div>

          {/* Right: Detailed Data Sheet */}
          <div className="md:col-span-2 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Player Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Date of birth / Age:</span>
                <span className="font-medium text-gray-900">{player.age} yrs</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Citizenship:</span>
                <span className="font-medium text-gray-900 flex items-center gap-1"><Flag size={12} /> {player.nationality}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Height:</span>
                <span className="font-medium text-gray-900 flex items-center gap-1"><Ruler size={12} /> 1,82 m</span> {/* Mocked for realism */}
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Position:</span>
                <span className="font-medium text-gray-900">{player.position}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Agent / Player Agent:</span>
                <span className="font-medium text-amber-600 cursor-pointer hover:underline">{assignedAgent}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Contract expires:</span>
                <span className="font-medium text-gray-900 flex items-center gap-1"><Calendar size={12} /> {player.contract_expiry}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Outfitter:</span>
                <span className="font-medium text-gray-900">Adidas</span> {/* Mocked */}
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Social Media:</span>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-amber-500"><ExternalLink size={14} /></a>
                  <a href="#" className="text-gray-400 hover:text-amber-500"><ExternalLink size={14} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: MARKET VALUE & STATS */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Market Value Box */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
            <TrendingUp className="text-amber-500" size={20} /> Market Value
          </h2>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatValue(player.market_value)}</p>
          <p className="text-xs text-gray-500 mb-6">Current Market Value</p>
          
          {/* Mock Market Value History Graph (SVG) */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Market Value Development</p>
            <div className="relative h-24 w-full bg-gray-50 rounded border border-gray-100 overflow-hidden">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Area under line */}
                <path d="M0,80 L50,75 L100,60 L150,65 L200,40 L250,45 L300,20 L350,25 L400,10 L400,100 L0,100 Z" fill="url(#grad)" />
                {/* The line itself */}
                <path d="M0,80 L50,75 L100,60 L150,65 L200,40 L250,45 L300,20 L350,25 L400,10" fill="none" stroke="#f59e0b" strokeWidth="3" />
                {/* Data points */}
                <circle cx="400" cy="10" r="4" fill="#f59e0b" />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>Today</span>
            </div>
          </div>
        </div>

        {/* Performance Data Box */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
            <Award className="text-amber-500" size={20} /> Performance Data
          </h2>
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Competition</th>
                <th className="px-4 py-3 text-center">Appearances</th>
                <th className="px-4 py-3 text-center">Goals</th>
                <th className="px-4 py-3 text-center">Assists</th>
                <th className="px-4 py-3 rounded-r-lg text-center">Y/R Cards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">Bundesliga</td>
                <td className="px-4 py-3 text-center text-gray-700">24</td>
                <td className="px-4 py-3 text-center text-gray-700">5</td>
                <td className="px-4 py-3 text-center text-gray-700">8</td>
                <td className="px-4 py-3 text-center text-gray-700">3 / 0</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">DFB-Pokal</td>
                <td className="px-4 py-3 text-center text-gray-700">4</td>
                <td className="px-4 py-3 text-center text-gray-700">1</td>
                <td className="px-4 py-3 text-center text-gray-700">2</td>
                <td className="px-4 py-3 text-center text-gray-700">0 / 0</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50/50 font-bold">
                <td className="px-4 py-3 text-gray-900">Total Current Season</td>
                <td className="px-4 py-3 text-center text-gray-900">28</td>
                <td className="px-4 py-3 text-center text-gray-900">6</td>
                <td className="px-4 py-3 text-center text-gray-900">10</td>
                <td className="px-4 py-3 text-center text-gray-900">3 / 0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 3: TRANSFER HISTORY & BIO */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Transfer History */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
            <MapPin className="text-amber-500" size={20} /> Transfer History
          </h2>
          <div className="space-y-4">
            {(player.transfer_history || "2023: Promoted to Senior Team | 2021: Signed Youth Contract").split('|').map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.trim()}</p>
                  <p className="text-xs text-gray-500 mt-1">Contract finalized and registered.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Bio / Scouting Report */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Scouting Report</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {player.bio || "A highly talented professional with a strong work ethic and excellent technical abilities. A valuable asset to the squad."}
          </p>
          
          {/* Contact Agent CTA */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Representation:</p>
            <p className="font-bold text-gray-900 text-sm mb-3">{assignedAgent}</p>
            <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded hover:bg-amber-500 hover:text-gray-900 transition-colors">
              Contact Agent
            </button>
          </div>
        </div>
      </div>

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
              {/* ========================================== */}
      {/* SECTION 4: CONTRACT & DIGITAL SIGNING */}
      {/* ========================================== */}
      {player.contract_url && (
        <section className="max-w-6xl mx-auto px-4 w-full mb-12">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <FileSignature className="text-amber-500" size={20} /> Official Contract & Representation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Contract Info */}
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  This document outlines the official representation agreement, sponsorship terms, and legal obligations between 11WINS and the signing party.
                </p>
                
                <a 
                  href={player.contract_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors mb-4"
                >
                  <FileText size={18} /> Download / View Contract PDF
                </a>

                {player.contract_signed && player.contract_signed_at && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                    <p className="text-emerald-800 font-bold text-sm flex items-center gap-2">
                      <Check size={16} /> Digitally Signed
                    </p>
                    <p className="text-emerald-700 text-xs mt-1">
                      Signed by: {player.contract_signer_name || 'Authorized Party'} <br />
                      Date: {new Date(player.contract_signed_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Digital Signature Form */}
              {!player.contract_signed && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Digital Acknowledgment</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    By clicking "Sign Contract" below, you acknowledge that you have read, downloaded, and agree to the terms outlined in the official contract. This action is legally binding.
                  </p>
                  
                  <input 
                    id="signer_name"
                    type="text" 
                    placeholder="Enter Full Legal Name to Sign" 
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 text-sm mb-4"
                  />

                  <button 
                    onClick={async () => {
                      const nameInput = document.getElementById('signer_name') as HTMLInputElement;
                      if (!nameInput.value.trim()) {
                        alert('Please enter your full legal name to sign.');
                        return;
                      }
                      if (!window.confirm('Are you sure you want to digitally sign this contract? This action cannot be undone.')) return;

                      const { error } = await supabase.from('players').update({
                        contract_signed: true,
                        contract_signed_at: new Date().toISOString(),
                        contract_signer_name: nameInput.value.trim()
                      }).eq('id', player.id);

                      if (error) alert('Error signing contract: ' + error.message);
                      else window.location.reload();
                    }}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileSignature size={18} /> Sign Contract
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      </footer>
    </main>
  );
}