"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  ShieldCheck,
  MapPin,
  Phone,
  PenTool,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function PhysicalWritingGuide() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-saffron selection:text-black flex flex-col">
      {/* Header */}
      <nav className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-saffron transition-colors">
          <ArrowLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
        </Link>
        <div className="text-center">
           <h1 className="text-xl font-bold font-serif gold-text">शारीरिक पुस्तिका लेखन मार्गदर्शिका</h1>
           <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">परंपरागत राम नाम संचय</p>
        </div>
        <div className="w-20"></div>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 py-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-20 h-20 rounded-3xl bg-saffron/10 flex items-center justify-center text-saffron mx-auto sacred-glow mb-6"
           >
              <PenTool size={32} />
           </motion.div>
           <h2 className="text-4xl md:text-6xl font-black font-serif gold-text leading-tight uppercase">कलम से लिखें, <br /> पुण्य संचित करें।</h2>
           <p className="text-white/40 text-lg font-light leading-relaxed max-w-3xl mx-auto">
              प्रभु श्री राम के पावन नाम को अपनी हस्तलिपि में "अर्चना पुस्तिका" में संचित करना ही वास्तविक आध्यात्मिक पूंजी है।
           </p>
        </section>

        {/* Process Steps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'पुस्तिका प्राप्त करें', desc: 'अपनी निकटतम शाखा से "राम नाम अर्चना पुस्तिका" और "सनातनी पेन" प्राप्त करें।', icon: BookOpen },
             { title: 'नियमपूर्वक लिखें', desc: 'निर्धारित नियमों और शुद्धता के साथ प्रतिदिन राम नाम का लेखन करें।', icon: ShieldCheck },
             { title: 'शाखा में जमा करें', desc: 'पुस्तिका पूर्ण होने पर इसे अपनी शाखा में जमा करें और रसीद प्राप्त करें।', icon: Award }
           ].map((step, i) => (
             <div key={i} className="premium-card p-10 space-y-6 text-center border-t-2 border-saffron/20">
                <div className="text-saffron mx-auto w-12 h-12 flex items-center justify-center bg-saffron/5 rounded-full mb-4">
                   <step.icon size={24} />
                </div>
                <h3 className="text-xl font-bold gold-text uppercase">{step.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-widest">{step.desc}</p>
             </div>
           ))}
        </section>

        {/* Writing Instructions */}
        <section className="premium-card p-10 md:p-16 bg-white/[0.02] border border-white/10 rounded-3xl space-y-12">
           <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="p-4 bg-saffron/10 rounded-2xl text-saffron">
                 <PenTool size={28} />
              </div>
              <div>
                 <h3 className="text-2xl font-bold uppercase tracking-widest gold-text">लेखन के नियम एवं विधि</h3>
                 <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">शारीरिक पुस्तिका हेतु अनिवार्य निर्देश</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <ul className="space-y-6">
                 {[
                   'शरीर, मन और वाणी की शुद्धता बनाए रखें।',
                   'एकाग्र चित्त होकर शांत और स्वच्छ स्थान पर बैठें।',
                   'लेखन के समय "राम" नाम का मानसिक स्मरण/जप करते रहें।',
                   'केवल संस्थान द्वारा प्राप्त "सनातनी पेन" (लाल स्याही) का ही उपयोग करें।'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-4 text-sm font-bold text-white/60 tracking-wider">
                      <span className="text-saffron font-black">0{i+1}.</span>
                      {text}
                   </li>
                 ))}
              </ul>
              <ul className="space-y-6">
                 {[
                   'पुस्तिका के किसी भी पन्ने को मोड़ें, फाड़ें या गंदा न करें।',
                   'प्रतिदिन कम से कम एक पृष्ठ लेखन का अटूट संकल्प लें।',
                   'लेखन सत्र पूर्ण होने पर हाथ जोड़कर प्रभु राम से प्रार्थना करें।',
                   'पुस्तिका को सदैव घर के मंदिर या किसी पवित्र स्थान पर ही रखें।'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-4 text-sm font-bold text-white/60 tracking-wider">
                      <span className="text-saffron font-black">0{i+5}.</span>
                      {text}
                   </li>
                 ))}
              </ul>
           </div>
           
           <div className="p-8 bg-sacred-red/10 border border-sacred-red/20 rounded-2xl text-center">
              <p className="text-xs text-sacred-red font-black uppercase tracking-[0.2em]">"राम नाम के लिखने से ही जीवन का कल्याण संभव है।"</p>
           </div>
        </section>

        {/* Call to Action: Get Booklet */}
        <section className="text-center space-y-10 py-20 border-t border-white/5">
           <h2 className="text-3xl md:text-5xl font-black font-serif uppercase tracking-widest">अभी अपनी पुस्तिका मंगाएं</h2>
           <p className="text-white/40 text-sm max-w-2xl mx-auto font-bold uppercase tracking-widest">
              आप अपने घर पर कूरियर द्वारा भी "राम नाम अर्चना पुस्तिका" मंगवा सकते हैं।
           </p>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-6">
              <Link href="/branches" className="saffron-btn px-12 py-5 scale-110 flex items-center gap-3">
                 <MapPin size={18} /> निकटतम शाखा खोजें
              </Link>
              <button className="px-12 py-5 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center gap-3">
                 <Phone size={18} /> ऑनलाइन अनुरोध करें
              </button>
           </div>
        </section>

      </main>

      {/* Footer Info */}
      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-12 text-[10px] font-bold text-white/30 tracking-widest uppercase">
         <div className="flex items-center gap-3"><ShieldCheck className="text-saffron" size={16} /> 100% परंपरागत और प्रामाणिक</div>
         <div className="flex items-center gap-3"><Award className="text-saffron" size={16} /> हस्तलिपि लेखन का फल</div>
         <div className="flex items-center gap-3"><MapPin className="text-saffron" size={16} /> देशव्यापी वितरण</div>
      </footer>
      <Footer />
    </div>
  );
}
