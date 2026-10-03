'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Handshake, Building2, HeartHandshake, Copy, Upload, Loader2, CheckCircle, X, Lock, Mail } from 'lucide-react';

const paymentDetails = {
  bitcoin: { address: "bc1qypzqq8rp2e79yqf9ekdps38s2x9qaclyc22cdl", network: "Bitcoin (BTC)", warning: "Send Bitcoin only to this address." },
  usdt_trc20: { address: "TBUsMd2teFnogwpA2TWvU6H2YTNfoRDGGE", network: "USDT (TRC-20 / Tron)", warning: "⚠️ Only send USDT via TRC-20 network. Do NOT use ERC-20." },
  ethereum: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "Ethereum (ETH)", warning: "Send Ethereum only to this address." },
  bnb: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "BNB (BEP-20 / BSC)", warning: "Send BNB via BSC (BEP-20) network." },
  solana: { address: "B3qUm1knMvVj9XzUC7WdYA73Jxr67cARKfgqgSpo2PuC", network: "Solana (SOL)", warning: "Send Solana only to this address." },
  xrp: { address: "rM63mKH5KLZCR2k7XUaWgHYeaUGKuMU1Mz", network: "XRP (Ripple)", warning: "Send XRP only to this address. No destination tag required." }
};

export default function EngagePage() {
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Club inquiry modal
  const [clubModal, setClubModal] = useState(false);
  const [clubSubmitted, setClubSubmitted] = useState(false);
  const [clubForm, setClubForm] = useState({ organization: '', license: '', name: '', email: '', phone: '', message: '' });

  // Development fund modal
  const [supportModal, setSupportModal] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [amount, setAmount] = useState('250');
  const [supportEmail, setSupportEmail] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof paymentDetails>('usdt_trc20');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data } = await supabase.from('players').select('*').eq('id', playerId).single();
      if (data) setPlayer(data);
      setLoading(false);
    };
    if (playerId) fetchPlayer();
  }, [playerId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails[selectedCrypto].address);
    alert(`${selectedCrypto.toUpperCase()} address copied to clipboard!`);
  };

  const submitClubInquiry = async () => {
    if (!clubForm.organization || !clubForm.name || !clubForm.email) {
      alert('Please fill in Club, Contact Name and Email.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('inquiries').insert([{
      player_id: playerId,
      type: 'club',
      organization: clubForm.organization,
      federation_license: clubForm.license,
      contact_name: clubForm.name,
      contact_email: clubForm.email,
      contact_phone: clubForm.phone,
      message: clubForm.message,
      status: 'new'
    }]);
    setSubmitting(false);
    if (error) { alert('Error submitting inquiry: ' + error.message); return; }
    setClubSubmitted(true);
  };

  const submitSupport = async () => {
    const amt = Number(amount);
    if (!amt || amt < 250) { alert('The minimum development contribution is €250.'); return; }
    if (!proofFile) { alert('Please upload your transaction confirmation.'); return; }

    setSubmitting(true);
    const fileExt = proofFile.name.split('.').pop();
    const fileName = `fund-${playerId}-${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage.from('player-images').upload(fileName, proofFile);
    if (uploadError) { alert('Error uploading proof: ' + uploadError.message); setSubmitting(false); return; }
    const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);

    const { error } = await supabase.from('inquiries').insert([{
      player_id: playerId,
      type: 'support',
      amount_eur: amt,
      contact_email: supportEmail || null,
      payment_method: selectedCrypto,
      transaction_hash: txHash || 'Pending',
      payment_proof_url: publicData.publicUrl,
      status: 'new'
    }]);
    setSubmitting(false);
    if (error) { alert('Error submitting contribution: ' + error.message); return; }
    setSupportSubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>;
  if (!player) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950"><p className="text-gray-600 dark:text-gray-400">Player not found.</p></div>;

  const transferStatus = player.transfer_status || 'open';

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href={`/players/${player.id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          {player.image_url ? (
            <img src={player.image_url} alt={player.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-neutral-800" />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-neutral-900 flex items-center justify-center border border-gray-200 dark:border-neutral-800">
              <span className="text-2xl font-bold text-gray-400">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partnerships & Inquiries</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{player.name} • {player.club} • {player.position}</p>
          </div>
        </div>

        {/* Three Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Commercial Partnerships */}
          <div className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col bg-gray-50 dark:bg-neutral-900">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
              <Handshake className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Commercial Partnerships</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Brand visibility, matchday hospitality and co-branded content. For companies seeking a professional association with elite talent.
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              From €{player.sponsor_owed > 0 ? player.sponsor_owed.toLocaleString() : 'Request'} / season
            </p>
            <Link href={`/sponsor/${player.id}`} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors text-center">
              View Partnership Terms
            </Link>
          </div>

          {/* 2. Club & Transfer Inquiries */}
          <div className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col bg-gray-50 dark:bg-neutral-900">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Club & Transfer Inquiries</h2>

            {transferStatus === 'open' ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                  Confidential registration of interest for professional clubs. All discussions are conducted club-to-club in accordance with FIFA regulations.
                </p>
                <button onClick={() => setClubModal(true)} className="w-full py-3 bg-gray-900 dark:bg-neutral-950 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                  Register Club Interest
                </button>
              </>
            ) : (
              <>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4 flex-1">
                  <div className="flex gap-2 mb-2">
                    <Lock size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      {transferStatus === 'exclusive' ? 'This player is under exclusive negotiation.' : 'This player is in confidential transfer discussions.'}
                    </p>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Verified club representatives may contact our Football Department directly.
                  </p>
                </div>
                <a href="mailto:football@11wins.online" className="w-full py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-blue-500 text-gray-900 dark:text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Mail size={16} /> Football Department
                </a>
              </>
            )}
          </div>

          {/* 3. Development Fund */}
          <div className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col bg-gray-50 dark:bg-neutral-900">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4">
              <HeartHandshake className="text-rose-600 dark:text-rose-400" size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">11WINS Development Fund</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Directly support this player's training, education and competition costs. Contributions are patronage, not investment — contributors receive no economic rights or influence over representation.
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Anonymous • From €250</p>
            <button onClick={() => setSupportModal(true)} className="w-full py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-rose-500 text-gray-900 dark:text-white text-sm font-bold rounded-lg transition-colors">
              Contribute to Development
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-10">
          All inquiries are handled confidentially by 11WINS Management GmbH. 11WINS operates in full compliance with FIFA transfer and representation regulations.
        </p>
      </div>

      {/* CLUB INQUIRY MODAL */}
      {clubModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setClubModal(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-lg w-full shadow-2xl border border-gray-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 dark:bg-neutral-950 text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold">Register Club Interest</h3>
                <p className="text-gray-400 text-sm mt-1">Confidential • {player.name}</p>
              </div>
              <button onClick={() => setClubModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            {clubSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Inquiry Received</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Our Football Department will respond within 48 hours via official channels.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Club / Organization *" value={clubForm.organization} onChange={e => setClubForm({...clubForm, organization: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                  <input placeholder="Federation & License No." value={clubForm.license} onChange={e => setClubForm({...clubForm, license: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                  <input placeholder="Contact Name *" value={clubForm.name} onChange={e => setClubForm({...clubForm, name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                  <input placeholder="Official Email *" type="email" value={clubForm.email} onChange={e => setClubForm({...clubForm, email: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                  <input placeholder="Phone" value={clubForm.phone} onChange={e => setClubForm({...clubForm, phone: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 md:col-span-2" />
                </div>
                <textarea placeholder="Message (optional)" rows={3} value={clubForm.message} onChange={e => setClubForm({...clubForm, message: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                <button onClick={submitClubInquiry} disabled={submitting} className="w-full py-3.5 bg-gray-900 dark:bg-neutral-950 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Submit Confidential Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEVELOPMENT FUND MODAL */}
      {supportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSupportModal(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-lg w-full shadow-2xl border border-gray-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 dark:bg-neutral-950 text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold">Development Contribution</h3>
                <p className="text-gray-400 text-sm mt-1">Anonymous • Supporting {player.name}</p>
              </div>
              <button onClick={() => setSupportModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            {supportSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Thank You</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your contribution is being verified. It directly supports {player.name}'s development.</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Contribution Amount (€) — min. 250</label>
                  <div className="flex gap-2 mb-2">
                    {['250', '1000', '2500'].map(v => (
                      <button key={v} onClick={() => setAmount(v)} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${amount === v ? 'bg-rose-600 text-white border-rose-600' : 'bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:border-rose-500'}`}>
                        €{Number(v).toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input type="number" min={250} placeholder="Or enter custom amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-500" />
                </div>

                <input placeholder="Email for private receipt (optional)" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-500" />

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Payment Method</label>
                  <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value as keyof typeof paymentDetails)} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-500">
                    <option value="usdt_trc20">USDT (TRC-20 / Tron) - Recommended</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="bnb">BNB (BSC)</option>
                    <option value="solana">Solana (SOL)</option>
                    <option value="xrp">XRP (Ripple)</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <p className="text-gray-900 dark:text-white font-mono text-sm break-all mb-3">{paymentDetails[selectedCrypto].address}</p>
                  <button onClick={handleCopy} className="w-full py-2.5 bg-gray-900 dark:bg-neutral-950 text-white text-sm font-semibold rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                    <Copy size={14} /> Copy Address
                  </button>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">{paymentDetails[selectedCrypto].warning}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Upload Transaction Confirmation *</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-4 text-center hover:border-rose-500 transition-colors cursor-pointer bg-gray-50 dark:bg-neutral-800">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{proofFile ? proofFile.name : 'Click to upload confirmation'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                    </label>
                  </div>
                </div>

                <input placeholder="Transaction Hash (optional)" value={txHash} onChange={e => setTxHash(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-rose-500" />

                <button onClick={submitSupport} disabled={submitting} className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <HeartHandshake size={16} />} Submit Contribution
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}