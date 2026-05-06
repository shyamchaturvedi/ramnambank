"use client";

import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function DonationManagementPage() {
  const [donations, setDonations] = useState([
    { id: 'DON-101', user: 'अमित कुमार', amount: '₹5,100', type: 'ONLINE', utr: 'UTR123456789', status: 'PENDING', date: '2026-05-06' },
    { id: 'DON-102', user: 'राजेश सिंह', amount: '₹1,100', type: 'CASH', utr: 'N/A', status: 'APPROVED', date: '2026-05-05' },
    { id: 'DON-103', user: 'सुनील शर्मा', amount: '₹11,000', type: 'ONLINE', utr: 'UTR987654321', status: 'APPROVED', date: '2026-05-04' },
  ]);

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
              <h4 className="text-2xl font-black gold-text">08</h4>
           </div>
           <div className="premium-card p-6 border-l-4 border-green-500">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">आज का कुल दान</p>
              <h4 className="text-2xl font-black gold-text">₹45,500</h4>
           </div>
           <div className="premium-card p-6 border-l-4 border-blue-500">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">कुल रसीदें जारी</p>
              <h4 className="text-2xl font-black gold-text">1,245</h4>
           </div>
        </div>

        {/* Donation Table */}
        <div className="premium-card overflow-hidden">
           <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">हालिया ट्रांजेक्शन</h3>
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input type="text" placeholder="UTR या नाम से खोजें..." className="w-full bg-black border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-saffron/50" />
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
                    {donations.map((d, i) => (
                       <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm">{d.user}</p>
                             <p className="text-[8px] text-white/20 uppercase tracking-widest">{d.date}</p>
                          </td>
                          <td className="px-8 py-6 text-lg font-black text-saffron">{d.amount}</td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                {d.type === 'ONLINE' ? <CreditCard size={14} className="text-blue-400" /> : <Banknote size={14} className="text-green-400" />}
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-widest">{d.type}</p>
                                   <p className="text-[9px] font-mono text-white/40">{d.utr}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${d.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-saffron/10 text-saffron border-saffron/20'}`}>
                                {d.status}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                {d.status === 'PENDING' && (
                                   <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all" title="Approve">
                                      <CheckCircle size={16} />
                                   </button>
                                )}
                                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-saffron hover:bg-saffron/10 transition-all" title="Download Slip">
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
