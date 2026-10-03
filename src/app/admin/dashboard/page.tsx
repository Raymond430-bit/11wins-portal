'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Plus, LogOut, Users, Upload, Edit2, X, Save, Check, Eye, FileText, 
  Video, Phone, Trash2, Search, TrendingUp, FileSignature, Download, AlertCircle, Image as ImageIcon,
  Activity, Smartphone, Monitor, Star, CheckCircle, Globe, DollarSign, Type, Headphones, Power, Inbox
} from 'lucide-react';

type Player = {
  id: string; name: string; club: string; position: string; age: number; nationality: string;
  contract_expiry: string; market_value: number; image_url: string; payment_status: string;
  payment_method?: string; sponsor_owed: number; contract_url?: string | null; 
  contract_signed?: boolean | null; bio?: string; career_stats?: string; transfer_history?: string;
  tags?: string; payment_proof_url?: string; transaction_hash?: string;
  rarity?: string; stats_goals?: number; stats_assists?: number; stats_appearances?: number;
  custom_wallets?: { btc?: string; eth?: string; usdt?: string };
  is_featured?: boolean; transfer_status?: string;
};

type Application = {
  id: string; full_name: string; age: number; age_group: string; position: string; current_club: string;
  parent_contact: string; highlight_video_url: string; status: string; created_at: string;
  nationality: string; image_url: string;
};

type VisitorLog = {
  id: string; created_at: string; ip_address: string; user_agent: string; visited_path: string;
};

const AVAILABLE_TAGS = ["Verified", "Shooting Star", "Star Player", "Aggressive", "Juvenile", "Captain", "Playmaker", "Rising Talent"];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'players' | 'applications' | 'visitors' | 'settings' | 'disputes' | 'inquiries'>('players');
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [disputedPlayers, setDisputedPlayers] = useState<Player[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [viewingProof, setViewingProof] = useState<Player | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', 
    market_value: '', sponsor_owed: '', payment_status: 'pending', payment_method: 'crypto',
    bio: '', career_stats: '', transfer_history: '', contract_url: '', tags: '',
    rarity: 'Common', stats_goals: '0', stats_assists: '0', stats_appearances: '0',
    custom_btc: '', custom_eth: '', custom_usdt: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchPlayers = async () => { const { data } = await supabase.from('players').select('*').order('age', { ascending: true }); if (data) setPlayers(data); };
  const fetchApplications = async () => { const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false }); if (data) setApplications(data); };
  const fetchDisputes = async () => { const { data } = await supabase.from('players').select('*').in('payment_status', ['pending_verification', 'disputed']).order('created_at', { ascending: false }); if (data) setDisputedPlayers(data); };
  const fetchVisitorLogs = async () => { const { data } = await supabase.from('site_visits').select('*').order('created_at', { ascending: false }).limit(100); if (data) setVisitorLogs(data); };
  const fetchInquiries = async () => { const { data } = await supabase.from('inquiries').select('*, players(name)').order('created_at', { ascending: false }); if (data) setInquiries(data); };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/admin/login');
      else { 
        setAdminEmail(user.email || 'Admin');
        setLoading(false); 
        fetchPlayers(); fetchApplications(); fetchVisitorLogs(); fetchDisputes(); fetchInquiries();
        const { data: settingsData } = await supabase.from('site_settings').select('*').single();
        if (settingsData) {
          setSiteSettings(settingsData);
          setMaintenanceMode(settingsData.is_maintenance_mode || false);
        }
      }
    };
    checkUser();
  }, []);

  const openPlayerModal = (player: Player | null = null) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({ 
        name: player.name, club: player.club, position: player.position, age: String(player.age), 
        nationality: player.nationality, contract_expiry: player.contract_expiry, 
        market_value: String(player.market_value), sponsor_owed: String(player.sponsor_owed || 0), 
        payment_status: player.payment_status || 'pending', payment_method: player.payment_method || 'crypto',
        bio: player.bio || '', career_stats: player.career_stats || '', 
        transfer_history: player.transfer_history || '', contract_url: player.contract_url || '',
        tags: player.tags || '', rarity: player.rarity || 'Common',
        stats_goals: String(player.stats_goals || 0), stats_assists: String(player.stats_assists || 0),
        stats_appearances: String(player.stats_appearances || 0),
        custom_btc: player.custom_wallets?.btc || '', custom_eth: player.custom_wallets?.eth || '', custom_usdt: player.custom_wallets?.usdt || ''
      });
    } else {
      setEditingPlayer(null);
      setFormData({ name: '', club: '', position: '', age: '', nationality: '', contract_expiry: '', market_value: '', sponsor_owed: '', payment_status: 'pending', payment_method: 'crypto', bio: '', career_stats: '', transfer_history: '', contract_url: '', tags: '', rarity: 'Common', stats_goals: '0', stats_assists: '0', stats_appearances: '0', custom_btc: '', custom_eth: '', custom_usdt: '' });
    }
    setFile(null); setContractFile(null);
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault(); setUploading(true);
    let imageUrl = editingPlayer?.image_url || ''; let contractUrl = formData.contract_url;
    if (file) { const fileExt = file.name.split('.').pop(); const fileName = `${Date.now()}.${fileExt}`; const { data, error } = await supabase.storage.from('player-images').upload(fileName, file); if (!error) { const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path); imageUrl = publicData.publicUrl; } }
    if (contractFile) { const fileExt = contractFile.name.split('.').pop(); const fileName = `contract-${Date.now()}.${fileExt}`; const { data, error } = await supabase.storage.from('player-images').upload(fileName, contractFile); if (!error) { const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path); contractUrl = publicData.publicUrl; } }
    const { custom_btc, custom_eth, custom_usdt, ...restFormData } = formData;
    const playerData = { ...restFormData, age: Number(restFormData.age), market_value: Number(restFormData.market_value), sponsor_owed: Number(restFormData.sponsor_owed), image_url: imageUrl, contract_url: contractUrl, stats_goals: Number(restFormData.stats_goals), stats_assists: Number(restFormData.stats_assists), stats_appearances: Number(restFormData.stats_appearances), custom_wallets: { btc: custom_btc, eth: custom_eth, usdt: custom_usdt } };
    if (editingPlayer) { const { error } = await supabase.from('players').update(playerData).eq('id', editingPlayer.id); if (error) { alert('Error updating player: ' + error.message); setUploading(false); return; } } 
    else { const { error } = await supabase.from('players').insert([playerData]); if (error) { alert('Error adding player: ' + error.message); setUploading(false); return; } }
    setIsPlayerModalOpen(false); fetchPlayers(); setUploading(false);
  };

  const handleDeletePlayer = async (id: string, name: string) => { if (window.confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`)) { await supabase.from('players').delete().eq('id', id); fetchPlayers(); } };
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };
  const filteredPlayers = players.filter(p => { const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.club.toLowerCase().includes(searchQuery.toLowerCase()); const matchesStatus = filterStatus === 'all' || p.payment_status === filterStatus; return matchesSearch && matchesStatus; });
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  const totalValue = players.reduce((acc, curr) => acc + (curr.market_value || 0), 0);
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const getDeviceType = (ua: string) => { if (ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android')) return 'Mobile'; if (ua.includes('Tablet') || ua.includes('iPad')) return 'Tablet'; return 'Desktop'; };

  const handleSaveSettings = async () => {
    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
    const getNum = (id: string) => Number((document.getElementById(id) as HTMLInputElement)?.value) || 0;

    const payload = {
      agency_name: getVal('set_agency_name'),
      agency_logo_url: getVal('set_agency_logo'),
      contact_email: getVal('set_contact_email'),
      contact_phone: getVal('set_contact_phone'),
      contact_address: getVal('set_contact_address'),
      social_instagram: getVal('set_social_ig'),
      social_twitter: getVal('set_social_tw'),
      social_linkedin: getVal('set_social_li'),
      wallet_btc: getVal('set_btc'), wallet_eth: getVal('set_eth'), wallet_usdt: getVal('set_usdt'),
      default_currency: getVal('set_currency'),
      min_sponsorship_quota: getNum('set_min_quota'),
      hero_headline: getVal('set_hero_headline'),
      hero_subtext: getVal('set_hero_subtext'),
      agency_bio: getVal('set_agency_bio'),
      is_maintenance_mode: maintenanceMode,
      maintenance_message: getVal('set_maintenance_msg'),
      support_email: getVal('set_support_email')
    };

    if (siteSettings?.id) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', siteSettings.id);
      if (error) { alert('Error saving settings: ' + error.message); }
      else { alert('Settings saved successfully!'); window.location.reload(); }
    } else {
      const { error } = await supabase.from('site_settings').insert([payload]);
      if (error) { alert('Error saving settings: ' + error.message); }
      else { alert('Settings saved successfully!'); window.location.reload(); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tighter"><span className="text-amber-500">11</span>WINS <span className="text-gray-400 font-normal text-sm ml-2">Admin Portal</span></h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Welcome, {adminEmail}
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-amber-100 rounded-lg"><Users className="text-amber-600" size={24} /></div><div><p className="text-sm text-gray-500">Total Players</p><p className="text-2xl font-bold">{players.length}</p></div></div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-lg"><TrendingUp className="text-blue-600" size={24} /></div><div><p className="text-sm text-gray-500">Total Market Value</p><p className="text-2xl font-bold">€{(totalValue / 1000000).toFixed(1)}M</p></div></div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-emerald-100 rounded-lg"><FileText className="text-emerald-600" size={24} /></div><div><p className="text-sm text-gray-500">Pending Applications</p><p className="text-2xl font-bold">{pendingApps}</p></div></div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveTab('players')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'players' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Player Roster {activeTab === 'players' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
          <button onClick={() => setActiveTab('applications')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'applications' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Scouting Applications {activeTab === 'applications' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
          <button onClick={() => setActiveTab('inquiries')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'inquiries' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Inquiries {newInquiries > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{newInquiries}</span>}{activeTab === 'inquiries' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
          <button onClick={() => setActiveTab('visitors')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'visitors' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Visitor Logs (Temp) {activeTab === 'visitors' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
          <button onClick={() => setActiveTab('disputes')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'disputes' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Disputes & Verifications {activeTab === 'disputes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
          <button onClick={() => setActiveTab('settings')} className={`pb-3 px-1 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'settings' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Settings {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>}</button>
        </div>

        {/* PLAYERS TAB */}
        {activeTab === 'players' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Search players by name or club..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" /></div>
              <div className="flex gap-3 w-full md:w-auto">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"><option value="all">All Statuses</option><option value="pending">Pending</option><option value="pending_verification">Needs Verification</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select>
                <button onClick={() => openPlayerModal()} className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors flex items-center gap-2 whitespace-nowrap"><Plus size={16} /> Add Player</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th className="p-4 font-medium">Player</th><th className="p-4 font-medium">Age</th><th className="p-4 font-medium">Position</th><th className="p-4 font-medium text-right">Value</th><th className="p-4 font-medium text-center">Payment Status</th><th className="p-4 font-medium text-center">Transfer</th><th className="p-4 font-medium">Badges</th><th className="p-4 font-medium text-center">Featured</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold flex items-center gap-3">{player.image_url ? <img src={player.image_url} className="w-8 h-8 rounded-full object-cover border" /> : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{player.name.charAt(0)}</div>}{player.name}</td>
                      <td className="p-4 text-gray-600">U{player.age}</td>
                      <td className="p-4 text-gray-600">{player.position}</td>
                      <td className="p-4 text-right font-medium">€{(player.market_value / 1000000).toFixed(1)}M</td>
                      <td className="p-4 text-center"><select value={player.payment_status || 'pending'} onChange={async (e) => { await supabase.from('players').update({ payment_status: e.target.value }).eq('id', player.id); fetchPlayers(); fetchDisputes(); }} className={`p-1.5 rounded-full text-xs font-bold border-0 focus:ring-2 focus:ring-amber-500 cursor-pointer ${player.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : player.payment_status === 'pending_verification' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}><option value="pending">Pending</option><option value="pending_verification">Verifying</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="rejected">Rejected</option><option value="disputed">Disputed</option></select></td>
                      <td className="p-4 text-center"><select value={player.transfer_status || 'open'} onChange={async (e) => { await supabase.from('players').update({ transfer_status: e.target.value }).eq('id', player.id); fetchPlayers(); }} className={`p-1.5 rounded-full text-xs font-bold border-0 focus:ring-2 focus:ring-amber-500 cursor-pointer ${player.transfer_status === 'open' ? 'bg-emerald-100 text-emerald-700' : player.transfer_status === 'in_discussions' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}><option value="open">Open</option><option value="in_discussions">In Discussions</option><option value="exclusive">Exclusive</option></select></td>
                      <td className="p-4"><div className="flex flex-wrap gap-1">{player.tags?.split(',').filter(t => t.trim()).map((tag, i) => (<span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">{tag.trim()}</span>))}</div></td>
                      <td className="p-4 text-center"><button onClick={async () => { await supabase.from('players').update({ is_featured: !player.is_featured }).eq('id', player.id); fetchPlayers(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={player.is_featured ? "Remove from Featured" : "Add to Featured"}><Star size={18} className={player.is_featured ? "text-amber-400 fill-amber-400" : "text-gray-300"} /></button></td>
                      <td className="p-4 text-right flex justify-end gap-2">{player.payment_status === 'pending_verification' && player.payment_proof_url && (<button onClick={() => setViewingProof(player)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="View Payment Proof"><Eye size={16} /></button>)}<button onClick={() => openPlayerModal(player)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 size={16} /></button><button onClick={() => handleDeletePlayer(player.id, player.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="p-4 border-b border-gray-200 bg-gray-50"><h2 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={18} className="text-amber-500"/> Incoming Requests</h2></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th className="p-4 font-medium">Applicant</th><th className="p-4 font-medium">Age / Group</th><th className="p-4 font-medium">Position</th><th className="p-4 font-medium text-center">Status</th><th className="p-4 font-medium text-right">Actions</th></tr></thead><tbody className="text-sm divide-y divide-gray-100">{applications.filter(app => app.status === 'pending').map((app) => (<tr key={app.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 font-semibold flex items-center gap-3">{app.image_url ? <img src={app.image_url} className="w-8 h-8 rounded-full object-cover border" /> : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{app.full_name.charAt(0)}</div>}{app.full_name}</td><td className="p-4 text-gray-600">{app.age} ({app.age_group})</td><td className="p-4 text-gray-600">{app.position}</td><td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'reviewed' ? 'bg-emerald-100 text-emerald-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{app.status}</span></td><td className="p-4 text-right"><button onClick={() => setViewingApp(app)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Eye size={16} /></button></td></tr>))}</tbody></table></div></div>)}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Inbox size={18} className="text-amber-500"/> Club Inquiries & Development Contributions</h2>
              <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">{newInquiries} New</span>
            </div>
            {inquiries.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="font-medium">No inquiries yet. Club interest and development contributions will appear here instantly.</p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inquiries.map((inq: any) => (
                  <div key={inq.id} className={`border rounded-xl overflow-hidden shadow-sm ${inq.type === 'club' ? 'border-blue-200 bg-blue-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
                    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inq.type === 'club' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{inq.type === 'club' ? 'Club Inquiry' : 'Development Fund'}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{inq.players?.name || 'Unknown Player'}</h3>
                          <p className="text-xs text-gray-500">{new Date(inq.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <select value={inq.status} onChange={async (e) => { await supabase.from('inquiries').update({ status: e.target.value }).eq('id', inq.id); fetchInquiries(); }} className={`p-1.5 rounded-full text-xs font-bold border-0 focus:ring-2 focus:ring-amber-500 cursor-pointer ${inq.status === 'new' ? 'bg-amber-100 text-amber-700' : inq.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : inq.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="verified">Verified</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      {inq.type === 'club' ? (
                        <>
                          <p><span className="font-bold text-gray-700">Club:</span> {inq.organization || '—'} {inq.federation_license && <span className="text-xs text-gray-500">({inq.federation_license})</span>}</p>
                          <p><span className="font-bold text-gray-700">Contact:</span> {inq.contact_name} • {inq.contact_email}{inq.contact_phone ? ` • ${inq.contact_phone}` : ''}</p>
                          {inq.message && <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 text-xs">{inq.message}</p>}
                        </>
                      ) : (
                        <>
                          <p><span className="font-bold text-gray-700">Amount:</span> €{Number(inq.amount_eur || 0).toLocaleString()} via {(inq.payment_method || 'crypto').toUpperCase()}</p>
                          <p><span className="font-bold text-gray-700">Hash:</span> <span className="font-mono text-xs">{inq.transaction_hash || '—'}</span></p>
                          <p><span className="font-bold text-gray-700">Receipt:</span> {inq.contact_email || 'Anonymous'}</p>
                          {inq.payment_proof_url && <a href={inq.payment_proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">View Proof</a>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISITOR LOGS TAB */}
        {activeTab === 'visitors' && (<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h2 className="font-bold text-gray-900 flex items-center gap-2"><Activity size={18} className="text-amber-500"/> Temporary Visitor Tracking</h2><span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">Last 100 Visits</span></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th className="p-4 font-medium">Time</th><th className="p-4 font-medium">IP Address</th><th className="p-4 font-medium">Device Type</th><th className="p-4 font-medium">Page Visited</th></tr></thead><tbody className="text-sm divide-y divide-gray-100">{visitorLogs.map((log) => (<tr key={log.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 text-gray-600 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td><td className="p-4 font-mono text-xs text-gray-700">{log.ip_address}</td><td className="p-4"><div className="flex items-center gap-2">{getDeviceType(log.user_agent) === 'Mobile' ? <Smartphone size={14} className="text-gray-400"/> : <Monitor size={14} className="text-gray-400"/>}<span className="text-gray-700">{getDeviceType(log.user_agent)}</span></div></td><td className="p-4 text-gray-600 font-medium">{log.visited_path}</td></tr>))}{visitorLogs.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-500">No visitor logs recorded yet. Visit the public site to generate logs.</td></tr>)}</tbody></table></div></div>)}

        {/* DISPUTES TAB */}
        {activeTab === 'disputes' && (<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h2 className="font-bold text-gray-900 flex items-center gap-2"><AlertCircle size={18} className="text-amber-500"/> Dispute Resolution & Payment Verification</h2><span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">{disputedPlayers.length} Pending</span></div>{disputedPlayers.length === 0 ? (<div className="p-12 text-center text-gray-500"><CheckCircle size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" /><p className="font-medium">All caught up! No pending verifications or disputes.</p></div>) : (<div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">{disputedPlayers.map((player) => (<div key={player.id} className={`border rounded-xl overflow-hidden shadow-sm flex flex-col ${player.payment_status === 'disputed' ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}><div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center"><div className="flex items-center gap-3">{player.image_url ? (<img src={player.image_url} className="w-10 h-10 rounded-full object-cover border" />) : (<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border">{player.name.charAt(0)}</div>)}<div><h3 className="font-bold text-gray-900 text-sm">{player.name}</h3><p className="text-xs text-gray-500">Quota: €{player.sponsor_owed.toLocaleString()}</p></div></div><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${player.payment_status === 'disputed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{player.payment_status === 'disputed' ? 'Disputed' : 'Needs Verification'}</span></div><div className="p-4 grid grid-cols-2 gap-4 flex-grow bg-gray-50/50"><div className="space-y-3"><div><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction Hash</p><div className="bg-white p-2 rounded border border-gray-200 text-[10px] font-mono text-gray-700 break-all h-16 overflow-y-auto">{player.transaction_hash || 'No hash provided'}</div></div><div><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Method</p><div className="bg-white p-2 rounded border border-gray-200 text-xs font-medium text-gray-900 capitalize">{player.payment_method || 'Unknown'}</div></div></div><div><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Uploaded Proof</p>{player.payment_proof_url ? (<a href={player.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block w-full h-32 bg-white rounded border border-gray-200 overflow-hidden hover:border-amber-500 transition-colors"><img src={player.payment_proof_url} className="w-full h-full object-contain" /></a>) : (<div className="w-full h-32 bg-gray-200 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>)}</div></div><div className="p-3 bg-white border-t border-gray-200 grid grid-cols-3 gap-2"><button onClick={async () => { if(window.confirm('Reject this payment and mark as Overdue?')) { await supabase.from('players').update({ payment_status: 'overdue' }).eq('id', player.id); fetchDisputes(); fetchPlayers(); } }} className="py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 border border-red-200">Reject</button>{player.payment_status !== 'disputed' && (<button onClick={async () => { await supabase.from('players').update({ payment_status: 'disputed' }).eq('id', player.id); fetchDisputes(); fetchPlayers(); }} className="py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded hover:bg-amber-100 border border-amber-200">Flag Dispute</button>)}<button onClick={async () => { await supabase.from('players').update({ payment_status: 'paid' }).eq('id', player.id); fetchDisputes(); fetchPlayers(); }} className="py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 flex items-center justify-center gap-1"><Check size={12} /> Approve</button></div></div>))}</div>)}</div>)}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">Global Site Settings</h2>
            <div className="space-y-10">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><Globe size={16} className="text-amber-500"/> Agency Branding & Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Agency Name</label><input id="set_agency_name" defaultValue={siteSettings?.agency_name || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Primary Contact Email</label><input id="set_contact_email" defaultValue={siteSettings?.contact_email || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Contact Phone Number</label><input id="set_contact_phone" defaultValue={siteSettings?.contact_phone || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">Official Agency Address</label><input id="set_contact_address" defaultValue={siteSettings?.contact_address || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">Agency Logo URL</label><input id="set_agency_logo" defaultValue={siteSettings?.agency_logo_url || ''} placeholder="https://..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Instagram URL</label><input id="set_social_ig" defaultValue={siteSettings?.social_instagram || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Twitter / X URL</label><input id="set_social_tw" defaultValue={siteSettings?.social_twitter || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /></div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><DollarSign size={16} className="text-amber-500"/> Financial & Payment Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Default Currency</label><select id="set_currency" defaultValue={siteSettings?.default_currency || 'EUR'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="EUR">EUR (€)</option><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option></select></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Min. Sponsorship Quota (€)</label><input id="set_min_quota" type="number" defaultValue={siteSettings?.min_sponsorship_quota || 500} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Support / Helpdesk Email</label><input id="set_support_email" defaultValue={siteSettings?.support_email || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                </div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Global Crypto Wallets (Fallback)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-1">Bitcoin (BTC)</label><input id="set_btc" defaultValue={siteSettings?.wallet_btc || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-1">Ethereum (ETH)</label><input id="set_eth" defaultValue={siteSettings?.wallet_eth || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-1">USDT (TRC-20)</label><input id="set_usdt" defaultValue={siteSettings?.wallet_usdt || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" /></div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><Type size={16} className="text-amber-500"/> Content & Homepage Control</h3>
                <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Hero Banner Headline</label><input id="set_hero_headline" defaultValue={siteSettings?.hero_headline || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Hero Banner Subtext</label><input id="set_hero_subtext" defaultValue={siteSettings?.hero_subtext || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">"About the Agency" Short Bio</label><textarea id="set_agency_bio" rows={3} defaultValue={siteSettings?.agency_bio || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><Headphones size={16} className="text-amber-500"/> Site Operations & Maintenance</h3>
                <div className={`mb-6 p-6 rounded-xl border-2 ${maintenanceMode ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${maintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                      <div>
                        <p className={`text-lg font-bold ${maintenanceMode ? 'text-red-800' : 'text-emerald-800'}`}>{maintenanceMode ? '⚠️ MAINTENANCE MODE ACTIVE' : '✅ SITE IS LIVE'}</p>
                        <p className={`text-sm mt-1 ${maintenanceMode ? 'text-red-600' : 'text-emerald-600'}`}>{maintenanceMode ? 'Public visitors are blocked and seeing the maintenance page.' : 'Public site is fully accessible to all visitors.'}</p>
                      </div>
                    </div>
                    <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 ${maintenanceMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                      <Power size={20} /> {maintenanceMode ? 'Turn OFF' : 'Turn ON'}
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Maintenance Message (Shown when mode is ON)</label>
                  <textarea id="set_maintenance_msg" rows={3} defaultValue={siteSettings?.maintenance_message || 'We are currently undergoing scheduled maintenance. Please check back soon.'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>

              <button onClick={handleSaveSettings} className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg">
                <Save size={20} /> Save All Global Settings
              </button>
            </div>
          </div>
        )}

        {/* ADD/EDIT PLAYER MODAL */}
        {isPlayerModalOpen && (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsPlayerModalOpen(false)}><div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="bg-gray-900 text-white p-6 flex justify-between items-center sticky top-0 z-10"><h3 className="text-lg font-bold">{editingPlayer ? 'Edit Player Profile' : 'Add New Player'}</h3><button onClick={() => setIsPlayerModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button></div><form onSubmit={handleSavePlayer} className="p-6 space-y-6"><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Basic Information</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input required placeholder="Player Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input required placeholder="Club" value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input required placeholder="Position" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input required type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input required placeholder="Nationality" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input required placeholder="Contract Expiry (e.g. 06.2026)" value={formData.contract_expiry} onChange={e => setFormData({...formData, contract_expiry: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Financials & Status</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><input required type="number" placeholder="Market Value (€)" value={formData.market_value} onChange={e => setFormData({...formData, market_value: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input type="number" placeholder="Sponsor Quota (€)" value={formData.sponsor_owed} onChange={e => setFormData({...formData, sponsor_owed: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><select value={formData.payment_status} onChange={e => setFormData({...formData, payment_status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="pending">Pending</option><option value="pending_verification">Verifying</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="rejected">Rejected</option></select></div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Player Badges & Traits</h4><div className="flex flex-wrap gap-2 mb-3">{AVAILABLE_TAGS.map(tag => (<button key={tag} type="button" onClick={() => { const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : []; if (currentTags.includes(tag)) setFormData({...formData, tags: currentTags.filter(t => t !== tag).join(', ')}); else setFormData({...formData, tags: [...currentTags, tag].join(', ')}); }} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.tags?.split(',').map(t => t.trim()).includes(tag) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'}`}>{tag}</button>))}</div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Media & Documents</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center"><label className="cursor-pointer flex flex-col items-center gap-2"><Upload size={24} className="text-gray-400" /><span className="text-sm font-medium text-gray-600">{file ? file.name : 'Upload Player Image'}</span><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden" /></label></div><div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center bg-blue-50/30"><label className="cursor-pointer flex flex-col items-center gap-2"><FileSignature size={24} className="text-blue-500" /><span className="text-sm font-medium text-gray-600">{contractFile ? contractFile.name : (formData.contract_url ? 'Contract Attached' : 'Upload Contract PDF')}</span><input type="file" accept="application/pdf" onChange={(e) => setContractFile(e.target.files ? e.target.files[0] : null)} className="hidden" /></label></div></div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Player Content</h4><div className="space-y-4"><textarea placeholder="Scouting Report / Bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input placeholder="Career Statistics" value={formData.career_stats} onChange={e => setFormData({...formData, career_stats: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input placeholder="Transfer History" value={formData.transfer_history} onChange={e => setFormData({...formData, transfer_history: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Rarity & Performance Stats</h4><div className="mb-4"><label className="block text-xs font-bold text-gray-700 mb-2">Card Rarity</label><div className="flex flex-wrap gap-2">{['Common', 'Rare', 'Epic', 'Legendary'].map(r => (<button key={r} type="button" onClick={() => setFormData({...formData, rarity: r})} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${formData.rarity === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'}`}>{r}</button>))}</div></div><div className="grid grid-cols-3 gap-3"><input type="number" placeholder="Goals" value={formData.stats_goals} onChange={e => setFormData({...formData, stats_goals: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input type="number" placeholder="Assists" value={formData.stats_assists} onChange={e => setFormData({...formData, stats_assists: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /><input type="number" placeholder="Appearances" value={formData.stats_appearances} onChange={e => setFormData({...formData, stats_appearances: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" /></div></div><div><h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">Custom Crypto Wallets (Optional)</h4><p className="text-xs text-gray-500 mb-3">Leave blank to use the global default wallets.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><input placeholder="Custom BTC Address" value={formData.custom_btc} onChange={e => setFormData({...formData, custom_btc: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /><input placeholder="Custom ETH Address" value={formData.custom_eth} onChange={e => setFormData({...formData, custom_eth: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /><input placeholder="Custom USDT Address" value={formData.custom_usdt} onChange={e => setFormData({...formData, custom_usdt: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" /></div></div><button type="submit" disabled={uploading} className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{uploading ? 'Saving...' : <><Save size={16} /> {editingPlayer ? 'Update Player' : 'Add Player'}</>}</button></form></div></div>)}

        {/* PAYMENT PROOF MODAL */}
        {viewingProof && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingProof(null)}><div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}><div className="bg-blue-600 text-white p-6 flex justify-between items-center"><h3 className="text-lg font-bold flex items-center gap-2"><AlertCircle size={20} /> Verify Payment: {viewingProof.name}</h3><button onClick={() => setViewingProof(null)} className="text-blue-200 hover:text-white"><X size={24} /></button></div><div className="p-6"><div className="mb-6"><p className="text-sm font-bold text-gray-500 uppercase mb-2">Transaction Hash</p><div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all text-gray-800 border border-gray-200">{viewingProof.transaction_hash || 'No hash provided'}</div></div><div><p className="text-sm font-bold text-gray-500 uppercase mb-2">Uploaded Proof</p>{viewingProof.payment_proof_url ? (<div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]"><img src={viewingProof.payment_proof_url} alt="Payment Proof" className="max-w-full max-h-[500px] object-contain" /></div>) : (<div className="bg-gray-100 p-8 text-center text-gray-500 rounded-lg">No proof image uploaded.</div>)}</div></div><div className="p-6 bg-gray-50 border-t flex justify-end gap-3"><button onClick={async () => { await supabase.from('players').update({ payment_status: 'rejected' }).eq('id', viewingProof.id); fetchPlayers(); setViewingProof(null); }} className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 border border-red-200">Reject Payment</button><button onClick={async () => { await supabase.from('players').update({ payment_status: 'paid' }).eq('id', viewingProof.id); fetchPlayers(); setViewingProof(null); }} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2"><Check size={16} /> Confirm & Mark as Paid</button></div></div></div>)}

        {/* VIEW APPLICATION MODAL */}
        {viewingApp && (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingApp(null)}><div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-start sticky top-0 z-10"><div className="flex items-start gap-4"><div className="w-20 h-20 bg-white rounded-xl overflow-hidden border-4 border-amber-500 flex-shrink-0">{viewingApp.image_url ? <img src={viewingApp.image_url} alt={viewingApp.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-700">{viewingApp.full_name.charAt(0)}</div>}</div><div><h3 className="text-2xl font-bold mb-1">{viewingApp.full_name}</h3><p className="text-gray-300 text-sm">Application ID: {viewingApp.id.slice(0, 8)}...</p><div className="flex items-center gap-2 mt-2"><span className={`px-3 py-1 rounded-full text-xs font-bold ${viewingApp.status === 'reviewed' ? 'bg-emerald-500' : viewingApp.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`}>{viewingApp.status.toUpperCase()}</span><span className="text-xs text-gray-400">Submitted: {new Date(viewingApp.created_at).toLocaleDateString()}</span></div></div></div><button onClick={() => setViewingApp(null)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button></div><div className="p-8"><div className="mb-8"><h4 className="text-sm font-bold text-gray-500 uppercase mb-4 border-b pb-2 flex items-center gap-2"><Users size={16} className="text-amber-500" /> Personal Information</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Age / Age Group</p><p className="font-bold text-gray-900">{viewingApp.age} years ({viewingApp.age_group})</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Position</p><p className="font-bold text-gray-900">{viewingApp.position}</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Nationality</p><p className="font-bold text-gray-900">{viewingApp.nationality || 'Not specified'}</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Current Club</p><p className="font-bold text-gray-900">{viewingApp.current_club || 'Unattached / Free Agent'}</p></div></div></div>{viewingApp.parent_contact && (<div className="mb-8"><h4 className="text-sm font-bold text-gray-500 uppercase mb-4 border-b pb-2 flex items-center gap-2"><Phone size={16} className="text-amber-500" /> Contact Information</h4><div className="bg-amber-50 border border-amber-200 p-4 rounded-lg"><p className="text-xs text-amber-800 uppercase mb-1">Parent/Guardian Contact (Minor Applicant)</p><p className="font-bold text-gray-900 text-lg">{viewingApp.parent_contact}</p></div></div>)}{viewingApp.highlight_video_url && (<div className="mb-8"><h4 className="text-sm font-bold text-gray-500 uppercase mb-4 border-b pb-2 flex items-center gap-2"><Video size={16} className="text-amber-500" /> Highlight Video</h4><a href={viewingApp.highlight_video_url} target="_blank" rel="noopener noreferrer" className="block bg-red-50 border border-red-200 p-4 rounded-lg hover:bg-red-100 transition-colors group"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Video size={24} className="text-white" /></div><div><p className="font-bold text-gray-900">Watch Highlight Reel</p><p className="text-sm text-gray-600">Click to view in new tab</p></div></div></a></div>)}</div><div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4"><button onClick={async () => { if (window.confirm(`Are you sure you want to PERMANENTLY DELETE ${viewingApp.full_name}'s application? This action cannot be undone (GDPR Compliance).`)) { const { error } = await supabase.from('applications').delete().eq('id', viewingApp.id); if (error) alert('Error deleting: ' + error.message); else { fetchApplications(); setViewingApp(null); alert('Application permanently deleted.'); } } }} className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"><Trash2 size={16} /> Delete (GDPR)</button><div className="flex gap-3 w-full sm:w-auto"><button onClick={async () => { const { error } = await supabase.from('applications').update({ status: 'rejected' }).eq('id', viewingApp.id); if (error) alert('Error rejecting: ' + error.message); else { fetchApplications(); setViewingApp(null); alert(`${viewingApp.full_name}'s application has been rejected.`); } }} className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-2"><X size={16} /> Reject</button><button onClick={async () => { const { error: insertError } = await supabase.from('players').insert([{ name: viewingApp.full_name, age: viewingApp.age, position: viewingApp.position, nationality: viewingApp.nationality || 'Unknown', club: viewingApp.current_club || 'Unattached', image_url: viewingApp.image_url || '', payment_status: 'pending', market_value: 0, sponsor_owed: 0, contract_expiry: 'TBD', bio: `Scouted via application. Age Group: ${viewingApp.age_group}.` }]); if (insertError) { alert('Error adding to roster: ' + insertError.message); return; } const { error: updateError } = await supabase.from('applications').update({ status: 'reviewed' }).eq('id', viewingApp.id); if (updateError) { alert('Error updating status: ' + updateError.message); return; } fetchPlayers(); fetchApplications(); setViewingApp(null); alert(`✅ ${viewingApp.full_name} has been successfully added to the Roster!`); }} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/30"><Check size={18} /> Approve & Add to Roster</button></div></div></div></div>)}
      </main>
    </div>
  );
}