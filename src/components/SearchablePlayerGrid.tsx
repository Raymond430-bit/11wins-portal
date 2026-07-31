'use client';

import { useState } from 'react';
import PlayerCard from './PlayerCard';
import { Search } from 'lucide-react';

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
};

export default function SearchablePlayerGrid({ initialPlayers }: { initialPlayers: Player[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = initialPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative mb-16">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players, clubs, or nationalities..." 
          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors duration-300"
        />
      </div>

      {/* Players Grid */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          {searchTerm ? `Search Results (${filteredPlayers.length})` : 'Featured Roster'}
        </h3>
      </div>

      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No players found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}