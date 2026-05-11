"use client";

import React, { useState, useEffect } from 'react';
import { Box, Plus, History, Building2, Package, Search, ArrowRightLeft, Edit, Trash2, CheckCircle2, XCircle, AlertTriangle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AdminInventoryPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    branch_id: '',
    item_name: 'BOOK',
    quantity: 0,
    type: 'CREDIT',
    notes: ''
  });

  const [editData, setEditData] = useState({
    id: '',
    branch_id: '',
    item_name: '',
    quantity: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        { data: branchesData },
        { data: invData },
        { data: logsData }
      ] = await Promise.all([
        supabase.from('branches').select('*').order('name'),
        supabase.from('inventory').select('*, branches(name)'),
        supabase.from('inventory_logs').select('*, branches(name)').order('created_at', { ascending: false }).limit(20)
      ]);

      setBranches(branchesData || []);
      setInventory(invData || []);
      setLogs(logsData || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch_id || formData.quantity <= 0) return;

    try {
      // 1. Log the transaction
      const { error: logError } = await supabase.from('inventory_logs').insert([{
        branch_id: formData.branch_id,
        item_name: formData.item_name,
        quantity: formData.quantity,
        type: formData.type,
        notes: formData.notes
      }]);

      if (logError) throw logError;

      // 2. Update current stock
      const { data: current } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('branch_id', formData.branch_id)
        .eq('item_name', formData.item_name)
        .maybeSingle();

      const newQty = formData.type === 'CREDIT' 
        ? (current?.quantity || 0) + formData.quantity 
        : (current?.quantity || 0) - formData.quantity;

      const { error: upsertError } = await supabase.from('inventory').upsert({
        branch_id: formData.branch_id,
        item_name: formData.item_name,
        quantity: Math.max(0, newQty),
        updated_at: new Date().toISOString()
      });

      if (upsertError) throw upsertError;

      setIsModalOpen(false);
      setFormData({ branch_id: '', item_name: 'BOOK', quantity: 0, type: 'CREDIT', notes: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: editData.quantity, updated_at: new Date().toISOString() })
        .eq('branch_id', editData.branch_id)
        .eq('item_name', editData.item_name);

      if (error) throw error;
      
      // Also log this manual adjustment
      await supabase.from('inventory_logs').insert([{
        branch_id: editData.branch_id,
        item_name: editData.item_name,
        quantity: editData.quantity,
        type: 'ADJUSTMENT',
        notes: 'Manual manual adjustment by Admin'
      }]);

      setIsEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('क्या आप वाकई इस ट्रांजेक्शन को हटाना चाहते हैं? इससे स्टॉक पर असर नहीं पड़ेगा, सिर्फ लॉग हटेगा।')) return;
    
    try {
      const { error } = await supabase.from('inventory_logs').delete().eq('id', logId);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">स्टॉक मैनेजमेंट</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">बुकलेट एवं पेन वितरण नियंत्रण</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="saffron-btn px-8 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest"
        >
          <Plus size={18} /> स्टॉक डिस्पैच करें
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {inventory.reduce((acc: any[], curr) => {
            const existing = acc.find(a => a.item === curr.item_name);
            if (existing) existing.total += curr.quantity;
            else acc.push({ item: curr.item_name, total: curr.quantity });
            return acc;
         }, []).map((stat) => (
            <div key={stat.item} className="premium-card p-8 bg-gradient-to-br from-saffron/10 to-transparent border-saffron/20">
               <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">कुल {stat.item === 'BOOK' ? 'बुकलेट' : 'पेन'}</p>
                     <p className="text-4xl font-black text-white">{stat.total.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-saffron/20 rounded-xl flex items-center justify-center text-saffron">
                     <Package size={24} />
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Current Stock Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Building2 size={24} />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest">शाखा वार स्टॉक (Branch-wise Stock)</h3>
        </div>

        <div className="premium-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">शाखा का नाम</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">आइटम</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">स्टॉक मात्रा</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">अंतिम अपडेट</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.length === 0 ? (
                 <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई स्टॉक डेटा नहीं</td></tr>
              ) : inventory.map((inv) => (
                <tr key={`${inv.branch_id}-${inv.item_name}`} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white uppercase tracking-wide">{(inv.branches as any)?.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-white/60">
                      {inv.item_name === 'BOOK' ? 'बुकलेट' : 'पेन'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <p className={`text-lg font-black ${inv.quantity < 50 ? 'text-red-500' : 'text-white'}`}>
                        {inv.quantity.toLocaleString()}
                      </p>
                      {inv.quantity < 50 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] text-white/40 font-bold uppercase">
                      {new Date(inv.updated_at).toLocaleDateString('hi-IN')}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => {
                        setEditData({ branch_id: inv.branch_id, item_name: inv.item_name, quantity: inv.quantity, id: inv.id });
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-white/20 hover:text-saffron transition-all"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-saffron/10 rounded-xl text-saffron">
            <History size={24} />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest">हालिया ट्रांजेक्शन (Recent Logs)</h3>
        </div>

        <div className="premium-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">तारीख</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">शाखा</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">प्रकार</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">मात्रा</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">हटाएं</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6 text-[10px] text-white/40 font-bold">
                    {new Date(log.created_at).toLocaleString('hi-IN')}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white uppercase">{(log.branches as any)?.name}</p>
                    <p className="text-[10px] text-white/20">{log.notes || 'No notes'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${log.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : log.type === 'DEBIT' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {log.type === 'CREDIT' ? 'डिस्पैच (+)' : log.type === 'DEBIT' ? 'वापसी (-)' : 'समायोजन (ADJ)'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-white">{log.quantity} {log.item_name === 'BOOK' ? 'बुक्स' : 'पेन'}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-2 text-white/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 space-y-8"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest gold-text">स्टॉक डिस्पैच फॉर्म</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">शाखा को सामग्री भेजें</p>
              </div>

              <form onSubmit={handleDispatch} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">शाखा चुनें</label>
                    <select 
                      required
                      value={formData.branch_id}
                      onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-xs font-bold"
                    >
                      <option value="">शाखा चुनें</option>
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">आइटम चुनें</label>
                    <select 
                      value={formData.item_name}
                      onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-xs font-bold"
                    >
                      <option value="BOOK">बुकलेट</option>
                      <option value="PEN">पेन</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">मात्रा (Quantity)</label>
                    <input 
                      required
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">ट्रांजेक्शन टाइप</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-xs font-bold"
                    >
                      <option value="CREDIT">डिस्पैच (Add to Branch)</option>
                      <option value="DEBIT">वापसी (Subtract from Branch)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">टिप्पणी (Optional)</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="कोई विशेष जानकारी..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-xs font-bold h-24 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full saffron-btn py-5 text-xs font-black uppercase tracking-[0.3em] shadow-xl"
                >
                  स्टॉक अपडेट करें
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 space-y-8"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest gold-text">स्टॉक एडिट करें</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">सीधे मात्रा बदलें</p>
              </div>

              <form onSubmit={handleUpdateStock} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">नई मात्रा (New Quantity)</label>
                  <input 
                    required
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value) || 0})}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-2xl font-black text-center"
                  />
                </div>

                <div className="flex gap-4">
                   <button 
                     type="button" 
                     onClick={() => setIsEditModalOpen(false)}
                     className="flex-1 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40"
                   >
                     रद्द करें
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 bg-saffron text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                   >
                     <Save size={16} /> सुरक्षित करें
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
