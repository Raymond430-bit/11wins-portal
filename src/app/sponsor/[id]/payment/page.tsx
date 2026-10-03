'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Copy, AlertTriangle, CheckCircle, Loader2, MessageCircle, Upload } from 'lucide-react';

const paymentDetails = {
  bitcoin: { address: "bc1qypzqq8rp2e79yqf9ekdps38s2x9qaclyc22cdl", network: "Bitcoin (BTC)", warning: "Send Bitcoin only to this address." },
  usdt_trc20: { address: "TBUsMd2teFnogwpA2TWvU6H2YTNfoRDGGE", network: "USDT (TRC-20 / Tron)", warning: "⚠️ Only send USDT via TRC-20 network. Do NOT use ERC-20." },
  ethereum: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "Ethereum (ETH)", warning: "Send Ethereum only to this address." },
  bnb: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "BNB (BEP-20 / BSC)", warning: "Send BNB via BSC (BEP-20) network." },
  solana: { address: "B3qUm1knMvVj9XzUC7WdYA73Jxr67cARKfgqgSpo2PuC", network: "Solana (SOL)", warning: "Send Solana only to this address." },
  xrp: { address: "rM63mKH5KLZCR2k7XUaWgHYeaUGKuMU1Mz", network: "XRP (Ripple)", warning: "Send XRP only to this address. No destination tag required." }
};

export default function SponsorshipPaymentPage() {
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof paymentDetails>('usdt_trc20');

  const supportWhatsApp = '491234567890';

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

  const handlePaymentMade = async () => {
    if (!proofFile) { alert('Please upload proof of payment.'); return; }
    setPaymentStep('processing');
    const fileExt = proofFile.name.split('.').pop();
    const fileName = `proof-${playerId}-${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage.from('player-images').upload(fileName, proofFile);
    if (uploadError) { alert('Error uploading proof: ' + uploadError.message); setPaymentStep('details'); return; }
    const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);

    const { error } = await supabase.from('players').update({
      payment_status: 'pending_verification',
      payment_proof_url: publicData.publicUrl,
      transaction_hash: txHash || 'Pending',
      payment_method: selectedCrypto
    }).eq('id', playerId);

    if (!error) {
      setPaymentStep('success');
      setTimeout(() => { window.location.href = `/players/${playerId}`; }, 3000);
    } else {
      alert('Error submitting partnership. Please contact support.');
      setPaymentStep('details');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>;
  if (!player) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950"><p className="text-gray-600 dark:text-gray-400">Player not found.</p></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href={`/sponsor/${player.id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Partnership Terms
        </Link>

        {paymentStep === 'details' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Partnership</h1>
              <p className="text-gray-600 dark:text-gray-400">Partnership with {player.name} • €{player.sponsor_owed > 0 ? player.sponsor_owed.toLocaleString() : 'On Request'} / season</p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <AlertTriangle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">Crypto Settlement Only</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All partnerships are settled via cryptocurrency for security and transparency.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Settlement Asset</label>
                <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value as keyof typeof paymentDetails)} className="w-full p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500">
                  <option value="usdt_trc20">USDT (TRC-20 / Tron) - Recommended</option>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="bnb">BNB (BSC)</option>
                  <option value="solana">Solana (SOL)</option>
                  <option value="xrp">XRP (Ripple)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white">Settlement Address</label>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded">{paymentDetails[selectedCrypto].network}</span>
                </div>
                <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-neutral-800">
                  <p className="text-gray-900 dark:text-white font-mono text-sm break-all mb-3">{paymentDetails[selectedCrypto].address}</p>
                  <button onClick={handleCopy} className="w-full py-2.5 bg-gray-900 dark:bg-neutral-950 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                    <Copy size={14} /> Copy Address
                  </button>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">{paymentDetails[selectedCrypto].warning}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">1. Upload Settlement Confirmation *</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-neutral-800 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50 dark:bg-neutral-900">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{proofFile ? proofFile.name : 'Click to upload transaction confirmation'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">2. Transaction Hash (Optional)</label>
                <input type="text" placeholder="e.g., 0xabc123..." value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>

              <button onClick={handlePaymentMade} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg">
                <CheckCircle size={20} /> Submit Partnership
              </button>
            </div>

            <a href={`https://wa.me/${supportWhatsApp}?text=Hello 11WINS, I need help with a partnership settlement for ${player.name}.`} target="_blank" rel="noopener noreferrer" className="mt-8 block p-4 border border-gray-200 dark:border-neutral-800 rounded-lg text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:border-emerald-500 transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={16} /> Partnership Support
            </a>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Partnership</h2>
            <p className="text-gray-600 dark:text-gray-400">Securely submitting your settlement details...</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Partnership Submitted</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">Thank you for partnering with {player.name}. Our team will verify the transaction and be in touch shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}