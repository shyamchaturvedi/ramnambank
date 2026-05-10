"use client";

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ExternalLink, 
  IndianRupee, 
  MessageCircle, 
  Phone, 
  QrCode, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Layers,
  Settings,
  LayoutDashboard,
  Users,
  Box,
  FileSearch
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ClientReviewPage() {
  const categories = [
    {
      title: "सार्वजनिक पोर्टल (Public Access)",
      icon: <Layers size={20} className="text-saffron" />,
      pages: [
        { name: 'मुख्य पृष्ठ (Home)', path: '/' },
        { name: 'हमारे बारे में (About)', path: '/about' },
        { name: 'सेवा एवं दान (Donate)', path: '/donate' },
        { name: 'खाता खोलें (Register)', path: '/open-account' },
        { name: 'लॉगिन (Login)', path: '/login' },
      ]
    },
    {
      title: "एडमिन कंट्रोल (Admin & Management)",
      icon: <Settings size={20} className="text-red-500" />,
      pages: [
        { name: 'यूजर मैनेजमेंट (Roles/Block)', path: '/dashboard/admin/users' },
        { name: 'दान प्रबंधन (UTR/Cash Approval)', path: '/dashboard/admin/donations' },
        { name: 'आध्यात्मिक लेजर (Master Reports)', path: '/dashboard/devotee/ledger' },
        { name: 'मास्टर सेटिंग्स (UPI/Social)', path: '/dashboard/admin/settings' },
      ]
    },
    {
      title: "शाखा एवं वॉलिंटियर टूल (Staff Tools)",
      icon: <LayoutDashboard size={20} className="text-blue-500" />,
      pages: [
        { name: 'शाखा इन्वेंटरी (Stock Tracking)', path: '/dashboard/branch/inventory' },
        { name: 'पुस्तिका सत्यापन (Verification)', path: '/dashboard/volunteer/verify' },
        { name: 'भक्त प्रोफाइल (ID Card/Progress)', path: '/dashboard/devotee/profile' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-saffron selection:text-black">
      {/* Header */}
      <nav className="p-8 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                 <ShieldCheck size={24} />
              </div>
              <h1 className="text-xl font-black gold-text uppercase tracking-widest">प्रोजेक्ट हैंडओवर पोर्टल</h1>
           </div>
           <div className="hidden md:flex items-center gap-6">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status: Ready for Delivery</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           </div>
        </div>
      </nav>

      <main className="py-20 px-6 max-w-6xl mx-auto space-y-24">
        {/* Welcome Section */}
        <section className="text-center space-y-6">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-black font-serif gold-text leading-tight"
           >
              नमस्ते! आपका आध्यात्मिक <br /> पोर्टल तैयार है।
           </motion.h2>
           <p className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed uppercase tracking-widest font-bold">
              श्री राम नाम महाधन संचय बैंक पोर्टल का कार्य पूर्ण गुणवत्ता के साथ पूरा किया गया है। नीचे सभी पोर्टल्स और उनके लिंक्स दिए गए हैं।
           </p>
        </section>

        {/* Grouped Links */}
        <section className="space-y-16">
           {categories.map((cat, idx) => (
             <div key={idx} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                   <div className="p-2 rounded-lg bg-white/5">{cat.icon}</div>
                   <h3 className="text-xl font-bold uppercase tracking-widest">{cat.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {cat.pages.map((page, pIdx) => (
                     <Link key={pIdx} href={page.path} className="premium-card p-6 flex justify-between items-center group hover:bg-white/5 transition-all border border-white/5 shadow-lg">
                        <span className="font-bold text-xs tracking-wide uppercase">{page.name}</span>
                        <ExternalLink size={14} className="text-white/20 group-hover:text-saffron transition-all" />
                     </Link>
                   ))}
                </div>
             </div>
           ))}
        </section>

        {/* Detailed Project Guide */}
        <section className="premium-card p-12 bg-white/[0.02] border border-white/5 space-y-10">
           <div className="flex items-center gap-4">
              <Info size={24} className="text-saffron" />
              <h3 className="text-2xl font-black font-serif gold-text uppercase">प्रोजेक्ट की कार्यप्रणाली (Project Guide)</h3>
           </div>
           <div className="space-y-8 text-sm text-white/60 leading-relaxed font-bold uppercase tracking-widest">
              <div className="space-y-4">
                 <h4 className="text-white text-base">1. आध्यात्मिक बैंकिंग चक्र (The Spiritual Cycle)</h4>
                 <p>यह पोर्टल 'राम नाम' संचय के लिए एक व्यवस्थित बैंक की तरह काम करता है। भक्त वेबसाइट पर रजिस्टर करता है, उसे एक यूनिक सदस्यता आईडी (RN-ID) मिलती है। वह शाखा से भौतिक पुस्तिका (Copy) और विशेष कलम लेता है, राम नाम लिखता है और उसे वापस जमा करता है।</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-white text-base">2. एडमिन और स्टाफ का रोल (Admin & Staff Roles)</h4>
                 <p>एडमिन पूरे भारत की सभी शाखाओं, इन्वेंटरी और डोनेशन को कंट्रोल करता है। शाखा प्रबंधक अपनी शाखा के भक्तों और स्टॉक को मैनेज करता है। वॉलिंटियर केवल कॉपियों के वितरण और जमा करने की डेटा एंट्री करता है।</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-white text-base">3. पारदर्शिता और सुरक्षा (Transparency & Security)</h4>
                 <p>हर भक्त का अपना डैशबोर्ड है जहाँ वह अपनी प्रगति, आईडी कार्ड और डोनेशन स्लिप देख सकता है। एडमिन द्वारा UTR नंबर के सत्यापन के बाद ही रसीद जेनरेट होती है, जिससे डेटा पूरी तरह सुरक्षित रहता है।</p>
              </div>
           </div>
        </section>

        {/* Payment Section with REAL QR */}
        <section className="premium-card p-12 md:p-20 bg-saffron/5 border-2 border-saffron/20 space-y-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
           
           <div className="text-center space-y-4">
              <h3 className="text-4xl font-black font-serif gold-text uppercase">प्रोजेक्ट डिलीवरी पेमेंट</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Final Settlement for Project Handover</p>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="space-y-10 flex-1">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">कुल देय राशि (Total Final Payment)</p>
                    <p className="text-6xl font-black gold-text">₹7,985 <span className="text-sm text-white/20">INR</span></p>
                 </div>
                 
                 <div className="p-8 bg-black/60 border border-white/10 rounded-3xl space-y-4 shadow-2xl">
                    <div className="flex items-center gap-6">
                       <div className="p-3 bg-saffron/10 rounded-xl text-saffron">
                          <IndianRupee size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">UPI ID</p>
                          <p className="text-xl font-mono font-bold text-white/90">9598023701@ybl</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck size={20} /> भुगतान के बाद आपका प्रोजेक्ट तुरंत लाइव किया जाएगा।
                 </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-center gap-8">
                 <div className="relative group">
                    <div className="absolute -inset-4 bg-saffron/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-all"></div>
                    <div className="relative w-72 h-72 bg-white p-4 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white">
                       <img 
                         src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=9598023701@ybl%26pn=Admin%26am=7985%26cu=INR" 
                         alt="UPI QR Code" 
                         className="w-full h-full"
                       />
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-[10px] font-black text-saffron uppercase tracking-[0.4em] animate-pulse">Scan & Pay ₹7,985</p>
                    <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Supports All UPI Apps (PhonePe, GPay, Paytm)</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Contact Support */}
        <section className="text-center space-y-10">
           <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-widest">कोई प्रश्न? एडमिन से बात करें</h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Technical Support & Handover</p>
           </div>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="tel:9598023701" className="flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-xl">
                 <Phone size={20} className="text-saffron" />
                 <span className="font-bold tracking-widest">9598023701</span>
              </a>
              <a href="https://wa.me/9598023701" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-10 py-5 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500 hover:text-white transition-all text-green-500 group shadow-xl">
                 <MessageCircle size={20} />
                 <span className="font-bold tracking-widest uppercase">WhatsApp Handover</span>
              </a>
           </div>
        </section>
      </main>

      <footer className="py-16 text-center border-t border-white/5 bg-white/[0.01]">
         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em]">Final Delivery Version 1.0 - Antigravity AI</p>
      </footer>
    </div>
  );
}
