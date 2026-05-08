"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Box, Plus, Minus, History, Search, AlertTriangle, CheckCircle2, Building2, MessageSquare, Send, Clock, Loader2 } from 'lucide-react';
import { getBranches, createStockRequest, getStockRequests } from '@/services/dataService';
import { motion, AnimatePresence } from 'framer-motion';

export default function InventoryManagement() {
  const [userRole, setUserRole] = useState<'ADMIN' | 'BRANCH_MANAGER'>('ADMIN');
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [inventory, setInventory] = useState<any[]>([
    { item_name: 'BOOK', quantity: 1250 },
    { item_name: 'PEN', quantity: 3400 }
  ]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Request Form State
  const [requestData, setRequestData] = useState({
    item_type: 'BOOKLET',
    quantity: 0,
    remark: ''
  });

  useEffect(() => {
    loadInitialData();
  }, [userRole]);

  const loadInitialData = async () => {
    setIsLoading(true);
    const [branchData, requestData] = await Promise.all([
      getBranches(),
      getStockRequests()
    ]);
    setBranches(branchData);
    setRequests(requestData);
    if (branchData.length > 0) setSelectedBranch(branchData[0].id);
    setIsLoading(false);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createStockRequest({
      branch_id: selectedBranch || branches[0]?.id,
      item_type: requestData.item_type,
      quantity: requestData.quantity,
      remark: requestData.remark,
      status: 'PENDING'
    });
    if (res.success) {
      setIsRequestModalOpen(false);
      loadInitialData();
      setRequestData({ item_type: 'BOOKLET', quantity: 0, remark: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <div className="flex justify-end gap-4">
           <button onClick={() => setUserRole(userRole === 'ADMIN' ? 'BRANCH_MANAGER' : 'ADMIN')} className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-saffron">
             Switch to {userRole === 'ADMIN' ? 'Branch Manager' : 'Admin'} View
           </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black font-serif uppercase gold-text text-white">इन्वेंटरी और स्टॉक</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black">{userRole === 'ADMIN' ? 'वैश्विक स्टॉक नियंत्रण' : 'मेरी शाखा का स्टॉक'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {userRole === 'BRANCH_MANAGER' && (
              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="saffron-btn flex items-center gap-3 scale-110"
              >
                <Send size={18} /> स्टॉक की मांग करें (Request)
              </button>
            )}
            {userRole === 'ADMIN' && branches.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
                <Building2 className="text-saffron" size={20} />
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest"
                >
                  {branches.map(b => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {inventory.map((inv, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               key={inv.item_name} className="premium-card p-10 relative overflow-hidden group border-t-4 border-saffron"
             >
                <div className="flex justify-between items-end">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-saffron/60 uppercase text-[10px] font-black tracking-widest">
                         <Box size={16} /> वर्तमान {inv.item_name === 'BOOK' ? 'बुकलेट' : 'पेन'} स्टॉक
                      </div>
                      <h4 className="text-6xl font-black text-white">{inv.quantity.toLocaleString()}</h4>
                   </div>
                   <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-saffron/20 group-hover:text-saffron/40 transition-colors">
                      <Box size={40} />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Stock Requests Table (Admin and Branch Manager) */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2">
                <Clock size={16} /> {userRole === 'ADMIN' ? 'इनकमिंग स्टॉक रिक्वेस्ट्स' : 'मेरी मांगें (My Requests)'}
              </h3>
           </div>
           <div className="premium-card overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">दिनांक</th>
                          <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">शाखा (Branch)</th>
                          <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">सामग्री</th>
                          <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">मात्रा</th>
                          <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">स्थिति (Status)</th>
                          {userRole === 'ADMIN' && <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">कार्रवाई</th>}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {isLoading ? (
                         <tr><td colSpan={6} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-saffron" size={32} /></td></tr>
                       ) : requests.length === 0 ? (
                         <tr><td colSpan={6} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई रिक्वेस्ट नहीं मिली</td></tr>
                       ) : requests.map((req, i) => (
                         <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6 text-[10px] font-bold text-white/40">{new Date(req.created_at).toLocaleDateString('hi-IN')}</td>
                            <td className="px-8 py-6 text-xs font-bold text-white">{req.branches?.name || 'Unknown'}</td>
                            <td className="px-8 py-6 text-[10px] font-black text-saffron uppercase tracking-widest">{req.item_type}</td>
                            <td className="px-8 py-6 text-lg font-black text-white">{req.quantity}</td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                                  {req.status === 'APPROVED' ? 'डिस्पैच' : 'लंबित (PENDING)'}
                               </span>
                            </td>
                            {userRole === 'ADMIN' && (
                               <td className="px-8 py-6">
                                  {req.status === 'PENDING' && (
                                    <button className="px-4 py-2 bg-saffron text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 transition-all">रिलीज़ स्टॉक</button>
                                  )}
                               </td>
                            )}
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Request Modal */}
        <AnimatePresence>
          {isRequestModalOpen && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden sacred-glow"
               >
                  <div className="p-12 space-y-10">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black font-serif uppercase gold-text">स्टॉक की मांग करें</h3>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">शाखा के लिए आवश्यक सामग्री का विवरण दें</p>
                     </div>

                     <form onSubmit={handleCreateRequest} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">सामग्री का प्रकार</label>
                              <select 
                                value={requestData.item_type}
                                onChange={(e) => setRequestData({...requestData, item_type: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-saffron/50 text-white text-xs font-bold uppercase"
                              >
                                 <option value="BOOKLET" className="bg-black">राम नाम पुस्तिका</option>
                                 <option value="PEN" className="bg-black">सनातनी पेन</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">आवश्यक संख्या (Quantity)</label>
                              <input 
                                type="number" required
                                value={requestData.quantity}
                                onChange={(e) => setRequestData({...requestData, quantity: parseInt(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-saffron/50 text-white text-xl font-black" 
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">आवश्यकता का कारण (Remark)</label>
                           <textarea 
                             rows={3} required
                             value={requestData.remark}
                             onChange={(e) => setRequestData({...requestData, remark: e.target.value})}
                             placeholder="कारण लिखें (उदा: स्टॉक समाप्त होने वाला है...)"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-saffron/50 text-white text-sm resize-none"
                           ></textarea>
                        </div>
                        <div className="flex gap-4 pt-4">
                           <button type="button" onClick={() => setIsRequestModalOpen(false)} className="flex-1 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40">रद्द करें</button>
                           <button type="submit" className="flex-[2] saffron-btn py-5 text-[10px]">रिक्वेस्ट सबमिट करें</button>
                        </div>
                     </form>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
