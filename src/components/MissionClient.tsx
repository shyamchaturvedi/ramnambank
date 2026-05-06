"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function MissionClient() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black">
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
           </Link>
           <h1 className="text-xl font-bold font-serif gold-text uppercase tracking-widest">हमारा पावन संकल्प</h1>
           <div className="w-20"></div>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
           {/* Section 1: Vision */}
           <section className="text-center space-y-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-3xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron mx-auto sacred-glow"
              >
                 <Target size={40} />
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black font-serif gold-text leading-tight uppercase">हमारा लक्ष्य</h2>
              <p className="text-white/40 text-xl md:text-2xl font-light leading-relaxed">
                 "विश्व के प्रत्येक सनातनी भक्त के हृदय में राम नाम की ज्योति जलाना और उसे डिजिटल माध्यम से संचित करना।"
              </p>
           </section>

           {/* Core Pillars */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'आध्यात्मिक संचय', desc: 'हर भक्त को राम नाम संचय के लिए साधन और तकनीक प्रदान करना।', icon: Sparkles },
                { title: 'विश्वव्यापी एकता', desc: 'अयोध्या धाम से जुड़कर वैश्विक सनातनी भक्तों का एक सशक्त नेटवर्क बनाना।', icon: ShieldCheck },
                { title: 'पवित्रता एवं सेवा', desc: 'संचित राम नाम की पूंजी का उपयोग आध्यात्मिक शांति और जनकल्याण के लिए करना।', icon: Heart },
                { title: 'अयोध्या का गौरव', desc: 'प्रभु श्री राम की नगरी अयोध्या को वैश्विक आध्यात्मिक केंद्र के रूप में स्थापित करना।', icon: Target },
              ].map((p, i) => (
                <div key={i} className="premium-card p-10 space-y-6 group hover:bg-white/5 transition-all border-l-4 border-saffron">
                   <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                      <p.icon size={24} />
                   </div>
                   <h4 className="text-xl font-bold uppercase tracking-widest">{p.title}</h4>
                   <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
           </div>

           {/* Call to Action */}
           <section className="premium-card p-12 md:p-20 text-center space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10">
              <h3 className="text-3xl font-black font-serif uppercase tracking-widest">आज ही इस संकल्प का हिस्सा बनें</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                 <Link href="/open-account" className="saffron-btn px-12 py-5 scale-110">खाता खोलें</Link>
                 <Link href="/donate" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">सहयोग करें</Link>
              </div>
           </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
