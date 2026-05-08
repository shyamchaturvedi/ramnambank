"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Play, 
  Camera, 
  Share2, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Award,
  FileText,
  Info
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-20 overflow-hidden">
      {/* Subtle Background Texture/Image */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-150">
         <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-bottom"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20">
          
          {/* Useful Links */}
          <div className="space-y-8">
            <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">उपयोगी लिंक्स</h4>
            <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2">हमारे बारे में <ExternalLink size={12} /></Link></li>
              <li><Link href="/mission" className="hover:text-white transition-colors flex items-center gap-2">हमारा संकल्प <ExternalLink size={12} /></Link></li>
              <li><Link href="/progress" className="hover:text-white transition-colors flex items-center gap-2">वैश्विक प्रगति <ExternalLink size={12} /></Link></li>
              <li><Link href="/branches" className="hover:text-white transition-colors flex items-center gap-2">शाखा खोजें <ExternalLink size={12} /></Link></li>
              <li><Link href="/donate" className="hover:text-white transition-colors flex items-center gap-2 text-sacred-red">दान एवं सेवा <ExternalLink size={12} /></Link></li>
            </ul>
          </div>

          {/* Administration */}
          <div className="space-y-8">
            <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">प्रशासन</h4>
            <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
              <li><Link href="/login" className="hover:text-white transition-colors flex items-center gap-2">प्रशासनिक लॉगिन</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-2">डैशबोर्ड एक्सेस</Link></li>
              <li><Link href="/progress" className="hover:text-white transition-colors flex items-center gap-2">वार्षिक रिपोर्ट</Link></li>
              <li><Link href="/open-account" className="hover:text-white transition-colors flex items-center gap-2">नवीन सदस्यता</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-8 lg:col-span-1">
            <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">संपर्क करें</h4>
            <div className="space-y-6 text-xs font-bold text-white/40 uppercase tracking-widest">
              <div className="flex items-start gap-4">
                 <MapPin size={18} className="text-saffron shrink-0" />
                 <p className="leading-loose">श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान,<br /> अयोध्या धाम, उत्तर प्रदेश - 224123</p>
              </div>
              <div className="flex items-center gap-4">
                 <Phone size={18} className="text-saffron shrink-0" />
                 <p>+91 99XXXXXX00</p>
              </div>
              <div className="flex items-center gap-4">
                 <Mail size={18} className="text-saffron shrink-0" />
                 <p className="lowercase tracking-normal">contact@ramnambank.in</p>
              </div>
            </div>
          </div>

          {/* Social Media & Badge */}
          <div className="space-y-10">
            <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">जुड़ें हमसे</h4>
            <div className="flex gap-4">
               {[Globe, Play, Share2, Camera].map((Icon, i) => (
                 <Link key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-saffron hover:bg-saffron/10 transition-all border border-white/5">
                    <Icon size={20} />
                 </Link>
               ))}
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-saffron/10 to-transparent border border-saffron/20 flex items-center gap-4">
               <Award className="text-saffron" size={24} />
               <p className="text-[9px] font-black uppercase tracking-widest text-white/60">भारत का सबसे बड़ा <br /> राम नाम आध्यात्मिक बैंक</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-saffron/20 shadow-lg sacred-glow">
                 <Image src="/logo.png" alt="Logo" fill className="object-cover" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] gold-text leading-none">श्री राम नाम महाधन संचय बैंक</p>
                 <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-bold mt-2">अयोध्या धाम | सर्वाधिकार सुरक्षित © 2026</p>
              </div>
           </div>

           <div className="text-center md:text-right space-y-2">
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest leading-relaxed max-w-md">
                 डिस्क्लेमर: यह श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान की आधिकारिक वेबसाइट है। सभी आध्यात्मिक संचय भक्तों की श्रद्धा पर आधारित हैं।
              </p>
           </div>

           <button 
             onClick={scrollToTop}
             className="w-12 h-12 rounded-full bg-saffron text-black flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-saffron/20 group"
           >
              <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </div>
    </footer>
  );
}
