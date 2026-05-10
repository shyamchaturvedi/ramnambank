"use client";

import React, { useState } from 'react';
import { 
  FileSearch, 
  Calendar, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  BookOpen, 
  Heart, 
  MapPin,
  Search
} from 'lucide-react';

export default function LedgerReportPage() {
  const [ledgerData] = useState([
    { date: '2026-05-01', branch: 'अयोध्या (Main)', activity: 'राम नाम संचय', quantity: '5,00,000', type: 'COLLECTION', user: 'राम सेवक' },
    { date: '2026-05-01', branch: 'वाराणसी', activity: 'पुस्तिका वितरण', quantity: '50 Units', type: 'LOGISTICS', user: 'अमित कुमार' },
    { date: '2026-05-02', branch: 'इंदौर', activity: 'सेवा दान संचय', quantity: '₹25,000', type: 'DONATION', user: 'राहुल शर्मा' },
    { date: '2026-05-02', branch: 'अयोध्या (Main)', activity: 'राम नाम संचय', quantity: '12,00,000', type: 'COLLECTION', user: 'साहिल अग्रवाल' },
    { date: '2026-05-03', branch: 'मुंबई', activity: 'पुस्तिका वितरण', quantity: '200 Units', type: 'LOGISTICS', user: 'संदीप वर्मा' },
  ]);

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'COLLECTION': return 'text-saffron bg-saffron/10 border-saffron/20';
      case 'LOGISTICS': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DONATION': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-1">
            <h2 className="text-3xl font-black font-serif gold-text uppercase">आध्यात्मिक लेजर</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Complete date-wise transaction history across branches</p>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all">
               <Download size={16} /> एक्सपोर्ट रिपोर्ट
            </button>
         </div>
      </div>

      {/* Filters */}
      <div className="premium-card p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/[0.02]">
         <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">शाखा चुनें</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-saffron/50">
               <option>सभी शाखाएं</option>
               <option>अयोध्या (Main)</option>
               <option>वाराणसी</option>
               <option>इंदौर</option>
               <option>मुंबई</option>
            </select>
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">तारीख से</label>
            <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-saffron/50 text-white/60" />
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">तारीख तक</label>
            <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-saffron/50 text-white/60" />
         </div>
         <div className="flex items-end">
            <button className="w-full saffron-btn py-3.5 flex items-center justify-center gap-2">
               <Filter size={16} /> डेटा लोड करें
            </button>
         </div>
      </div>

      {/* Detailed Table */}
      <div className="premium-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">तारीख (Date)</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">शाखा (Branch)</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">गतिविधि (Activity)</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">मात्रा / विवरण</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">उत्तरदायी</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">प्रकार</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {ledgerData.map((item, i) => (
                     <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-8 py-6 text-sm font-mono font-bold text-white/60">
                           {item.date}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                              <MapPin size={14} className="text-saffron" /> {item.branch}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold">
                           {item.activity}
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-lg font-black gold-text">{item.quantity}</p>
                        </td>
                        <td className="px-8 py-6 text-xs text-white/40 font-bold uppercase tracking-widest">
                           {item.user}
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getTypeStyle(item.type)}`}>
                              {item.type}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
