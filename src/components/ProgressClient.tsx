"use client";

import React from 'react';
import { 
  TrendingUp, 
  Globe, 
  Award, 
  Sparkles, 
  ChevronLeft,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function ProgressClient() {
  const stats = [
    { label: 'आज का संचय', value: '1.2 Cr+', icon: TrendingUp },
    { label: 'कुल पंजीकृत भक्त', value: '2.4 Lakh+', icon: Users },
    { label: 'कुल भरी गई कॉपियां', value: '45,000+', icon: BookOpen },
    { label: 'सक्रिय देश', value: '108', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="p-8 border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
           </Link>
           <h1 className="text-xl font-bold font-serif gold-text uppercase tracking-widest">वैश्विक आध्यात्मिक प्रगति</h1>
           <div className="w-20"></div>
        </div>
      </nav>

      <main className="flex-1 py-20 px-6 max-w-7xl mx-auto w-full space-y-24">
        {/* Main Live Counter */}
        <section className="text-center space-y-12">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-xs font-black uppercase tracking-[0.4em]"
           >
              <Sparkles size={20} className="animate-pulse" /> Live Stats
           </motion.div>
           <h2 className="text-6xl md:text-9xl font-black font-serif gold-text tracking-tighter drop-shadow-2xl">
              18,54,30,21,980
           </h2>
           <p className="text-white/40 text-xl md:text-2xl font-light uppercase tracking-[0.3em]">कुल संचित राम नाम</p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: i * 0.1 }}
               className="premium-card p-10 text-center space-y-6"
             >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-saffron mx-auto shadow-inner border border-white/10">
                   <stat.icon size={28} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">{stat.label}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Graph Placeholder */}
        <section className="premium-card p-12 md:p-20 bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl font-black font-serif gold-text uppercase leading-tight">संचय का <br /> ग्राफ़िकल विवरण</h3>
                 <p className="text-white/40 text-lg leading-relaxed uppercase tracking-widest font-bold">हर महीने बढ़ती हुई आध्यात्मिक ऊर्जा</p>
                 <div className="flex gap-4">
                    <button className="px-8 py-3 rounded-xl bg-saffron text-black font-black text-[10px] uppercase tracking-widest">विस्तृत रिपोर्ट</button>
                    <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">2026 ऑडिट</button>
                 </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4">
                 {[40, 60, 35, 90, 55, 80, 100].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ duration: 1, delay: i * 0.1 }}
                     className="flex-1 bg-gradient-to-t from-saffron/10 via-saffron/40 to-saffron rounded-t-xl relative group"
                   >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all">
                         {h}M
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Global Leaderboard Section */}
        <section className="space-y-12">
           <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <Award size={24} className="text-saffron" />
              <h3 className="text-2xl font-black font-serif gold-text uppercase">शीर्ष संचयकर्ता (Top Contributors)</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'वाराणसी मुख्य शाखा', city: 'Varanasi', count: '5.2 Billion' },
                { name: 'अयोध्या धाम केंद्र', city: 'Ayodhya', count: '4.8 Billion' },
                { name: 'मुंबई आध्यात्मिक मंडल', city: 'Mumbai', count: '3.1 Billion' },
                { name: 'इंदौर सेवा केंद्र', city: 'Indore', count: '2.5 Billion' },
              ].map((c, i) => (
                <div key={i} className="premium-card p-8 flex items-center justify-between group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-saffron font-black text-xs">
                         {i + 1}
                      </div>
                      <div>
                         <p className="text-lg font-bold text-white/80">{c.name}</p>
                         <p className="text-[10px] text-white/30 uppercase tracking-widest">{c.city}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black gold-text italic">{c.count}</p>
                      <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">राम नाम</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
