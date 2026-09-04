'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Users, Upload, Edit2, X, Save, Check, Eye, FileText, Video, Phone, FileSignature } from 'lucide-react';

type Player = {
  id: string; name: string; club: string; position: string; age: number; nationality: string;
  contract_expiry: string; market_value: number; image_url: string; payment_status: string;
  payment_method: string; payment_contact: string; sponsor_owed: number;
  contract_url?: string | null; contract_signed?: boolean | null;
  bio?: string | null; career_stats?: string | null; transfer_history?: string | null;
};

type Application = {
  id: string; full_name: string; age: number; age_group: string; position: string; current_club: string;
  parent_contact: string; highlight_video_url: string; status: string; created_at: string;
  height: string; preferred_foot: string; place_of_birth: string; nationality: string; image_url: string;
};

function AppStatusControl({ appId, initialStatus, tableName, columnName = 'status', onUpdated }: { 
  appId: string, 
  initialStatus: string, 
  tableName: 'players' | 'applications', 
  columnName?: 'payment_status' | 'status', 
  onUpdated: () => void 
}) {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'pending');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from(tableName)
      .update({ [columnName]: selectedStatus })
      .eq('id', appId);
      
    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      onUpdated(); // This refreshes the table so you see the change instantly
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={selectedStatus} 
        onChange={(e) => setSelectedStatus(e.target.value)} 
        className="p-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 w-32"
      >
        <option value="pending">Pending</option>
        <option value="pending_verification">Verifying</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
        <option value="rejected">Rejected</option>
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
export default function DashboardPage(): import("react").JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'players' | 'applications'>('players');
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', 
    market_value: '', sponsor_owed: '', payment_status: 'pending', payment_method: 'whatsapp', 
    payment_contact: '+49 123 456 7890', contract_url: '',
    bio: '', career_stats: '', transfer_history: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/admin/login');
      else { setLoading(false); fetchPlayers(); fetchApplications(); }
    };
    checkUser();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    if (data) setPlayers(data);
  };

  const fetchApplications = async () => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (data) setApplications(data);
  };

  const handleEditClick = (player: Player) => {
    setEditingId(player.id);
    setFormData({ 
      name: player.name, club: player.club, position: player.position, age: String(player.age), 
      nationality: player.nationality, contract_expiry: player.contract_expiry, 
      market_value: String(player.market_value), sponsor_owed: String(player.sponsor_owed || 0), 
      payment_status: player.payment_status || 'pending', payment_method: player.payment_method || 'whatsapp', 
      payment_contact: player.payment_contact || '+49 123 456 7890', contract_url: player.contract_url || '',
      bio: player.bio || '', career_stats: player.career_stats || '', 
      transfer_history: player.transfer_history || '2023: Promoted to Senior Team | 2021: Signed Youth Contract'
    });
    setFile(null); setContractFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => { 
    setEditingId(null); 
    setFormData({ name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', market_value: '', sponsor_owed: '', payment_status: 'pending', payment_method: 'whatsapp', payment_contact: '+49 123 456 7890', contract_url: '', bio: '', career_stats: '', transfer_history: '' }); 
    setFile(null); setContractFile(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setUploading(true); 
    let imageUrl = '';
    let contractUrl = formData.contract_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('player-images').upload(fileName, file);
      if (error) { alert('Error uploading image: ' + error.message); setUploading(false); return; }
      const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);
      imageUrl = publicData.publicUrl;
    }

    if (contractFile) {
      const fileExt = contractFile.name.split('.').pop();
      const fileName = `contract-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('player-images').upload(fileName, contractFile);
      if (error) { alert('Error uploading contract: ' + error.message); setUploading(false); return; }
      const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);
      contractUrl = publicData.publicUrl;
    }

    const playerData = { 
      ...formData, 
      age: Number(formData.age), 
      market_value: Number(formData.market_value), 
      sponsor_owed: Number(formData.sponsor_owed), 
      ...(imageUrl && { image_url: imageUrl }),
      contract_url: contractUrl
    };

    let error;
    if (editingId) { 
      const res = await supabase.from('players').update(playerData).eq('id', editingId); 
      error = res.error; 
    } else { 
      const res = await supabase.from('players').insert([playerData]); 
      error = res.error; 
    }

    if (error) alert('Error saving player: ' + error.message);
    else { handleCancelEdit(); fetchPlayers(); }
    setUploading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter"><span className="text-amber-500">11</span>WINS <span className="text-gray-400 font-normal text-sm ml-2">Admin Portal</span></h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-500 transition-colors"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab('players')} className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'players' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <span className="flex items-center gap-2"><Users size={16} /> Player Roster ({players.length})</span>
            {activeTab === 'players' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}
          </button>
          <button onClick={() => setActiveTab('applications')} className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'applications' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <span className="flex items-center gap-2"><FileText size={16} /> Scouting Applications ({applications.length})</span>
            {activeTab === 'applications' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}
          </button>
        </div>

        {activeTab === 'players' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">{editingId ? <Edit2 size={20} className="text-amber-500" /> : <Plus size={20} className="text-amber-500" />} {editingId ? 'Edit Player' : 'Add New Player'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required placeholder="Player Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  <input required placeholder="Current Club" value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Position" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                    <input required type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  <input required placeholder="Nationality" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  <input required placeholder="Contract Expiry" value={formData.contract_expiry} onChange={e => setFormData({...formData, contract_expiry: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="number" placeholder="Market Value (€)" value={formData.market_value} onChange={e => setFormData({...formData, market_value: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                    <input type="number" placeholder="Sponsor Quota (€)" value={formData.sponsor_owed} onChange={e => setFormData({...formData, sponsor_owed: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  
                  {/* Player Image Upload */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-amber-500 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{file ? file.name : 'Upload player image'}</span>
                      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                    </label>
                  </div>

                  {/* Contract PDF Upload */}
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-blue-50/30">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <FileSignature size={24} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-600">{contractFile ? contractFile.name : (formData.contract_url ? 'Contract Attached (Upload new to replace)' : 'Upload Contract PDF')}</span>
                      <input type="file" accept="application/pdf" onChange={(e) => setContractFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                    </label>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Scouting Report / Bio</label>
                    <textarea 
                      placeholder="Describe the player's strengths, playing style, and potential..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  {/* Career Stats */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Career Statistics</label>
                    <input 
                      placeholder="e.g., Bundesliga: 24 apps | 5 goals | 8 assists"
                      value={formData.career_stats}
                      onChange={(e) => setFormData({...formData, career_stats: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  {/* Transfer History */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Transfer History</label>
                    <input 
                      placeholder="e.g., 2023: Joined Bayern Munich | 2021: Youth Promotion"
                      value={formData.transfer_history}
                      onChange={(e) => setFormData({...formData, transfer_history: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate entries with | (pipe symbol)</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {editingId && <button type="button" onClick={handleCancelEdit} className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"><X size={16} /> Cancel</button>}
                    <button type="submit" disabled={uploading} className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-gray-900 transition-colors disabled:opacity-50">
                      {uploading ? 'Saving...' : editingId ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Player</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-amber-500" /> Current Roster</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="pb-3 font-medium">Player</th>
                        <th className="pb-3 font-medium">Club</th>
                        <th className="pb-3 font-medium text-right">Value</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                        <th className="pb-3 font-medium text-center">Contract</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {players.map((player) => (
                        <tr key={player.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-semibold text-gray-900 flex items-center gap-3">
                            {player.image_url ? <img src={player.image_url} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" /> : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{player.name.charAt(0)}</div>}
                            {player.name}
                          </td>
                          <td className="py-4 text-center">
  <AppStatusControl 
    appId={player.id} 
    initialStatus={player.payment_status} 
    tableName="players" 
    columnName="payment_status" 
    onUpdated={fetchPlayers} 
  />
</td>
                          <td className="py-4 text-right"><button onClick={() => handleEditClick(player)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FileText size={20} className="text-amber-500" /> Incoming Scouting Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Applicant</th>
                    <th className="pb-3 font-medium">Age / Group</th>
                    <th className="pb-3 font-medium">Position</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                    <th className="pb-3 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {applications.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-gray-500">No applications received yet.</td></tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-semibold text-gray-900 flex items-center gap-3">
                          {app.image_url ? <img src={app.image_url} alt={app.full_name} className="w-8 h-8 rounded-full object-cover border border-gray-200" /> : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{app.full_name.charAt(0)}</div>}
                          {app.full_name}
                        </td>
                        <td className="py-4 text-center">
                         <AppStatusControl 
                         appId={app.id} 
                          initialStatus={app.status} 
                          tableName="applications" 
                          columnName="status" 
                          onUpdated={fetchApplications} 
                         />
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold">Scouting Report: {selectedApp.full_name}</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-4">
                  {selectedApp.image_url ? (
                    <img src={selectedApp.image_url} alt={selectedApp.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">{selectedApp.full_name.charAt(0)}</div>
                  )}
                </div>
                {selectedApp.highlight_video_url && (
                  <a href={selectedApp.highlight_video_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                    <Video size={16} /> Watch Highlights
                  </a>
                )}
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500 text-xs">Nationality</p><p className="font-medium">{selectedApp.nationality || 'N/A'}</p></div>
                    <div><p className="text-gray-500 text-xs">Place of Birth</p><p className="font-medium">{selectedApp.place_of_birth || 'N/A'}</p></div>
                    <div><p className="text-gray-500 text-xs">Age</p><p className="font-medium">{selectedApp.age} years ({selectedApp.age_group})</p></div>
                    <div><p className="text-gray-500 text-xs">Applied On</p><p className="font-medium">{new Date(selectedApp.created_at).toLocaleDateString()}</p></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Physical & Technical</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500 text-xs">Height</p><p className="font-medium">{selectedApp.height ? `${selectedApp.height} cm` : 'N/A'}</p></div>
                    <div><p className="text-gray-500 text-xs">Preferred Foot</p><p className="font-medium">{selectedApp.preferred_foot || 'N/A'}</p></div>
                    <div><p className="text-gray-500 text-xs">Position</p><p className="font-medium">{selectedApp.position}</p></div>
                    <div><p className="text-gray-500 text-xs">Current Club</p><p className="font-medium">{selectedApp.current_club || 'Unattached'}</p></div>
                  </div>
                </div>

                {selectedApp.parent_contact && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2"><Phone size={12} /> Parent/Guardian Contact (Minor)</h4>
                    <p className="font-medium text-gray-900">{selectedApp.parent_contact}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
              <p className="text-xs text-gray-500">
                * To comply with GDPR Article 17 (Right to Erasure), deleting this record permanently removes all personal data.
              </p>
              <button 
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to permanently delete ${selectedApp.full_name}'s data? This cannot be undone.`)) {
                    await supabase.from('applications').delete().eq('id', selectedApp.id);
                    fetchApplications();
                    setSelectedApp(null);
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
              >
                <X size={14} /> Delete Record (GDPR)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}