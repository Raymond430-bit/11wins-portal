import { MapPin, Calendar, Star, Target, Trophy, Activity, ArrowRight } from "lucide-react";
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
  is_featured?: boolean;
  stats_goals?: number;
  stats_assists?: number;
  stats_appearances?: number;
};

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/players/${player.id}`} className="relative h-72 bg-gray-100 dark:bg-neutral-800 block overflow-hidden">
        {player.image_url ? (
          <img src={player.image_url} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-800">
            <span className="text-6xl font-bold text-gray-400 dark:text-neutral-600">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
          </div>
        )}
        {player.is_featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
            <Star size={10} fill="currentColor" /> FEATURED
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-bold px-3 py-1.5 bg-emerald-500 text-white rounded-sm shadow-sm">{player.position}</span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/players/${player.id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{player.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">{player.club}</p>

        <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-500" />
            <span>{player.nationality}</span>
            <span className="text-gray-300 dark:text-neutral-700">•</span>
            <span>{player.age} yrs</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" />
            <span>Contract until {player.contract_expiry}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-4 mt-auto">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <Target size={14} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_goals || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Goals</p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-neutral-800">
              <Activity size={14} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_assists || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Assists</p>
            </div>
            <div className="text-center">
              <Trophy size={14} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_appearances || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Apps</p>
            </div>
          </div>

          <Link
            href={`/engage/${player.id}`}
            className="w-full py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-600 text-gray-900 dark:text-white text-sm font-semibold rounded transition-all duration-300 flex items-center justify-center gap-2"
          >
            Partnerships & Inquiries
            <ArrowRight size={16} className="text-emerald-600 dark:text-emerald-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}