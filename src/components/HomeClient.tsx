"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  History, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Menu,
  ChevronRight,
  Star,
  PlayCircle,
  Heart,
  Globe,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { getAdminStats } from '@/services/dataService';

export default function HomeClient() {
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const loadStats = async () => {
      const data = await getAdminStats();
      setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black">
        {/* Premium Top Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <Link href="/" className="relative w-16 h-16 rounded-2xl overflow-hidden sacred-glow border border-saffron/20">
                   <Image 
                     src="/logo.png" 
                     alt="Ram Nam Bank Logo" 
                     fill 
                     className="object-cover"
                   />
                </Link>
                <div>
                   <h1 className="text-sm font-black font-serif gold-text tracking-widest uppercase leading-none">राम नाम बैंक</h1>
                   <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold mt-1">अयोध्या धाम</p>
                </div>
             </div>

             <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                <Link href="/about" className="hover:text-saffron transition-colors">हमारे बारे में</Link>
                <Link href="/mission" className="hover:text-saffron transition-colors">हमारा संकल्प</Link>
                <Link href="/progress" className="hover:text-saffron transition-colors">वैश्विक प्रगति</Link>
                 <Link href="/committee" className="hover:text-saffron transition-colors">समितियां</Link>
                 <Link href="/branches" className="hover:text-saffron transition-colors">शाखाएं</Link>
                 <Link href="/write" className="hover:text-saffron transition-colors">लेखन विधि</Link>
                 <Link href="/donate" className="hover:text-saffron transition-colors text-sacred-red">दान एवं सेवा</Link>
                <Link href="/login" className="px-6 py-2 rounded-full border border-white/10 hover:border-saffron/50 transition-all">प्रवेश</Link>
                <Link href="/open-account" className="saffron-btn">खाता खोलें</Link>
             </div>

             <button className="lg:hidden text-white">
                <Menu size={28} />
             </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black z-10"></div>
            <Image 
              src="/hero.png" 
              alt="अयोध्या धाम" 
              fill 
              className="object-cover animate-slow-pan"
              priority
            />
          </div>

          <div className="relative z-20 text-center px-6 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black tracking-[0.3em] uppercase mb-6 backdrop-blur-md"
            >
               <Award size={16} />
               अयोध्या धाम से संचालित
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black mb-6 py-6 tracking-tight leading-tight"
            >
              वह धन जो सदैव <br />
              <span className="gold-text py-2 px-2 drop-shadow-[0_10px_30px_rgba(255,215,0,0.3)]">सार्थक रहेगा।</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            >
               विश्व के सबसे अनूठे आध्यात्मिक कोष से जुड़ें, जहाँ भक्त प्रभु श्री राम के पावन नाम को हस्तलिखित "अर्चना पुस्तिका" के रूप में संचित करते हैं।
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm inline-block"
            >
              <p className="text-xl md:text-2xl font-serif gold-text italic tracking-wide">
                “राम नाम के लिखने से ही जीवन का कल्याण संभव है।”
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/open-account" className="saffron-btn scale-110 group">
                  खाता खोलें 
                  <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/mission" className="px-10 py-4 rounded-xl border border-white/20 font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition-all">हमारा लक्ष्य</Link>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
             <ChevronRight size={32} className="rotate-90" />
          </div>
        </section>

        {/* Certificate & Awards Showcase Section (New) */}
        <section id="awards" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
               <h3 className="text-saffron font-black tracking-[0.3em] uppercase text-xs">परम सम्मान एवं मान्यता</h3>
               <h2 className="text-4xl md:text-6xl font-bold font-serif">साधना के मील के पत्थर</h2>
               <p className="text-white/40 max-w-2xl mx-auto uppercase text-[10px] tracking-widest font-bold">आपकी निरंतर साधना को बैंक द्वारा विशेष रूप से सम्मानित किया जाता है</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Achievement 1 */}
               <motion.div whileHover={{ y: -10 }} className="premium-card p-10 space-y-8 group border-b-4 border-white/5 hover:border-saffron/50 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-saffron/10 group-hover:text-saffron transition-all">
                    <Award size={32} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold gold-text">सहभागिता प्रमाण पत्र</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">1 पुस्तिका (Booklet) पूर्ण होने पर डिजिटल प्रमाण पत्र प्रदान किया जाता है।</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">योग्यता: 1 पुस्तिका</span>
                     <span className="px-3 py-1 rounded-full bg-white/5 text-[8px] font-black uppercase text-white/40">डिजिटल</span>
                  </div>
               </motion.div>

               {/* Achievement 2 */}
               <motion.div whileHover={{ y: -10 }} className="premium-card p-10 space-y-8 group border-b-4 border-saffron/20 hover:border-saffron/50 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <Star size={20} className="text-saffron animate-pulse" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron shadow-[0_0_20px_rgba(255,153,51,0.2)]">
                    <Award size={32} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold gold-text">विशेष साधक सम्मान</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">5+ पुस्तिकाएं पूर्ण करने पर विशेष मुद्रित प्रमाण पत्र एवं अंगवस्त्र प्रदान किया जाता है।</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-saffron uppercase tracking-widest">योग्यता: 5+ पुस्तिकाएं</span>
                     <span className="px-3 py-1 rounded-full bg-saffron/20 text-[8px] font-black uppercase text-saffron">मुद्रित</span>
                  </div>
               </motion.div>

               {/* Achievement 3 */}
               <motion.div whileHover={{ y: -10 }} className="premium-card p-10 space-y-8 group border-b-4 border-sacred-red/20 hover:border-sacred-red/50 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-sacred-red/10 flex items-center justify-center text-sacred-red">
                    <Award size={32} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-sacred-red">राम रत्न सम्मान</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">11+ पुस्तिकाएं पूर्ण करने पर अयोध्या मुख्यालय से स्मृति चिन्ह एवं विशेष पदक प्रदान किया जाता है।</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-sacred-red uppercase tracking-widest">योग्यता: 11+ पुस्तिकाएं</span>
                     <span className="px-3 py-1 rounded-full bg-sacred-red/20 text-[8px] font-black uppercase text-sacred-red">सर्वोच्च</span>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Global Counter Section */}
        <section id="stats" className="py-32 px-6 bg-black relative">
          <div className="max-w-7xl mx-auto">
            <div className="premium-card p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-saffron/10"></div>
               
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h3 className="text-saffron font-black tracking-[0.3em] uppercase text-xs mb-4">वैश्विक आध्यात्मिक कोष</h3>
                     <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight">हस्तलिखित संचित <br /> कुल राम नाम</h2>
                     <p className="text-white/40 text-sm mb-10 leading-relaxed uppercase tracking-widest font-bold">प्रत्येक अक्षर आपकी श्रद्धा का प्रतीक है</p>
                    <div className="flex gap-4">
                       <Link href="/progress" className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">विस्तृत रिपोर्ट देखें</Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                        <h4 className="text-4xl font-black gold-text mb-2 font-mono tracking-tighter">1,245 Cr</h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">कुल संचित नाम</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                        <h4 className="text-4xl font-black gold-text mb-2 font-mono tracking-tighter">
                          {stats?.totalBhakt ? stats.totalBhakt.toLocaleString() : '6,000'}+
                        </h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">सक्रिय भक्त</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                        <h4 className="text-4xl font-black gold-text mb-2 font-mono tracking-tighter">
                          {stats?.totalBranches || '30'}+
                        </h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">वैश्विक शाखाएं</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-saffron/10 border border-saffron/20 text-center">
                        <h4 className="text-4xl font-black text-saffron mb-2 font-mono tracking-tighter">108</h4>
                        <p className="text-[10px] font-black text-saffron/60 uppercase tracking-widest">देशों में उपस्थिति</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Devotees Experience Section */}
        <section className="py-32 px-6 bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h3 className="text-saffron font-black tracking-[0.3em] uppercase text-xs mb-4">श्रद्धा एवं विश्वास</h3>
               <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6">भक्तों के अनुभव</h2>
               <p className="text-white/40 max-w-2xl mx-auto">राम नाम संचय के पथ पर चलने वाले श्रद्धालुओं की आपबीती और आध्यात्मिक अनुभूतियां।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "राम प्रसाद",
                  city: "अयोध्या",
                  exp: "राम नाम अर्चना पुस्तिका में लिखने से मेरे जीवन में एक अद्भुत शांति का अनुभव हुआ है। हस्तलिपि में नाम संचित करना अब मेरी दिनचर्या का हिस्सा है।"
                },
                {
                  name: "सीता देवी",
                  city: "वाराणसी",
                  exp: "सनातनी पेन से राम नाम लिखना बहुत ही प्रभावशाली है। यह हमें हर पल प्रभु के करीब और एकाग्र रखता है।"
                },
                {
                  name: "राजेश खन्ना",
                  city: "मुंबई",
                  exp: "जब से मैंने अपनी पहली अर्चना पुस्तिका पूर्ण की है, मेरी मानसिक एकाग्रता बढ़ी है और मुझे प्रभु की उपस्थिति का आभास होता है।"
                }
              ].map((item, idx) => (
                <div key={idx} className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-saffron/30 transition-all group">
                   <div className="flex gap-1 text-saffron mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                   </div>
                   <p className="text-white/70 italic mb-8 leading-relaxed">"{item.exp}"</p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center font-bold text-saffron">
                        {item.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">{item.city}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-32 px-6 bg-gradient-to-b from-black to-[#050505]">
          <div className="max-w-4xl mx-auto text-center space-y-12">
             <div className="w-20 h-20 rounded-3xl bg-saffron/10 flex items-center justify-center text-3xl font-bold gold-text mx-auto sacred-glow">ॐ</div>
             <h2 className="text-4xl md:text-6xl font-black font-serif leading-tight">क्या आप अपनी आध्यात्मिक <br /> पूंजी संचित करने के लिए <span className="gold-text">तैयार हैं?</span></h2>
             <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed">अयोध्या धाम के पावन मार्गदर्शन में अपने जीवन को राम मय बनाएं।</p>
             <div className="pt-6">
                <Link href="/open-account" className="saffron-btn scale-125">अभी अपना खाता खोलें</Link>
             </div>
          </div>
        </section>

        <Footer />
    </div>
  );
}
