'use client';

import { useState } from 'react';
import { HandCoins } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function SponsorPlayer({ player }: { player: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-sm text-center mt-6 border border-gray-800">
        <HandCoins size={32} className="text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Sponsor {player.name.split(' ')[0]}</h3>
        <p className="text-gray-400 text-xs mb-4">Support this young talent's journey to the top.</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
        >
          <HandCoins size={16} /> Sponsor / Pay
        </button>
      </div>
      
      <PaymentModal player={player} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}