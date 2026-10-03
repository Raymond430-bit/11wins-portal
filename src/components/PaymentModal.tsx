'use client';

import { CreditCard, X, Copy, MessageCircle, Loader2, CheckCircle, Upload, AlertTriangle, Check } from "lucide-react";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Player = {
  id: string;
  name: string;
  sponsor_owed: number;
  custom_wallets?: { btc?: string; eth?: string; usdt?: string };
};

export default function PaymentModal({ player, isOpen, onClose }: { player: Player; isOpen: boolean; onClose: () => void }) {
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<'usdt_trc20' | 'bitcoin' | 'ethereum'>('usdt_trc20');
  
  // NEW: State to hold the live global wallets from the database
  const [globalWallets, setGlobalWallets] = useState({
    btc: 'bc1qypzqq8rp2e79yqf9ekdps38s2x9qaclyc22cdl', // Safe fallback
    eth: '0x372B4Bd10546c74a30D02539a46F1c8c11e72c7B',
    usdt: 'TBUsMd2teFnogwpA2TWvU6H2YTNfoRDGGE'
  });

  // NEW: Fetch global settings whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSettings = async () => {
        const { data } = await supabase.from('site_settings').select('wallet_btc, wallet_eth, wallet_usdt').single();
        if (data) {
          setGlobalWallets({
            btc: data.wallet_btc || globalWallets.btc,
            eth: data.wallet_eth || globalWallets.eth,
            usdt: data.wallet_usdt || globalWallets.usdt
          });
        }
      };
      fetchSettings();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  // LOGIC: Use custom wallets if they exist, otherwise fallback to the fetched global wallets
  const getWalletAddress = (crypto: string) => {
    const custom = player.custom_wallets || {};
    if (crypto === 'bitcoin' && custom.btc) return custom.btc;
    if (crypto === 'ethereum' && custom.eth) return custom.eth;
    if (crypto === 'usdt_trc20' && custom.usdt) return custom.usdt;
    
    // Fallback to global
    if (crypto === 'bitcoin') return globalWallets.btc;
    if (crypto === 'ethereum') return globalWallets.eth;
    if (crypto === 'usdt_trc20') return globalWallets.usdt;
    
    return 'Address not found';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getWalletAddress(selectedCrypto));
    alert('Address copied to clipboard!');
  };

  const handlePaymentMade = async () => {
    if (!proofFile) { alert('Please upload proof of payment.'); return; }
    setPaymentStep('processing'); let proofUrl = '';

    const fileExt = proofFile.name.split('.').pop();
    const fileName = `proof-${player.id}-${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage.from('player-images').upload(fileName, proofFile);
    
    if (uploadError) { alert('Error uploading proof: ' + uploadError.message); setPaymentStep('details'); return; }
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
      setTimeout(() => { onClose(); setPaymentStep('details'); window.location.reload(); }, 3000);
    } else {
      alert('Error updating status.');
      setPaymentStep('details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {paymentStep === 'details' && (
          <>
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold">{player.name}</h3>
                <p className="text-gray-400 text-sm mt-1">Sponsorship Quota: €{player.sponsor_owed > 0 ? player.sponsor_owed.toLocaleString() : 'Contact'}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
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
                  onChange={(e) => setSelectedCrypto(e.target.value as any)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="usdt_trc20">USDT (TRC-20 / Tron) - Recommended</option>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900">Wallet Address</label>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                    {selectedCrypto === 'usdt_trc20' ? 'USDT (TRC-20)' : selectedCrypto === 'bitcoin' ? 'Bitcoin (BTC)' : 'Ethereum (ETH)'}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-gray-900 font-mono text-sm break-all mb-3">{getWalletAddress(selectedCrypto)}</p>
                  <button onClick={handleCopy} className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                    <Copy size={14} /> Copy Address
                  </button>
                </div>
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
            <p className="text-sm text-gray-600 max-w-xs mx-auto">Our finance team will verify the blockchain transaction shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}