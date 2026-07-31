'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Users, Upload, Edit2, X, Save, Check } from 'lucide-react';

type Player = {
  id: string;
  name: string;
  club: string;
  position: string;
  age: number;
  nationality: string;
  contract_expiry: string;
  market_value: number;
  sponsor_owed: number;
  image_url: string;
  payment_status: string;
  payment_method: string;
  payment_contact: string;
};

function StatusControl({ playerId, initialStatus, onUpdated }: { playerId: string, initialStatus: string, onUpdated: () => void }) {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'pending');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    const { error } = await supabase.from('players').update({ payment_status: selectedStatus }).eq('id', playerId);
    if (!error) onUpdated();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={selectedStatus} 
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="p-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 w-24"
      >
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>
      <button 
        onClick={handleApply} 
        disabled={loading}
        className="p-1.5 bg-gray-900 text-white rounded hover:bg-amber-400 hover:text-gray-900 transition-colors disabled:opacity-50"
      >
        {loading ? <div className="w-3 h-3 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div> : <Check size={14} />}
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', market_value: '', sponsor_owed: '',
    payment_status: 'pending', payment_method: 'whatsapp', payment_contact: '+49 123 456 7890'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/admin/login');
      else { setLoading(false); fetchPlayers(); }
    };
    checkUser();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    if (data) setPlayers(data);
  };

  const handleEditClick = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name, club: player.club, position: player.position,
      age: String(player.age), nationality: player.nationality, contract_expiry: player.contract_expiry, 
      market_value: String(player.market_value), sponsor_owed: String(player.sponsor_owed || 0),
      payment_status: player.payment_status || 'pending', payment_method: player.payment_method || 'whatsapp', 
      payment_contact: player.payment_contact || '+49 123 456 7890'
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', market_value: '', sponsor_owed: '', payment_status: 'pending', payment_method: 'whatsapp', payment_contact: '+49 123 456 7890' });
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = '';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('player-images').upload(fileName, file);
      if (error) { alert('Error uploading image: ' + error.message); setUploading(false); return; }
      const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);
      imageUrl = publicData.publicUrl;
    }

    const playerData = { 
      ...formData, 
      age: Number(formData.age), 
      market_value: Number(formData.market_value), 
      sponsor_owed: Number(formData.sponsor_owed), // <-- Saves the quota
      ...(imageUrl && { image_url: imageUrl }) 
    };
    
    let error;
    if (editingId) { const res = await supabase.from('players').update(playerData).eq('id', editingId); error = res.error; } 
    else { const res = await supabase.from('players').insert([playerData]); error = res.error; }

    if (error) alert('Error saving player: ' + error.message);
    else { handleCancelEdit(); fetchPlayers(); }
    setUploading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100 sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter"><span className="text-amber-400">11</span>WINS <span className="text-gray-400 font-normal text-sm ml-2">Admin Portal</span></h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">{editingId ? <Edit2 size={20} className="text-amber-400" /> : <Plus size={20} className="text-amber-400" />} {editingId ? 'Edit Player' : 'Add New Player'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Player Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                <input required placeholder="Current Club" value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Position (e.g. AM)" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                  <input required type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                </div>
                <input required placeholder="Nationality (e.g. DEU)" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                <input required placeholder="Contract Expiry (e.g. 06.2028)" value={formData.contract_expiry} onChange={e => setFormData({...formData, contract_expiry: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                
                {/* Financials */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Financial Details</p>
                </div>
                <input required type="number" placeholder="Market Value in Euros" value={formData.market_value} onChange={e => setFormData({...formData, market_value: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />
                <input type="number" placeholder="Sponsorship Quota / Amount Owed (€)" value={formData.sponsor_owed} onChange={e => setFormData({...formData, sponsor_owed: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />

                <div className="grid grid-cols-2 gap-3">
                  <select value={formData.payment_status} onChange={e => setFormData({...formData, payment_status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm">
                    <option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
                  </select>
                  <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm">
                    <option value="whatsapp">WhatsApp</option><option value="bank">Bank Transfer</option><option value="crypto">Crypto</option>
                  </select>
                </div>
                <input type="text" placeholder="Payment Contact" value={formData.payment_contact} onChange={e => setFormData({...formData, payment_contact: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm" />

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-amber-400 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{file ? file.name : 'Click to upload player image'}</span>
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && <button type="button" onClick={handleCancelEdit} className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"><X size={16} /> Cancel</button>}
                  <button type="submit" disabled={uploading} className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50">
                    {uploading ? 'Saving...' : editingId ? <><Save size={16} /> Update Player</> : <><Plus size={16} /> Add to Roster</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-amber-400" /> Current Roster ({players.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 font-medium">Player</th>
                      <th className="pb-3 font-medium">Club</th>
                      <th className="pb-3 font-medium">Pos</th>
                      <th className="pb-3 font-medium text-right">Value</th>
                      <th className="pb-3 font-medium text-right">Quota</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {players.map((player) => (
                      <tr key={player.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                        <td className="py-4 font-semibold text-gray-900 flex items-center gap-3">
                          {player.image_url ? <img src={player.image_url} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" /> : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{player.name.charAt(0)}</div>}
                          {player.name}
                        </td>
                        <td className="py-4 text-gray-600">{player.club}</td>
                        <td className="py-4 text-gray-600">{player.position}</td>
                        <td className="py-4 text-right font-medium text-gray-900">€{(player.market_value / 1000000).toFixed(1)}M</td>
                        <td className="py-4 text-right font-medium text-gray-900">€{player.sponsor_owed ? player.sponsor_owed.toLocaleString() : '0'}</td>
                        
                        <td className="py-4 text-center">
                          <div className="flex justify-center">
                            <StatusControl playerId={player.id} initialStatus={player.payment_status} onUpdated={fetchPlayers} />
                          </div>
                        </td>

                        <td className="py-4 text-right">
                          <button onClick={() => handleEditClick(player)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Player"><Edit2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}