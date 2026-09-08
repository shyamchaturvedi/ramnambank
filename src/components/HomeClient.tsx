"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Menu,
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { getAdminStats } from '@/services/dataService';

export default function HomeClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const loadStats = async () => {
      const data = await getAdminStats();
      setStats(data);
    };
    loadStats();
  }, []);

  const navLinks = [
    { name: 'हमारे बारे में', href: '/about' },
    { name: 'हमारा संकल्प', href: '/mission' },
    { name: 'वैश्विक प्रगति', href: '/progress' },
    { name: 'समितियां', href: '/committee' },
    { name: 'शाखाएं', href: '/branches' },
    { name: 'लेखन विधि', href: '/write' },
    { name: 'दान एवं सेवा', href: '/donate', color: 'text-sacred-red' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={false}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-[99] lg:hidden`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div onClick={(e) => e.stopPropagation()} className="p-4 sm:p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 sm:mb-16">
            <div className="text-lg sm:text-xl font-bold font-serif gold-text uppercase tracking-widest">मेनू</div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 sm:p-3 bg-white/5 rounded-2xl text-white/40 hover:text-saffron smooth-transition">
              <ArrowRight size={24} className="rotate-180" />
            </button>
          </div>
          <div className="flex-1 space-y-6 sm:space-y-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-xl sm:text-2xl font-black uppercase tracking-widest smooth-transition hover:text-saffron ${link.color || 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="space-y-3 sm:space-y-6 pt-6 sm:pt-10 border-t border-white/10">
            <Link href="/login" className="block w-full py-4 sm:py-5 rounded-2xl border border-white/10 text-center font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white/5 smooth-transition">प्रवेश</Link>
            <Link href="/open-account" className="block w-full saffron-btn text-center">खाता खोलें</Link>
          </div>
        </div>
      </motion.div>

      {/* Premium Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="relative w-12 sm:w-16 h-12 sm:h-16 rounded-2xl overflow-hidden sacred-glow border border-saffron/20 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Ram Nam Bank Logo" 
                fill 
                className="object-cover"
                priority
              />
            </Link>
            <div>
              <h1 className="text-xs sm:text-sm font-black font-serif gold-text tracking-widest uppercase leading-tight">राम नाम बैंक</h1>
              <p className="text-[7px] sm:text-[8px] text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold mt-1">अयोध्या धाम</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[9px] xl:text-[10px] font-black uppercase tracking-widest">
            <Link href="/about" className="hover:text-saffron smooth-transition">हमारे बारे में</Link>
            <Link href="/mission" className="hover:text-saffron smooth-transition">हमारा संकल्प</Link>
            <Link href="/progress" className="hover:text-saffron smooth-transition">वैश्विक प्रगति</Link>
            <Link href="/committee" className="hover:text-saffron smooth-transition">समितियां</Link>
            <Link href="/branches" className="hover:text-saffron smooth-transition">शाखाएं</Link>
            <Link href="/write" className="hover:text-saffron smooth-transition">लेखन विधि</Link>
            <Link href="/donate" className="hover:text-saffron smooth-transition text-sacred-red">दान एवं सेवा</Link>
            <Link href="/login" className="px-4 xl:px-6 py-2 rounded-full border border-white/10 hover:border-saffron/50 smooth-transition text-[9px] xl:text-[10px]">प्रवेश</Link>
            <Link href="/open-account" className="saffron-btn text-[9px] xl:text-[10px] px-4 xl:px-6">खाता खोलें</Link>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="lg:hidden text-white p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-saffron/10 smooth-transition"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-32 pb-10 sm:pb-12">
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

        <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[8px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 backdrop-blur-sm"
          >
            <Award size={14} className="flex-shrink-0" />
            <span>अयोध्या धाम से संचालित</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 py-3 sm:py-6 tracking-tight leading-tight"
          >
            वह धन जो सदैव <br />
            <span className="gold-text py-1 sm:py-2 px-1 sm:px-2 drop-shadow-[0_10px_30px_rgba(255,215,0,0.3)]">सार्थक रहेगा।</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed font-light"
          >
            विश्व के सबसे अनूठे आध्यात्मिक कोष से जुड़ें, जहाँ भक्त प्रभु श्री राम के पावन नाम का संचय करते हैं।
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm inline-block"
          >
            <p className="text-base sm:text-lg md:text-xl font-serif gold-text italic tracking-wide">
              "राम नाम के लिखने से ही जीवन का कल्याण संभव है।"
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/open-account" className="saffron-btn w-full sm:w-auto justify-center group">
              खाता खोलें 
              <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 smooth-transition" />
            </Link>
            <Link href="/mission" className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-xl border border-white/20 font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-white/5 smooth-transition text-center">
              हमारा लक्ष्य
            </Link>
          </div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 opacity-20 hidden md:block"
        >
          <ChevronRight size={32} className="rotate-90" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card p-6 sm:p-10 md:p-16 lg:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-saffron/5 rounded-full blur-[100px] -mr-32 sm:-mr-48 -mt-32 sm:-mt-48 smooth-transition group-hover:bg-saffron/10"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
              <div>
                <h3 className="text-saffron font-black tracking-[0.3em] uppercase text-xs mb-3 sm:mb-4">वैश्विक आध्यात्मिक कोष</h3>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 sm:mb-6 leading-tight">हस्तलिखित संचित राम नाम</h2>
                <p className="text-white/40 text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed uppercase tracking-widest font-bold">प्रत्येक अक्षर आपकी श्रद्धा का प्रतीक है।</p>
                <Link href="/progress" className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 smooth-transition inline-block">
                  विस्तृत प्रगति देखें
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:border-saffron/50 smooth-transition">
                  <h4 className="text-3xl sm:text-4xl font-black gold-text mb-2 font-mono tracking-tighter">1.2B</h4>
                  <p className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest">कुल संचित नाम</p>
                </div>
                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:border-saffron/50 smooth-transition">
                  <h4 className="text-3xl sm:text-4xl font-black gold-text mb-2 font-mono tracking-tighter">
                    {stats?.totalBhakt ? stats.totalBhakt.toLocaleString() : '6K'}+
                  </h4>
                  <p className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest">सक्रिय भक्त</p>
                </div>
                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:border-saffron/50 smooth-transition">
                  <h4 className="text-3xl sm:text-4xl font-black gold-text mb-2 font-mono tracking-tighter">
                    {stats?.totalBranches || '30'}+
                  </h4>
                  <p className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest">वैश्विक शाखाएं</p>
                </div>
                <div className="p-6 sm:p-8 rounded-3xl bg-saffron/10 border border-saffron/20 text-center">
                  <h4 className="text-3xl sm:text-4xl font-black text-saffron mb-2 font-mono tracking-tighter">108</h4>
                  <p className="text-[8px] sm:text-[10px] font-black text-saffron/60 uppercase tracking-widest">देशों में उपस्थिति</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h3 className="text-saffron font-black tracking-[0.3em] uppercase text-xs mb-3 sm:mb-4">श्रद्धा एवं विश्वास</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 sm:mb-6">भक्तों के अनुभव</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xs sm:text-sm">राम नाम संचय के पथ पर चलने वाले श्रद्धालुओं की प्रेरणादायक कहानियाँ।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: "राम प्रसाद",
                city: "अयोध्या",
                exp: "राम नाम संचय से मेरे जीवन में आध्यात्मिक शांति आई है।",
              },
              {
                name: "सीता देवी",
                city: "वाराणसी",
                exp: "यह यात्रा मुझे प्रभु के अधिक करीब ले गई है।",
              },
              {
                name: "राजेश खन्ना",
                city: "मुंबई",
                exp: "मानसिक शांति और आत्मिक विकास अद्भुत है।",
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-saffron/30 smooth-transition group"
              >
                <div className="flex gap-1 text-saffron mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="sm:w-4 sm:h-4" fill="currentColor" />)}
                </div>
                <p className="text-white/70 italic mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">\"{ item.exp}\"</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-saffron/20 flex items-center justify-center font-bold text-saffron flex-shrink-0 text-sm sm:text-base">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{item.name}</h4>
                    <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-widest">{item.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-black to-[#050505]">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-12">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-3xl bg-saffron/10 flex items-center justify-center text-2xl sm:text-3xl font-bold gold-text mx-auto sacred-glow">ॐ</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-serif leading-tight">क्या आप अपनी आध्यात्मिक पूंजी संचित करना चाहते हैं?</h2>
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-light leading-relaxed">अयोध्या धाम के पावन मार्गदर्शन में आज ही शुरुआत करें।</p>
          <div className="pt-4 sm:pt-6">
            <Link href="/open-account" className="saffron-btn inline-block sm:scale-110">अभी अपना खाता खोलें</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}