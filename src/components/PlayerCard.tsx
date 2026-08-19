'use client';
import Image from "next/image"; 
import { CreditCard, MapPin, Calendar, Check, AlertTriangle, X, Copy, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
};

export default function PlayerCard({ player }: { player: Player }) {
  const [showModal, setShowModal] = useState(false);
  // NEW: Track the steps of the payment process
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  
  const formatValue = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
    return `€${val}`;
  };

  const status = player.payment_status || 'pending';
  const statusConfig = status === 'paid' 
    ? { text: 'PAID', color: 'bg-emerald-500', icon: <Check className="w-3 h-3" /> }
    : status === 'overdue' 
    ? { text: 'OVERDUE', color: 'bg-red-500', icon: <AlertTriangle className="w-3 h-3" /> }
    : { text: 'PENDING', color: 'bg-amber-500', icon: <AlertTriangle className="w-3 h-3" /> };

  const supportWhatsApp = '491234567890'; // <-- UPDATE WITH REAL NUMBER

  const handleCopy = () => {
    navigator.clipboard.writeText('DE89 3704 0044 0532 0130 00');
    alert('Account number copied to clipboard!');
  };

  // UPDATED: Handle the multi-step payment flow
  const handlePaymentMade = async () => {
    setPaymentStep('processing'); // Show processing screen
    
    const { error } = await supabase
      .from('players')
      .update({ payment_status: 'pending' })
      .eq('id', player.id);

    if (!error) {
      setPaymentStep('success'); // Show success screen
      // Automatically close and refresh after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        setPaymentStep('details'); // Reset for next time
        window.location.reload(); 
      }, 3000);
    } else {
      alert('Error updating status. Please contact support.');
      setPaymentStep('details'); // Go back to details if error
    }
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-400 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all duration-300 flex flex-col relative">
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold ${statusConfig.color} text-white flex items-center gap-1 z-10`}>
          {statusConfig.icon} {statusConfig.text}
        </div>

                <a href={`/players/${player.id}`} className="relative block w-full aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-amber-400 transition-colors">
          {player.image_url ? (
            <Image 
              src={player.image_url} 
              alt={player.name} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
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
            <span className="text-xs text-gray-500 uppercase tracking-wider">Market Value</span>
            <span className="text-lg font-bold text-gray-900">{formatValue(player.market_value)}</span>
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
            
            {/* ========================================== */}
            {/* SCREEN 1: PAYMENT DETAILS */}
            {/* ========================================== */}
            {paymentStep === 'details' && (
              <>
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    <p className="text-gray-400 text-sm">{player.club}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                <div className="p-6 pb-20"> 
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sponsorship Quota</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {player.sponsor_owed > 0 ? `€${player.sponsor_owed.toLocaleString()}` : 'Contact for Quote'}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2 ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.text}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Bank Transfer Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                      <div>
                        <p className="text-gray-500 text-xs uppercase mb-1">Bank Name</p>
                        <p className="text-gray-900 font-medium text-sm">Deutsche Bank AG</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase mb-1">Account Holder</p>
                        <p className="text-gray-900 font-medium text-sm">11WINS GmbH</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <div className="overflow-hidden">
                          <p className="text-gray-500 text-xs uppercase mb-1">IBAN</p>
                          <p className="text-gray-900 font-mono font-medium text-sm truncate">DE89 3704 0044 0532 0130 00</p>
                        </div>
                        <button onClick={handleCopy} className="p-2.5 bg-gray-200 rounded-lg hover:bg-amber-400 hover:text-white transition-colors flex-shrink-0 ml-2" title="Copy IBAN">
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={handlePaymentMade} className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Check size={18} /> I Have Made the Payment
                  </button>
                </div>

                <a href={`https://wa.me/${supportWhatsApp}?text=Hello 11WINS Support, I need help with a payment for ${player.name}.`} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 left-6 flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-amber-500 transition-colors">
                  <MessageCircle size={14} /> Payment Support
                </a>
              </>
            )}

            {/* ========================================== */}
            {/* SCREEN 2: PROCESSING */}
            {/* ========================================== */}
            {paymentStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Verifying transaction details securely...</p>
              </div>
            )}

            {/* ========================================== */}
            {/* SCREEN 3: SUCCESS */}
            {/* ========================================== */}
            {paymentStep === 'success' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  Thank you. Our finance team has been notified and will verify your payment shortly.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}