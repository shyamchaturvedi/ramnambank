"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  IndianRupee, 
  Award,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  const stats = [
    { label: 'कुल संचित राम नाम', value: '18,54,30,21,980', icon: Sparkles, color: 'text-saffron', desc: 'वैश्विक संचय' },
    { label: 'सक्रिय सदस्य', value: '2,45,900', icon: Users, color: 'text-blue-500', desc: 'विश्व भर से' },
    { label: 'कुल पुस्तिकाएं', value: '45,670', icon: BookOpen, color: 'text-purple-500', desc: 'भरी जा चुकी हैं' },
    { label: 'आध्यात्मिक कोष', value: '₹15,20,450', icon: IndianRupee, color: 'text-green-500', desc: 'कुल सेवा राशि' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Welcome Header */}
        <div className="relative p-12 rounded-[2rem] bg-gradient-to-br from-saffron/20 via-saffron/5 to-transparent border border-saffron/10 overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-saffron text-[10px] font-black uppercase tracking-[0.4em]">
                 <Calendar size={14} />
                 6 मई 2026 • अयोध्या धाम
              </div>
              <h2 className="text-4xl md:text-6xl font-black font-serif gold-text leading-tight">
                 नमस्ते, जय श्री राम!
              </h2>
              <p className="text-white/40 text-sm max-w-xl leading-relaxed font-bold uppercase tracking-widest">
                 "राम नाम के जाप से ही जीवन का कल्याण संभव है।" आज आपके नेतृत्व में 4,500 नए नाम संचित हुए हैं।
              </p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={i} 
               className="premium-card p-8 group hover:border-saffron/40 transition-all cursor-default"
             >
                <div className="flex items-center justify-between mb-6">
                   <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <TrendingUp size={16} className="text-green-500 opacity-50" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
                   <h3 className="text-2xl font-black text-white group-hover:text-saffron transition-colors">{stat.value}</h3>
                   <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{stat.desc}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Activity */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-lg font-black uppercase tracking-widest">हालिया गतिविधियां</h3>
                 <button className="text-[10px] font-black text-saffron uppercase hover:underline">सभी देखें</button>
              </div>
              <div className="space-y-4">
                 {[
                   { user: 'राहुल शर्मा', action: 'ने 21,000 नाम जमा किए', time: '2 मिनट पहले', type: 'collection' },
                   { user: 'अमित कुमार', action: 'ने ₹1100 दान किए', time: '15 मिनट पहले', type: 'donation' },
                   { user: 'वाराणसी शाखा', action: 'ने 500 नई पुस्तिकाएं मंगाई', time: '1 घंटा पहले', type: 'logistics' },
                 ].map((item, i) => (
                   <div key={i} className="premium-card p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 font-black text-xs uppercase">
                            {item.user[0]}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white/80">{item.user} <span className="text-white/40 font-normal">{item.action}</span></p>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">{item.time}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-white/10 group-hover:text-saffron group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
              </div>
           </div>

           {/* Achievements / Leaderboard */}
           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-lg font-black uppercase tracking-widest">शीर्ष शाखाएं</h3>
              </div>
              <div className="premium-card p-8 space-y-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                 {[
                   { name: 'वाराणसी मुख्य', count: '50.4 Cr', rank: 1 },
                   { name: 'अयोध्या धाम', count: '45.2 Cr', rank: 2 },
                   { name: 'मथुरा शाखा', count: '38.9 Cr', rank: 3 },
                 ].map((branch, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-saffron text-black' : 'bg-white/5 text-white/40'}`}>
                            {branch.rank}
                         </div>
                         <p className="text-xs font-bold uppercase tracking-widest">{branch.name}</p>
                      </div>
                      <p className="text-xs font-black gold-text">{branch.count}</p>
                   </div>
                 ))}
                 <div className="pt-6 border-t border-white/5">
                    <div className="p-4 rounded-xl bg-saffron/5 border border-saffron/20 flex items-center gap-4">
                       <Award size={20} className="text-saffron shrink-0" />
                       <p className="text-[10px] text-white/60 font-bold uppercase leading-relaxed">
                          वाराणसी मुख्य शाखा ने इस सप्ताह सबसे अधिक संचय किया है!
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
