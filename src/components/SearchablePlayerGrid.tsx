'use client';

import { useState } from 'react';
import PlayerCard from './PlayerCard';
import { Search, Filter } from 'lucide-react';

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
  age_group?: string; // <-- Added for filtering
};

export default function SearchablePlayerGrid({ initialPlayers }: { initialPlayers: Player[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');

  // Filter logic: Matches BOTH search term AND age group
  const filteredPlayers = initialPlayers.filter((player) => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAge = ageFilter === 'All' || player.age_group === ageFilter;

    return matchesSearch && matchesAge;
  });

  const ageGroups = ['All', 'Senior', 'U20', 'U18', 'U16', 'U14', 'U12', 'U10', 'U8'];

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="max-w-3xl mx-auto relative mb-12 flex flex-col sm:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players, clubs, or nationalities..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors duration-300"
          />
        </div>

        {/* Age Filter Dropdown */}
        <div className="relative sm:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <select 
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors duration-300 appearance-none cursor-pointer"
          >
            {ageGroups.map((group) => (
              <option key={group} value={group}>{group === 'All' ? 'All Categories' : group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          {searchTerm || ageFilter !== 'All' 
            ? `Search Results (${filteredPlayers.length})` 
            : 'Full Roster'}
        </h3>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-lg font-medium">No players found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or age filter.</p>
        </div>
      )}
    </div>
  );
}