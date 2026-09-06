'use client';

import { CreditCard, MapPin, Calendar, Check, AlertTriangle, X, Copy, MessageCircle, Loader2, CheckCircle, Upload, TrendingUp } from "lucide-react";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from "next/image";
import Link from "next/link";

type Player = {
  id: string;
  name: string;
  club: string;
  position: string;
  age: number;
  nationality: string;
  contract_expiry: string;
  market_value: number;
  image_url: string | null;
  sponsor_owed: number;
  payment_status?: string | null;
  payment_method?: string | null;
  payment_contact?: string | null;
  payment_proof_url?: string | null;
  transaction_hash?: string | null;
  contract_signed?: boolean;
};

const paymentDetails = {
  bitcoin: { address: "bc1qypzqq8rp2e79yqf9ekdps38s2x9qaclyc22cdl", network: "Bitcoin (BTC)", warning: "Send Bitcoin only to this address." },
  usdt_trc20: { address: "TBUsMd2teFnogwpA2TWvU6H2YTNfoRDGGE", network: "USDT (TRC-20 / Tron)", warning: "⚠️ Only send USDT via TRC-20 network. Do NOT use ERC-20." },
  ethereum: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "Ethereum (ETH)", warning: "Send Ethereum only to this address." },
  bnb: { address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B", network: "BNB (BEP-20 / BSC)", warning: "Send BNB via BSC (BEP-20) network." },
  solana: { address: "B3qUm1knMvVj9XzUC7WdYA73Jxr67cARKfgqgSpo2PuC", network: "Solana (SOL)", warning: "Send Solana only to this address." },
  xrp: { address: "rM63mKH5KLZCR2k7XUaWgHYeaUGKuMU1Mz", network: "XRP (Ripple)", warning: "Send XRP only to this address. No destination tag required." }
};

export default function PlayerCard({ player }: { player: Player }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof paymentDetails>('usdt_trc20');
  
  const status = player.payment_status || 'pending';
  const supportWhatsApp = '491234567890'; 

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails[selectedCrypto].address);
    alert(`${selectedCrypto.toUpperCase()} address copied to clipboard!`);
  };

  const handlePaymentMade = async () => {
    if (!proofFile) {
      alert('Please upload proof of payment (screenshot or transaction hash).');
      return;
    }

    setPaymentStep('processing'); let proofUrl = '';
    const fileExt = proofFile.name.split('.').pop();
    const fileName = `proof-${player.id}-${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage.from('player-images').upload(fileName, proofFile);
    
    if (uploadError) {
      alert('Error uploading proof: ' + uploadError.message);
      setPaymentStep('details');
      return;
    }
    
    const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);
    proofUrl = publicData.publicUrl;

    const { error } = await supabase.from('players').update({ 
      payment_status: 'pending_verification',
      payment_proof_url: proofUrl,
      transaction_hash: txHash || 'Pending',
      payment_method: selectedCrypto
    }).eq('id', player.id);

    if (!error) {
      setPaymentStep('success');
      setTimeout(() => { setShowModal(false); setPaymentStep('details'); window.location.reload(); }, 3000);
    } else {
      alert('Error updating status. Please contact support.');
      setPaymentStep('details');
    }
  };

  return (
    <>
      {/* PREMIUM SPORTS AGENCY CARD */}
      <div className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col">
        {/* Image Container */}
        <Link href={`/players/${player.id}`} className="relative h-72 bg-gray-100 block overflow-hidden">
          {player.image_url ? (
               <img src={player.image_url} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-6xl font-bold text-gray-400">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
            </div>
          )}
          
          {/* Position Badge - Green Brand Color */}
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-500 text-white rounded-sm shadow-sm">
              {player.position}
            </span>
          </div>
        </Link>

        {/* Player Info */}
        <div className="p-5 flex-1 flex flex-col">
          <Link href={`/players/${player.id}`} className="block mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {player.name}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 mb-4 font-medium">{player.club}</p>
          
          <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-500" /> 
              <span>{player.nationality}</span>
              <span className="text-gray-300">•</span>
              <span>{player.age} yrs</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-emerald-500" /> 
              <span>Contract: {player.contract_expiry}</span>
            </div>
          </div>

          {/* Market Value & Sponsorship Quota - Clear Business Info */}
          <div className="border-t border-gray-200 pt-4 mt-auto space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={12} /> Market Value
              </span>
              <span className="text-lg font-bold text-gray-900">€{(player.market_value / 1000000).toFixed(2)}M</span>
            </div>
            
            <div className="flex justify-between items-center bg-emerald-50 -mx-2 px-3 py-2 rounded">
              <span className="text-xs text-emerald-800 uppercase tracking-wider font-semibold">Sponsorship Quota</span>
              <span className="text-lg font-bold text-emerald-600">€{player.sponsor_owed > 0 ? player.sponsor_owed.toLocaleString() : 'Contact'}</span>
            </div>

            {/* Premium CTA Button */}
           <button 
            onClick={() => setShowModal(true)} 
            className="w-full mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 transition-colors group/btn"
          >
            <span className="flex items-center gap-2"><CreditCard size={14} /> Sponsor / Inquire</span>
            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
          </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL (Same as before, kept functional) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            {paymentStep === 'details' && (
              <>
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                  <div>
                    <h3 className="text-lg font-bold">{player.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">Crypto Payment</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-6"> 
                  <div className="bg-red-50 border border-red-200 p-4 flex gap-3 rounded">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Crypto Payments Only</p>
                      <p className="text-xs text-gray-600 mt-1">We do not accept bank transfers. All payments must be made via cryptocurrency.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Select Cryptocurrency</label>
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value as keyof typeof paymentDetails)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    >
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
                      <label className="block text-sm font-bold text-gray-900">Wallet Address</label>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                        {paymentDetails[selectedCrypto].network}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-gray-900 font-mono text-sm break-all mb-3">{paymentDetails[selectedCrypto].address}</p>
                      <button onClick={handleCopy} className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                        <Copy size={14} /> Copy Address
                      </button>
                    </div>
                    <p className="text-xs text-red-600 mt-2 font-medium">{paymentDetails[selectedCrypto].warning}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">1. Upload Proof of Payment *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50">
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{proofFile ? proofFile.name : 'Click to upload screenshot'}</span>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">2. Transaction Hash (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 0xabc123..." 
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                  </div>

                  <button onClick={handlePaymentMade} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <Check size={16} /> Submit for Verification
                  </button>
                </div>

                <a href={`https://wa.me/${supportWhatsApp}?text=Hello 11WINS Support, I need help with a crypto payment for ${player.name}.`} target="_blank" rel="noopener noreferrer" className="block p-4 border-t border-gray-100 text-center text-xs font-medium text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> Payment Support
                </a>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-6" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Uploading Proof</h3>
                <p className="text-sm text-gray-600">Securely submitting your transaction details...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Submitted for Verification</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Our finance team will verify the blockchain transaction shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}