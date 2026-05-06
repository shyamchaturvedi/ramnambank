"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Box, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  PackagePlus,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function InventoryPage() {
  const stockStats = [
    { label: 'कुल पुस्तिकाएं (Stock)', value: '1,240', status: 'In Stock', color: 'text-green-500' },
    { label: 'कुल पेन (Stock)', value: '850', status: 'Low Stock', color: 'text-saffron' },
    { label: 'वितरित (Issued)', value: '450', status: 'Active', color: 'text-blue-500' },
    { label: 'संग्रहित (Collected)', value: '120', status: 'Pending Review', color: 'text-purple-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h2 className="text-3xl font-black font-serif gold-text uppercase">शाखा इन्वेंटरी (Inventory Management)</h2>
              <p className="text-white/40 text-sm mt-1">पुस्तिकाओं और पेन के स्टॉक की रियल-टाइम निगरानी करें।</p>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                 <Truck size={16} /> स्टॉक मंगाएं
              </button>
              <button className="saffron-btn flex items-center gap-2 text-[10px]">
                 <PackagePlus size={18} /> नया स्टॉक जोड़ें
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stockStats.map((stat, i) => (
             <div key={i} className="premium-card p-8 space-y-4 group hover:border-saffron/30 transition-all">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                   <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-1 bg-white/5 rounded ${stat.color}`}>
                      {stat.status}
                   </span>
                </div>
             </div>
           ))}
        </div>

        {/* Stock Alert */}
        <div className="p-6 bg-saffron/5 border border-saffron/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-saffron/10 rounded-xl text-saffron animate-pulse">
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <p className="text-sm font-bold text-white/80">स्टॉक अलर्ट: पेन की संख्या कम है!</p>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest">शाखा मुख्य केंद्र (Main Hub) में केवल 850 पेन बचे हैं।</p>
              </div>
           </div>
           <button className="px-8 py-3 bg-saffron text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
              अभी आर्डर करें
           </button>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <History size={20} className="text-white/20" />
              <h3 className="text-lg font-black uppercase tracking-widest">हालिया स्टॉक गतिविधि (Recent Logs)</h3>
           </div>
           <div className="space-y-4">
              {[
                { type: 'In', item: 'राम नाम पुस्तिका (Medium)', qty: '+500', branch: 'Main Hub', time: '2 hours ago' },
                { type: 'Out', item: 'राम नाम पुस्तिका (Small)', qty: '-50', branch: 'Varanasi Branch', time: '5 hours ago' },
                { type: 'Out', item: 'पेन (Blue)', qty: '-100', branch: 'Mathura Branch', time: '1 day ago' },
              ].map((log, i) => (
                <div key={i} className="premium-card p-6 flex items-center justify-between group hover:bg-white/5 transition-all border border-white/5">
                   <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-xl bg-white/5 ${log.type === 'In' ? 'text-green-500' : 'text-red-500'}`}>
                         {log.type === 'In' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white/80">{log.item}</p>
                         <p className="text-[10px] text-white/30 uppercase tracking-widest">{log.branch} • {log.time}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-lg font-black ${log.type === 'In' ? 'text-green-500' : 'text-red-500'}`}>
                         {log.qty}
                      </p>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Quantity</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
