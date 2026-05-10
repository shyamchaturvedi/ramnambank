"use client";

import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export default function AdminInventory() {
  return (
    <div className="space-y-8 text-white pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black font-serif uppercase gold-text">इन्वेंटरी एवं लॉजिस्टिक्स</h2>
          <p className="text-white/40 text-sm mt-1">पुस्तिका, सनातनी पेन और वितरण का प्रबंधन।</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 rounded-xl border border-white/10 text-white/60 font-bold text-[10px] tracking-widest uppercase hover:bg-white/5">स्टॉक रिपोर्ट</button>
           <button className="saffron-btn flex items-center gap-3 text-xs">
              <Package size={18} />
              नया स्टॉक जोड़ें
           </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'अर्चना पुस्तिका स्टॉक', value: '45,200', icon: BookOpen, color: 'text-saffron' },
           { label: 'सनातनी पेन स्टॉक', value: '12,800', icon: PenTool, color: 'text-blue-400' },
           { label: 'लंबित अनुरोध (Pending)', value: '145', icon: Clock, color: 'text-yellow-500' },
           { label: 'मार्ग में (In Transit)', value: '320', icon: Truck, color: 'text-green-500' },
         ].map((stat, i) => (
           <div key={i} className="premium-card p-6 flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-bold font-mono">{stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Logistics Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Pending Requests Table */}
         <div className="lg:col-span-2 premium-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <h3 className="font-bold text-sm uppercase tracking-widest text-saffron">सामग्री अनुरोध (Requests)</h3>
               <div className="flex gap-2">
                  <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white"><Search size={16} /></button>
                  <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white"><Filter size={16} /></button>
               </div>
            </div>
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                     <th className="p-6">भक्त का नाम</th>
                     <th className="p-6">अनुरोधित सामग्री</th>
                     <th className="p-6">स्थान</th>
                     <th className="p-6">कार्य</th>
                  </tr>
               </thead>
               <tbody className="text-xs">
                  {[
                    { name: 'राम प्रकाश द्विवेदी', items: '2 पुस्तिका, 2 पेन', location: 'अयोध्या, UP', date: 'आज' },
                    { name: 'सरिता देवी', items: '1 पुस्तिका, 1 पेन', location: 'वाराणसी, UP', date: 'कल' },
                    { name: 'विजय सिंह', items: '5 पुस्तिका, 5 पेन', location: 'दिल्ली', date: '2 दिन पहले' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                       <td className="p-6">
                          <p className="font-bold">{row.name}</p>
                          <p className="text-[9px] text-white/30 mt-1 uppercase">ID: RN-99{i}</p>
                       </td>
                       <td className="p-6 text-white/60">{row.items}</td>
                       <td className="p-6 text-white/60">{row.location}</td>
                       <td className="p-6">
                          <button className="px-4 py-2 bg-saffron/10 text-saffron rounded-lg font-bold hover:bg-saffron hover:text-white transition-all">
                             शिप करें
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Quick Actions & Tracking */}
         <div className="space-y-8">
            <div className="premium-card p-8 space-y-6">
               <h3 className="font-bold text-sm uppercase tracking-widest text-royal-gold">लॉजिस्टिक्स ट्रैकिंग</h3>
               <div className="space-y-6">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                     <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">स्पीड पोस्ट: EX9928421IN</p>
                        <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[8px] font-black rounded uppercase">In Transit</span>
                     </div>
                     <p className="font-bold text-sm">मुंबई केंद्र हेतु प्रेषित (50 यूनिट)</p>
                     <button className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all">ट्रैक करें</button>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4 opacity-60">
                     <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">स्पीड पोस्ट: EX9928420IN</p>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-[8px] font-black rounded uppercase">Delivered</span>
                     </div>
                     <p className="font-bold text-sm">इंदौर शाखा प्राप्त (20 यूनिट)</p>
                  </div>
               </div>
            </div>

            {/* Inventory Alert */}
            <div className="premium-card p-8 bg-red-500/5 border border-red-500/20 flex items-start gap-4">
               <ArrowUpRight className="text-red-500 shrink-0" size={20} />
               <div>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">स्टॉक अलर्ट</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">सनातनी पेन का स्टॉक 20% से कम बचा है। कृपया नए ऑर्डर की योजना बनाएं।</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
