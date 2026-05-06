"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  Award, 
  ShieldCheck,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function DigitalWriting() {
  const [count, setCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sound effect simulation
  const playBell = () => {
    if (!isMuted) {
      // In a real app, play a subtle temple bell sound
      console.log('Ding!');
    }
  };

  const handleWrite = () => {
    setCount(prev => prev + 1);
    setSessionCount(prev => prev + 1);
    playBell();
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSessionCount(0);
      alert('आपका संचय सफलतापूर्वक मुख्य खाते में जमा कर दिया गया है। जय श्री राम!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-saffron selection:text-black flex flex-col">
      {/* Header */}
      <nav className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
        <Link href="/member" className="flex items-center gap-3 text-white/40 hover:text-saffron transition-colors">
          <ArrowLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस पासबुक पर</span>
        </Link>
        <div className="text-center">
           <h1 className="text-xl font-bold font-serif gold-text">डिजिटल राम नाम लेखन</h1>
           <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">परम शांति का अनुभव</p>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/5 rounded-xl text-saffron">
           {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-12 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Stats Display */}
        <div className="flex gap-12 text-center animate-fade-in">
           <div>
              <p className="text-4xl md:text-7xl font-mono font-black gold-text">{count}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2">कुल संचित</p>
           </div>
           <div className="w-[1px] bg-white/10"></div>
           <div>
              <p className="text-4xl md:text-7xl font-mono font-black text-white">{sessionCount}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2">वर्तमान सत्र</p>
           </div>
        </div>

        {/* Writing Area */}
        <div className="relative group cursor-pointer" onClick={handleWrite}>
           <div className="absolute inset-0 bg-gradient-to-br from-saffron to-sacred-red blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
           <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-saffron/20 flex items-center justify-center bg-black shadow-2xl transition-transform active:scale-95 group-hover:border-saffron/40">
              <span className="text-6xl md:text-8xl font-black gold-text">राम</span>
           </div>
           <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">लिखने के लिए टैप करें</p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-6 mt-12">
           <button 
             onClick={handleSave}
             disabled={sessionCount === 0 || isSaving}
             className="px-12 py-5 bg-gradient-to-r from-saffron to-sacred-red rounded-2xl font-black text-xs tracking-widest uppercase shadow-2xl shadow-saffron/20 disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-3"
           >
              {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
              खाते में जमा करें
           </button>
           <button 
             onClick={() => setSessionCount(0)}
             className="px-8 py-5 border border-white/10 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition-all"
           >
              रिसेट
           </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-12 text-[10px] font-bold text-white/30 tracking-widest uppercase">
         <div className="flex items-center gap-3"><ShieldCheck className="text-saffron" size={16} /> 100% सुरक्षित और आध्यात्मिक</div>
         <div className="flex items-center gap-3"><Award className="text-saffron" size={16} /> मंत्र जप का फल</div>
         <div className="flex items-center gap-3"><Music className="text-saffron" size={16} /> सात्विक वातावरण</div>
      </footer>
    </div>
  );
}
