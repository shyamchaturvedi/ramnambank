"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ChevronLeft, 
  QrCode, 
  ShieldCheck, 
  Award, 
  Users, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const donationCauses = [
  { id: 1, title: 'अर्चना पुस्तिका छपाई', desc: '1000 नई कॉपियों की छपाई और वितरण में सहयोग करें।', amount: '₹1100', icon: BookOpen },
  { id: 2, title: 'साधु एवं संत सेवा', desc: 'अयोध्या धाम में संतों के भोजन और सेवा में योगदान।', amount: '₹2100', icon: Heart },
  { id: 3, title: 'डिजिटल विस्तार', desc: 'राम नाम बैंक की तकनीक और वैश्विक पहुंच को बढ़ाने में मदद।', amount: '₹5100', icon: Users },
];

export default function DonateClient() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sacred-red/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 p-8 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">मुख्य पृष्ठ</span>
        </Link>
        <div className="text-xl font-bold font-serif gold-text uppercase tracking-widest">दान एवं सेवा</div>
        <div className="w-20"></div>
      </nav>

      <main className="relative z-10 flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Hero Section */}
          <header className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sacred-red/10 border border-sacred-red/20 text-sacred-red text-[10px] font-black tracking-[0.3em] uppercase mb-4"
            >
               <Heart size={16} />
               निःस्वार्थ सेवा ही परम धर्म है
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-black font-serif gold-text leading-tight"
            >
               राम नाम प्रचार में <br />
               <span className="text-white">सहयोगी बनें।</span>
            </motion.h1>
            <p className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed uppercase tracking-widest font-bold">
               आपका एक छोटा सा सहयोग हजारों भक्तों को प्रभु राम के पावन नाम से जोड़ सकता है।
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             {/* Left: Donation Causes */}
             <div className="space-y-8">
                <h3 className="text-xl font-bold font-serif gold-text uppercase tracking-widest mb-10">सेवा के संकल्प (Causes)</h3>
                {donationCauses.map((cause, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={cause.id} 
                    className="premium-card p-8 group hover:bg-white/[0.05] transition-all cursor-pointer border-l-4 border-saffron"
                  >
                     <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-black transition-all">
                           <cause.icon size={24} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <h4 className="text-xl font-bold">{cause.title}</h4>
                           <p className="text-white/40 text-xs leading-relaxed">{cause.desc}</p>
                           <div className="pt-4 flex items-center justify-between">
                              <span className="text-lg font-black gold-text">न्यूनतम सेवा: {cause.amount}</span>
                              <button className="text-[10px] font-black text-saffron uppercase tracking-widest flex items-center gap-2">संकल्प लें <ArrowRight size={14} /></button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>

             {/* Right: Payment QR */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="premium-card p-12 md:p-16 space-y-10 sacred-glow border-2 border-saffron/20"
             >
                <div className="text-center space-y-4">
                   <QrCode className="text-saffron mx-auto" size={48} />
                   <h3 className="text-2xl font-black font-serif gold-text uppercase">त्वरित सेवा (Scan & Pay)</h3>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">किसी भी UPI ऐप से स्कैन करें</p>
                </div>

                <div className="w-64 h-64 bg-white p-4 rounded-3xl mx-auto shadow-[0_0_50px_rgba(255,153,51,0.2)]">
                   <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center border-4 border-dashed border-gray-300">
                      <QrCode size={80} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500 mt-4 font-black uppercase tracking-widest">ramnam@upi</span>
                   </div>
                </div>

                <div className="space-y-6 text-center">
                   <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">UPI ID:</p>
                      <p className="text-xl font-black gold-text tracking-widest">ramnam.bank@upi</p>
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left space-y-4">
                      <h5 className="text-[10px] font-black text-white/30 uppercase tracking-widest">बैंक विवरण (Bank Details)</h5>
                      <div className="space-y-2 text-xs font-bold">
                         <p className="text-white/60">खाता: श्री जगन्नाथ ओडियाबाबा सेवा संस्थान</p>
                         <p className="text-white/60">बैंक: स्टेट बैंक ऑफ इंडिया (SBI)</p>
                         <p className="text-white/60">IFSC: SBIN0000XXX</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pt-4">
                   <ShieldCheck size={16} className="text-saffron" />
                   80G कर छूट उपलब्ध
                </div>
             </motion.div>
          </div>

          {/* Social Proof */}
          <section className="text-center space-y-12 pb-20">
             <div className="inline-flex items-center gap-3 text-saffron uppercase tracking-[0.4em] text-[10px] font-black">
                <Award size={20} /> हमारी उपलब्धियां
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'कुल दानकर्ता', value: '10,000+' },
                  { label: 'पुस्तिका वितरण', value: '5 लाख+' },
                  { label: 'भोजन सेवा', value: '1 लाख+' },
                  { label: 'आध्यात्मिक केंद्र', value: '50+' },
                ].map((s, i) => (
                  <div key={i} className="premium-card p-8">
                     <h4 className="text-3xl font-black gold-text mb-2 font-mono">{s.value}</h4>
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Payment Proof Submission */}
          <section className="premium-card p-12 space-y-10 border-t-4 border-saffron">
             <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron mx-auto">
                   <ShieldCheck size={32} />
                 </div>
                <h2 className="text-3xl font-black font-serif uppercase tracking-widest">भुगतान की जानकारी दें</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Submit your UTR/Reference number for approval</p>
             </div>

             <div className="max-w-xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">दाता का नाम</label>
                      <input type="text" placeholder="आपका शुभ नाम" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-saffron/50 text-sm" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">दान राशि</label>
                      <input type="text" placeholder="₹0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-saffron/50 text-sm font-bold text-saffron" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">UTR / ट्रांजेक्शन नंबर</label>
                   <input type="text" placeholder="e.g. 123456789012" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-saffron/50 text-sm font-mono tracking-widest" />
                </div>
                <button className="saffron-btn w-full py-5 text-sm">विवरण सबमिट करें</button>
                <p className="text-[9px] text-center text-white/20 italic">
                   * विवरण सबमिट करने के बाद, हमारी टीम बैंक से मिलान करेगी और 24-48 घंटों में आपकी रसीद जारी कर दी जाएगी।
                </p>
             </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
