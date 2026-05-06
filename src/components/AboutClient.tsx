"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Users, 
  ChevronLeft,
  ArrowRight,
  Globe,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black">
      {/* Hero Section */}
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
           </Link>
           <h1 className="text-xl font-bold font-serif gold-text uppercase tracking-widest">संस्थान का परिचय</h1>
           <div className="w-20"></div>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-32">
           {/* Section 1: History */}
           <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <motion.div 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black uppercase tracking-widest"
                 >
                    <Award size={14} /> श्री जगन्नाथ ओडियाबाबा सेवा संस्थान
                 </motion.div>
                 <h2 className="text-4xl md:text-6xl font-black font-serif gold-text leading-tight">अयोध्या धाम की <br /> एक पावन परंपरा।</h2>
                 <p className="text-white/40 text-lg leading-relaxed font-light">
                    श्री राम नाम महाधन संचय बैंक केवल एक संस्था नहीं, बल्कि एक आध्यात्मिक आंदोलन है। इसकी स्थापना अयोध्या धाम में भक्तों को प्रभु के नाम के संचय के माध्यम से आत्मिक शांति प्रदान करने के लिए की गई थी।
                 </p>
                 <div className="flex gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center flex-1">
                       <h4 className="text-3xl font-black gold-text mb-1 italic">1990</h4>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">स्थापना वर्ष</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center flex-1">
                       <h4 className="text-3xl font-black gold-text mb-1 italic">50+</h4>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">आध्यात्मिक केंद्र</p>
                    </div>
                 </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative h-[500px] rounded-[3rem] overflow-hidden border-8 border-white/5 sacred-glow shadow-2xl"
              >
                 <Image 
                   src="/hero.png" 
                   alt="History" 
                   fill 
                   className="object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </motion.div>
           </section>

           {/* Section 2: Mission */}
           <section className="premium-card p-12 md:p-20 bg-saffron/5 border-2 border-saffron/20 text-center space-y-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
              <div className="max-w-3xl mx-auto space-y-8">
                 <h3 className="text-4xl md:text-6xl font-black font-serif gold-text uppercase">हमारा संकल्प (Mission)</h3>
                 <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed">
                    "विश्व के कोने-कोने में बसे राम भक्तों को एक सूत्र में पिरोकर प्रभु के नाम का संचय करना और अयोध्या धाम के गौरव को विश्व भर में फैलाना।"
                 </p>
                 <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-8">
                    {[
                      { icon: Globe, text: 'विश्वव्यापी पहुंच' },
                      { icon: Heart, text: 'निःस्वार्थ सेवा' },
                      { icon: ShieldCheck, text: 'पारदर्शिता एवं पवित्रता' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-saffron">
                         <item.icon size={24} />
                         <span className="text-xs font-black uppercase tracking-widest text-white">{item.text}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </section>

           {/* Call to Action */}
           <section className="text-center space-y-12">
              <h2 className="text-3xl font-black font-serif uppercase tracking-widest">संस्थान से जुड़ें</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                 <Link href="/open-account" className="saffron-btn px-12 py-5 scale-110">अभी खाता खोलें</Link>
                 <Link href="/donate" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">सेवा में सहयोग दें</Link>
              </div>
           </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
