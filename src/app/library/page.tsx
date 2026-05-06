"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  BookOpen, 
  Camera, 
  Play, 
  Download, 
  Share2,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const libraryItems = [
  { id: 1, title: 'श्री हनुमान चालीसा', author: 'गोस्वामी तुलसीदास', category: 'स्तोत्र' },
  { id: 2, title: 'श्री राम रक्षा स्तोत्र', author: 'बुधकौशिक ऋषि', category: 'कवच' },
  { id: 3, title: 'राम नाम महिमा', author: 'संस्थान संकलन', category: 'ज्ञान' },
  { id: 4, title: 'आध्यात्मिक डायरी', author: 'भक्तों के लिए', category: 'अभ्यास' },
];

const galleryImages = [
  { id: 1, title: 'राम लल्ला दर्शन', url: 'https://images.unsplash.com/photo-1624456113123-0105374e2d35?q=80&w=2070' },
  { id: 2, title: 'अयोध्या भव्य आरती', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076' },
  { id: 3, title: 'सरयू तट संध्या', url: 'https://images.unsplash.com/photo-1590050752117-23aae33a281a?q=80&w=2074' },
];

export default function SpiritualLibrary() {
  const [activeTab, setActiveTab] = useState<'TEXTS' | 'GALLERY'>('TEXTS');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-saffron hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">मुख्य पृष्ठ</span>
          </Link>
          <div className="text-xl font-bold font-serif gold-text">आध्यात्मिक पुस्तकालय एवं दर्शन</div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('TEXTS')}
              className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all ${activeTab === 'TEXTS' ? 'bg-saffron text-black' : 'text-white/40 hover:text-white'}`}
            >
              साहित्य
            </button>
            <button 
              onClick={() => setActiveTab('GALLERY')}
              className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all ${activeTab === 'GALLERY' ? 'bg-saffron text-black' : 'text-white/40 hover:text-white'}`}
            >
              दर्शन
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'TEXTS' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {libraryItems.map((item) => (
                <div key={item.id} className="premium-card p-10 flex gap-8 group hover:border-saffron/30 transition-all cursor-pointer">
                  <div className="w-24 h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/20 group-hover:text-saffron group-hover:bg-saffron/5 transition-all">
                    <BookOpen size={40} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-saffron uppercase tracking-widest">{item.category}</span>
                       <button className="text-white/20 hover:text-white"><Share2 size={16} /></button>
                    </div>
                    <h3 className="text-2xl font-bold font-serif group-hover:gold-text transition-all">{item.title}</h3>
                    <p className="text-white/30 text-sm italic">रचयिता: {item.author}</p>
                    <button className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white uppercase tracking-widest pt-4">
                       अभी पढ़ें <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
              {galleryImages.map((img) => (
                <div key={img.id} className="premium-card overflow-hidden group cursor-pointer">
                  <div className="relative h-64 w-full">
                    <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-48px)]">
                       <p className="font-bold text-lg">{img.title}</p>
                       <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={18} />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Daily Darshan Live Stream Placeholder */}
              <div className="md:col-span-3 premium-card p-1 pb-1 flex flex-col overflow-hidden relative h-[500px] group">
                 <div className="absolute top-8 left-8 z-10 flex items-center gap-3 px-4 py-2 bg-red-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    Live Darshan
                 </div>
                 <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-saffron flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,153,51,0.5)]">
                       <Play size={48} className="ml-2" />
                    </div>
                    <p className="text-xl font-bold font-serif gold-text tracking-widest uppercase">अयोध्या धाम लाइव आरती</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quick Footer Stats */}
      <footer className="mt-auto border-t border-white/5 p-10 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
               <span className="flex items-center gap-2"><Camera size={16} /> 1.2K+ दर्शन फोटो</span>
               <span className="flex items-center gap-2"><BookOpen size={16} /> 50+ आध्यात्मिक ग्रंथ</span>
            </div>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">पूरा पुस्तकालय देखें</button>
         </div>
      </footer>
    </div>
  );
}
