"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import { getBranches } from '@/services/dataService';
import { supabase } from '@/lib/supabase';

export default function AdminBranches() {
  const [branches, setBranches] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    phone: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setIsLoading(true);
    const data = await getBranches();
    setBranches(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error } = editingBranch 
      ? await supabase.from('branches').update(formData).eq('id', editingBranch.id).select()
      : await supabase.from('branches').insert([formData]).select();

    setIsLoading(false);

    if (error) {
      setStatusMsg({ type: 'error', msg: 'त्रुटि: ' + error.message });
    } else {
      setStatusMsg({ type: 'success', msg: editingBranch ? 'शाखा अपडेट हो गई!' : 'नई शाखा जुड़ गई!' });
      setIsModalOpen(false);
      setEditingBranch(null);
      setFormData({ name: '', code: '', city: '', address: '', phone: '', status: 'ACTIVE' });
      loadBranches();
    }

    setTimeout(() => setStatusMsg({ type: '', msg: '' }), 3000);
  };

  const deleteBranch = async (id: string) => {
    if (!confirm('क्या आप वाकई इस शाखा को हटाना चाहते हैं?')) return;
    
    const { error } = await supabase.from('branches').delete().eq('id', id);
    if (error) {
      alert('हटाने में त्रुटि: ' + error.message);
    } else {
      loadBranches();
    }
  };

  const openEditModal = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      status: branch.status
    });
    setIsModalOpen(true);
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black font-serif uppercase gold-text text-white">शाखा प्रबंधन (Branch Master)</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">सभी सक्रिय और प्रस्तावित शाखाओं का नियंत्रण</p>
        </div>
        <button 
          onClick={() => { setEditingBranch(null); setFormData({ name: '', code: '', city: '', address: '', phone: '', status: 'ACTIVE' }); setIsModalOpen(true); }}
          className="saffron-btn px-8 py-4 flex items-center gap-3 text-xs"
        >
          <Plus size={18} /> नई शाखा जोड़ें
        </button>
      </div>

      {/* Status Message */}
      {statusMsg.msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${statusMsg.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-400/10 text-green-400 border border-green-400/20'}`}>
          {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {statusMsg.msg}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-all" size={20} />
        <input 
          type="text" 
          placeholder="शाखा का नाम या कोड खोजें..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 transition-all text-xs text-white font-bold"
        />
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-white/20 uppercase font-black tracking-widest text-xs">डेटा लोड हो रहा है...</div>
        ) : filteredBranches.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20 uppercase font-black tracking-widest text-xs">कोई शाखा नहीं मिली।</div>
        ) : filteredBranches.map((branch) => (
          <div key={branch.id} className="premium-card p-8 group flex items-start justify-between hover:border-saffron/30 transition-all">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-black transition-all">
                <Building2 size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white uppercase">{branch.name}</h3>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${branch.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                    {branch.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <p className="flex items-center gap-2"><MapPin size={12} /> {branch.city} (कोड: {branch.code})</p>
                  <p className="flex items-center gap-2"><Phone size={12} /> {branch.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(branch)}
                className="p-3 bg-white/5 hover:bg-saffron hover:text-black rounded-xl text-white/40 transition-all"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => deleteBranch(branch.id)}
                className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl text-white/40 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden animate-zoom-in">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-serif uppercase gold-text">
                  {editingBranch ? 'शाखा विवरण बदलें' : 'नई शाखा जोड़ें'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">शाखा का नाम</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">शाखा कोड (Branch Code)</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-mono uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">शहर / जिला (City)</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">फोन नंबर</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">पूरा पता</label>
                  <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm resize-none"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">स्टेटस</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm appearance-none">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PROPOSED">PROPOSED</option>
                  </select>
                </div>
                <div className="md:col-span-2 pt-6 flex gap-4">
                  <button type="submit" disabled={isLoading} className="flex-1 saffron-btn py-5 flex items-center justify-center gap-3">
                    <Save size={20} /> {editingBranch ? 'अपडेट करें' : 'शाखा जोड़ें'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
