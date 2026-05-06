"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  History, 
  BookOpen, 
  Download, 
  Share2,
  Calendar,
  User,
  LogOut,
  ChevronRight,
  Heart
} from 'lucide-react';

export default function MemberPanel() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row">
      {/* Mini Sidebar */}
      <aside className="w-full md:w-24 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center py-8 gap-10">
        <div className="text-3xl font-bold gold-text">ॐ</div>
        <nav className="flex flex-row md:flex-col gap-10 text-white/40">
           <button className="text-saffron"><User size={28} /></button>
           <button className="hover:text-white"><History size={28} /></button>
           <button className="hover:text-white"><BookOpen size={28} /></button>
           <Link href="/donate" className="text-sacred-red hover:scale-110 transition-transform"><Heart size={28} /></Link>
           <button className="hover:text-red-500 mt-auto"><LogOut size={28} /></button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
             <h1 className="text-3xl md:text-5xl font-black font-serif uppercase gold-text">भक्त पासबुक</h1>
             <p className="text-white/40 text-sm mt-2 tracking-widest uppercase font-bold">सादर आमंत्रण, राहुल शर्मा | सदस्य ID: RN-2026-1024</p>
          </div>
          <button className="saffron-btn flex items-center justify-center gap-3 scale-110">
             <Download size={20} />
             डिजिटल पहचान पत्र
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="premium-card p-10 bg-gradient-to-br from-saffron/5 to-transparent border-t-4 border-saffron">
            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-4">कुल संचित राम नाम</p>
            <h2 className="text-5xl font-black gold-text font-mono tracking-tighter">5,00,000</h2>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest">
              <Award size={16} /> 5 पुस्तिकाएं पूर्ण
            </div>
          </div>
          <div className="premium-card p-10">
            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-4">सदस्यता की स्थिति</p>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">आजीवन सदस्य</h2>
            <p className="text-white/30 text-xs mt-3 uppercase font-bold tracking-widest">सक्रिय: जनवरी 2026 से</p>
          </div>
          <div className="premium-card p-10">
            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-4">आध्यात्मिक रैंकिंग</p>
            <h2 className="text-3xl font-bold text-white font-mono">#1,245 <span className="text-sm text-white/30 font-normal uppercase tracking-widest">जिला स्तर पर</span></h2>
            <div className="mt-6 w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <div className="bg-gradient-to-r from-saffron to-sacred-red h-full w-[65%] shadow-[0_0_15px_rgba(255,153,51,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Material Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="font-bold text-xl font-serif uppercase tracking-widest text-royal-gold">मेरी सामग्री की स्थिति (Material Status)</h3>
               <button className="saffron-btn text-[10px] py-2 px-6">नयी सामग्री मंगाएं</button>
            </div>
            
            <div className="premium-card p-10 space-y-10">
               {/* Progress Stepper for Physical Booklet */}
               <div className="flex flex-col md:flex-row justify-between gap-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 hidden md:block"></div>
                  {[
                    { step: 1, label: 'अनुरोध प्राप्त', date: '10 मई', status: 'COMPLETED' },
                    { step: 2, label: 'सामग्री प्रेषित', date: '12 मई', status: 'COMPLETED' },
                    { step: 3, label: 'लेखन जारी', date: 'वर्तमान', status: 'ACTIVE' },
                    { step: 4, label: 'संचय जमा', date: '-', status: 'PENDING' },
                  ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold ${s.status === 'COMPLETED' ? 'bg-saffron border-saffron text-black' : s.status === 'ACTIVE' ? 'bg-black border-saffron text-saffron shadow-[0_0_20px_rgba(255,153,51,0.3)]' : 'bg-black border-white/10 text-white/20'}`}>
                          {s.step}
                       </div>
                       <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${s.status === 'PENDING' ? 'text-white/20' : 'text-white'}`}>{s.label}</p>
                          <p className="text-[9px] text-white/30 mt-1 uppercase font-bold">{s.date}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-saffron to-sacred-red p-[1px]">
                        <div className="w-full h-full rounded-xl bg-black flex items-center justify-center text-saffron">
                           <BookOpen size={28} />
                        </div>
                     </div>
                     <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-saffron">अर्चना पुस्तिका #BK-9924</p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-wider">विशेष लाल स्याही पेन के साथ</p>
                     </div>
                  </div>
                  <button className="px-6 py-3 border border-saffron/30 rounded-xl text-saffron text-[10px] font-black uppercase tracking-widest hover:bg-saffron hover:text-white transition-all">
                     ट्रैकिंग विवरण
                  </button>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-bold text-xl font-serif uppercase tracking-widest text-royal-gold">महत्वपूर्ण सूचना</h3>
            <div className="premium-card p-8 space-y-6">
               <div className="p-4 bg-saffron/5 border-l-4 border-saffron rounded-r-xl">
                  <p className="text-xs font-bold leading-relaxed">संस्था द्वारा प्राप्त "सनातनी पेन" और "लाल स्याही" का ही उपयोग करें। अन्य स्याही से किया गया संचय स्वीकार नहीं होगा।</p>
               </div>
               <div className="p-4 bg-white/5 border-l-4 border-white/20 rounded-r-xl">
                  <p className="text-xs font-bold text-white/60 leading-relaxed">संचय पूर्ण होने पर पुस्तिका अपने निकटतम "शाखा केंद्र" पर जमा कराएं या पोस्ट द्वारा भेजें।</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
