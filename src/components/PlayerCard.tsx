'use client';

import { CreditCard, MapPin, Calendar, Check, AlertTriangle, X, Copy, MessageCircle, Loader2, CheckCircle, Upload, FileText } from "lucide-react";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from "next/image";

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

// CLIENT'S OFFICIAL CRYPTO WALLETS
const paymentDetails = {
  bitcoin: {
    address: "bc1qypzqq8rp2e79yqf9ekdps38s2x9qaclyc22cdl",
    network: "Bitcoin (BTC)",
    warning: "Send Bitcoin only to this address."
  },
  usdt_trc20: {
    address: "TBUsMd2teFnogwpA2TWvU6H2YTNfoRDGGE",
    network: "USDT (TRC-20 / Tron)",
    warning: "⚠️ Only send USDT via TRC-20 network. Do NOT use ERC-20."
  },
  ethereum: {
    address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B",
    network: "Ethereum (ETH)",
    warning: "Send Ethereum only to this address."
  },
  bnb: {
    address: "0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B",
    network: "BNB (BEP-20 / BSC)",
    warning: "Send BNB via BSC (BEP-20) network."
  },
  solana: {
    address: "B3qUm1knMvVj9XzUC7WdYA73Jxr67cARKfgqgSpo2PuC",
    network: "Solana (SOL)",
    warning: "Send Solana only to this address."
  },
  xrp: {
    address: "rM63mKH5KLZCR2k7XUaWgHYeaUGKuMU1Mz",
    network: "XRP (Ripple)",
    warning: "Send XRP only to this address. No destination tag required."
  }
};

export default function PlayerCard({ player }: { player: Player }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof paymentDetails>('usdt_trc20');
  
  const formatValue = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
    return `€${val}`;
  };

  const status = player.payment_status || 'pending';
  const statusConfig = status === 'paid' 
    ? { text: 'PAID', color: 'bg-emerald-500', icon: <Check className="w-3 h-3" /> }
    : status === 'pending_verification'
    ? { text: 'VERIFYING', color: 'bg-blue-500', icon: <Loader2 className="w-3 h-3 animate-spin" /> }
    : status === 'overdue' 
    ? { text: 'OVERDUE', color: 'bg-red-500', icon: <AlertTriangle className="w-3 h-3" /> }
    : { text: 'PENDING', color: 'bg-amber-500', icon: <AlertTriangle className="w-3 h-3" /> };

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

    setPaymentStep('processing');
    let proofUrl = '';

    // 1. Upload Proof Image
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

    // 2. Update Database
    const { error } = await supabase
      .from('players')
      .update({ 
        payment_status: 'pending_verification',
        payment_proof_url: proofUrl,
        transaction_hash: txHash || 'Pending',
        payment_method: selectedCrypto
      })
      .eq('id', player.id);

    if (!error) {
      setPaymentStep('success');
      setTimeout(() => {
        setShowModal(false);
        setPaymentStep('details');
        window.location.reload(); 
      }, 3000);
    } else {
      alert('Error updating status. Please contact support.');
      setPaymentStep('details');
    }
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-400 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all duration-300 flex flex-col relative">
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold ${statusConfig.color} text-white flex items-center gap-1 z-10`}>
          {statusConfig.icon} {statusConfig.text}
        </div>

        <a href={`/players/${player.id}`} className="block w-full aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-amber-400 transition-colors relative">
          {player.image_url ? (
            <Image src={player.image_url} alt={player.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <span className="text-4xl font-bold text-gray-400">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
          )}
        </a>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <a href={`/players/${player.id}`} className="text-lg font-bold text-gray-900 leading-tight hover:text-amber-400 transition-colors">
              {player.name}
            </a>
            <span className="text-xs font-semibold px-2 py-1 bg-white text-amber-500 rounded border border-amber-200 group-hover:bg-amber-400 group-hover:text-white group-hover:border-amber-400 transition-colors duration-300">{player.position}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{player.club}</p>
          <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2"><MapPin size={12} /> {player.nationality} • {player.age} yrs</div>
            <div className="flex items-center gap-2"><Calendar size={12} /> Exp: {player.contract_expiry}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-auto group-hover:border-amber-300 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Sponsorship Quota</span>
            <span className="text-lg font-bold text-gray-900">{player.sponsor_owed > 0 ? `€${player.sponsor_owed.toLocaleString()}` : 'Contact'}</span>
          </div>
          <button onClick={() => setShowModal(true)} className="w-full py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 hover:text-white hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
            <CreditCard size={16} /> Sponsor / Pay
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 relative" onClick={(e) => e.stopPropagation()}>
            
            {paymentStep === 'details' && (
              <>
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    <p className="text-gray-400 text-sm">Crypto Payment</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                <div className="p-6 pb-20"> 
                  {/* CRYPTO WARNING */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-red-700">Crypto Payments Only</p>
                      <p className="text-xs text-red-600 mt-1">Due to widespread fraudulent activities, <strong>we do not accept bank transfers</strong>. All payments must be made via cryptocurrency.</p>
                    </div>
                  </div>

                  {/* CRYPTO SELECTOR */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Select Cryptocurrency</label>
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value as keyof typeof paymentDetails)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-medium"
                    >
                      <option value="usdt_trc20">USDT (TRC-20 / Tron) - Recommended</option>
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="ethereum">Ethereum (ETH)</option>
                      <option value="bnb">BNB (BSC)</option>
                      <option value="solana">Solana (SOL)</option>
                      <option value="xrp">XRP (Ripple)</option>
                    </select>
                  </div>

                  {/* WALLET ADDRESS DISPLAY */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-900">Wallet Address</label>
                      <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded">
                        {paymentDetails[selectedCrypto].network}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-mono text-sm break-all mb-3">{paymentDetails[selectedCrypto].address}</p>
                      <button onClick={handleCopy} className="w-full py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Copy size={16} /> Copy Address
                      </button>
                    </div>
                    <p className="text-xs text-red-600 mt-2 font-medium">{paymentDetails[selectedCrypto].warning}</p>
                  </div>

                  {/* PROOF UPLOAD */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">1. Upload Proof of Payment *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-400 transition-colors cursor-pointer">
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{proofFile ? proofFile.name : 'Click to upload screenshot'}</span>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* TRANSACTION HASH */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">2. Transaction Hash (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 0xabc123..." 
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-mono" 
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button onClick={handlePaymentMade} className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Check size={18} /> Submit for Verification
                  </button>
                </div>

                <a href={`https://wa.me/${supportWhatsApp}?text=Hello 11WINS Support, I need help with a crypto payment for ${player.name}.`} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 left-6 flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-amber-500 transition-colors">
                  <MessageCircle size={14} /> Payment Support
                </a>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Uploading Proof</h3>
                <p className="text-gray-600">Securely submitting your transaction details...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Submitted for Verification!</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  Our finance team will verify the blockchain transaction shortly. Your status will update to "PAID" once confirmed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}