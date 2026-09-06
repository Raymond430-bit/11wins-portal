'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PlayerCard from './PlayerCard'; // <--- THIS IMPORTS YOUR NEW GREEN CARD

export default function SearchablePlayerGrid({ initialPlayers }: { initialPlayers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState('all');

  const safePlayers = initialPlayers || [];
  const uniqueAges = Array.from(new Set(safePlayers.map((p: any) => p.age))).sort((a: number, b: number) => a - b);

  const filteredPlayers = safePlayers.filter((player: any) => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAge = selectedAge === 'all' || player.age === Number(selectedAge);
    return matchesSearch && matchesAge;
  });

  return (
    <div className="space-y-8">
      {/* Clean Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search players, clubs, or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 appearance-none transition-colors"
          >
            <option value="all">All Age Groups</option>
            {uniqueAges.map((age: number) => (
              <option key={age} value={age}>U{age}</option>
            ))}
          </select>
        </div>
      </div>

      {/* The Player Grid - Now using your new PlayerCard component! */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlayers.map((player: any) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <p className="text-lg font-medium text-gray-500">No players found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}