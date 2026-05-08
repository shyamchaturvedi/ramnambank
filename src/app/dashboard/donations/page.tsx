"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search, 
  Plus, 
  IndianRupee, 
  CreditCard, 
  Banknote,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { getDonations, updateDonationStatus } from '@/services/dataService';

export default function DonationManagementPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDonations = async () => {
    setLoading(true);
    const data = await getDonations();
    setDonations(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await updateDonationStatus(id, 'APPROVED');
    if (res.success) {
      loadDonations();
    }
  };

  const filteredDonations = donations.filter(d => 
    d.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.utr_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = donations.filter(d => d.status === 'PENDING').length;
  const totalAmount = donations
    .filter(d => d.status === 'APPROVED')
    .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <h2 className="text-3xl font-black font-serif gold-text uppercase">दान एवं रसीद प्रबंधन</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Manage UTR Approvals and Cash Entries</p>
           </div>
           <button className="saffron-btn flex items-center gap-2 scale-110">
              <Plus size={18} /> नकद दान (Cash Entry)
           </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="premium-card p-6 border-l-4 border-saffron">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">लंबित सत्यापन (Pending UTR)</p>
              <h4 className="text-2xl font-black gold-text">{pendingCount}</h4>
           </div>
           <div className="premium-card p-6 border-l-4 border-green-500">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">कुल स्वीकृत दान</p>
              <h4 className="text-2xl font-black gold-text">₹{totalAmount.toLocaleString()}</h4>
           </div>
           <div className="premium-card p-6 border-l-4 border-blue-500">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">कुल रसीदें जारी</p>
              <h4 className="text-2xl font-black gold-text">{donations.filter(d => d.status === 'APPROVED').length}</h4>
           </div>
        </div>

        {/* Donation Table */}
        <div className="premium-card overflow-hidden">
           <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">हालिया ट्रांजेक्शन</h3>
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input 
                   type="text" 
                   placeholder="UTR या नाम से खोजें..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-black border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-saffron/50 text-white" 
                 />
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">दाता का नाम</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">राशि</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">प्रकार / UTR</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">स्थिति</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">कार्रवाई</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 size={32} className="animate-spin text-saffron mx-auto" /></td></tr>
                    ) : filteredDonations.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई डेटा नहीं मिला</td></tr>
                    ) : filteredDonations.map((d, i) => (
                       <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm text-white">{d.donor_name}</p>
                             <p className="text-[8px] text-white/20 uppercase tracking-widest">{new Date(d.created_at).toLocaleDateString('hi-IN')}</p>
                          </td>
                          <td className="px-8 py-6 text-lg font-black text-saffron">₹{parseFloat(d.amount).toLocaleString()}</td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <CreditCard size={14} className="text-blue-400" />
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">ONLINE</p>
                                   <p className="text-[9px] font-mono text-white/40">{d.utr_number}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${d.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-saffron/10 text-saffron border-saffron/20'}`}>
                                {d.status === 'APPROVED' ? 'स्वीकृत' : 'लंबित'}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                {d.status === 'PENDING' && (
                                   <button 
                                     onClick={() => handleApprove(d.id)}
                                     className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all" 
                                     title="Approve"
                                   >
                                      <CheckCircle size={16} />
                                   </button>
                                )}
                                <button 
                                  onClick={() => window.print()}
                                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-saffron hover:bg-saffron/10 transition-all" 
                                  title="Download Slip"
                                >
                                   <Download size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
