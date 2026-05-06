"use client";

import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Navigation,
  Globe,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BranchesClient() {
  const branches = [
    { name: 'अयोध्या मुख्यालय (Main)', address: 'श्री जगन्नाथ ओडियाबाबा सेवा संस्थान, अयोध्या धाम', phone: '9598023701', city: 'Ayodhya' },
    { name: 'वाराणसी शाखा', address: 'अस्सी घाट, वाराणसी, उत्तर प्रदेश', phone: '99XXXXXX01', city: 'Varanasi' },
    { name: 'मथुरा शाखा', address: 'वृंदावन रोड, मथुरा, उत्तर प्रदेश', phone: '99XXXXXX02', city: 'Mathura' },
    { name: 'इंदौर शाखा', address: 'राजबाड़ा चौराहा, इंदौर, मध्य प्रदेश', phone: '99XXXXXX03', city: 'Indore' },
    { name: 'मुंबई शाखा', address: 'अंधेरी वेस्ट, मुंबई, महाराष्ट्र', phone: '99XXXXXX04', city: 'Mumbai' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="p-8 border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
           </Link>
           <h1 className="text-xl font-bold font-serif gold-text uppercase tracking-widest">आध्यात्मिक शाखाएं</h1>
           <div className="w-20"></div>
        </div>
      </nav>

      <main className="flex-1 py-20 px-6 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-6xl font-black font-serif gold-text uppercase">निकटतम शाखा खोजें</h2>
           <p className="text-white/40 text-sm tracking-[0.2em] font-bold uppercase uppercase">राम नाम बैंक की देशव्यापी उपस्थिति</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-all" size={24} />
           <input 
             type="text" 
             placeholder="शहर या राज्य का नाम दर्ज करें..." 
             className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-saffron/50 transition-all text-sm font-bold uppercase tracking-widest"
           />
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {branches.map((branch, i) => (
             <div key={i} className="premium-card p-10 space-y-8 group hover:border-saffron/30 transition-all">
                <div className="flex justify-between items-start">
                   <div className="p-4 bg-saffron/10 rounded-2xl text-saffron">
                      <MapPin size={24} />
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">{branch.city}</span>
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl font-black gold-text uppercase">{branch.name}</h3>
                   <div className="space-y-4 text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                      <div className="flex gap-4">
                         <Navigation size={16} className="shrink-0 text-white/20" />
                         <p>{branch.address}</p>
                      </div>
                      <div className="flex gap-4">
                         <Phone size={16} className="shrink-0 text-white/20" />
                         <p>{branch.phone}</p>
                      </div>
                   </div>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-saffron group-hover:text-black transition-all">
                   लोकेशन देखें
                </button>
             </div>
           ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
