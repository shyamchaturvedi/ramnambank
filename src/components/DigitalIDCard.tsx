"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Shield, QrCode, Download, Share2, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface IDCardProps {
  user: {
    name: string;
    role: string;
    id: string;
    branch: string;
    photo?: string;
    membership_type?: string;
  };
  showActions?: boolean;
}

export default function DigitalIDCard({ user, showActions = true }: IDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayId = user.id?.length > 15 ? user.id.substring(0, 12).toUpperCase() : (user.id || 'RN-2026-XXXX');
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RB';
  const roleTitle = user.membership_type === 'SPECIAL_LIFE' ? 'विशेष आजीवन सदस्य' : 
                    user.membership_type === 'LIFE' ? 'आजीवन सदस्य' : 
                    user.membership_type === 'BANK_LIFE' ? 'बैंक आजीवन सदस्य' : 
                    (user.role || 'राम नाम भक्त');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const html2canvas = (await import('html2canvas')).default;
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#0A0A0A'
        });
        const link = document.createElement('a');
        link.download = `Ram-Nam-Bank-Pass-${user.name.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Download error:', err);
      // Fallback print/download
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `🚩 जय श्री राम! \nमेरा 'श्री राम नाम महाधन संचय बैंक' का डिजिटल सदस्यता पास सक्रिय हो चुका है।\n\nभक्त का नाम: ${user.name}\nसदस्यता आईडी: ${user.id}\nशाखा: ${user.branch}\n\nआप भी राम नाम संचय परिवार से जुड़ें: ${window.location.origin}/open-account`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'श्री राम नाम बैंक सदस्यता पास',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      // Fallback: Copy to clipboard or open WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-[360px]">
      <div 
        ref={cardRef}
        className="relative w-full h-[540px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-saffron/30 bg-[#0A0A0A] group"
      >
        {/* Background Aura & Texture */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-saffron/25 via-saffron/10 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sacred-red/20 rounded-full blur-[80px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay"></div>
        </div>
        
        {/* Header with Logo */}
        <div className="relative z-10 pt-8 pb-3 text-center space-y-2">
           <div className="relative w-16 h-16 mx-auto bg-black/70 backdrop-blur-md rounded-full border border-saffron/40 shadow-[0_0_25px_rgba(245,158,11,0.4)] overflow-hidden flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-cover scale-125" priority />
           </div>
           <div className="px-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] gold-text leading-tight">विश्वस्तरीय श्री राम नाम महा धन संचय बैंक</h3>
              <p className="text-[7px] text-white/40 uppercase tracking-[0.3em] font-black mt-0.5">अयोध्या धाम मुख्यालय</p>
           </div>
        </div>

        {/* Profile Avatar & Badge */}
        <div className="relative z-10 px-6 text-center space-y-3">
           <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-saffron to-amber-500 rounded-[2rem] rotate-6 opacity-30 group-hover:rotate-12 transition-all duration-700"></div>
              <div className="relative w-full h-full rounded-[2rem] border-2 border-saffron/40 overflow-hidden bg-black/60 backdrop-blur-xl flex items-center justify-center text-2xl font-black text-saffron sacred-glow-soft">
                 {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-saffron text-black p-1.5 rounded-lg shadow-lg border border-black/30">
                 <Shield size={12} strokeWidth={3} />
              </div>
           </div>

           <div className="space-y-1">
              <h4 className="text-lg font-black text-white uppercase tracking-tight leading-snug">{user.name}</h4>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-saffron bg-saffron/10 px-3 py-0.5 rounded-full border border-saffron/20">
                  {roleTitle}
                </span>
              </div>
           </div>
        </div>

        {/* Details Grid */}
        <div className="relative z-10 mx-6 mt-4 p-4 rounded-[1.5rem] bg-white/[0.04] border border-white/10 backdrop-blur-md grid grid-cols-2 gap-3">
            <div className="space-y-1">
               <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">सदस्यता आईडी</p>
               <p className="text-[9px] font-mono font-bold text-saffron tracking-wider bg-black/40 px-2 py-1 rounded-lg border border-saffron/20 truncate">{displayId}</p>
            </div>
            <div className="space-y-1 text-right">
               <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">शाखा / जिला</p>
               <p className="text-[8px] font-black text-white/90 truncate uppercase tracking-widest pt-1">{user.branch || 'मुख्य शाखा'}</p>
            </div>
        </div>

        {/* Footer with Signature & QR Verification */}
        <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
           <div className="space-y-1">
              <div className="w-24 h-8 relative flex items-center justify-center -rotate-6">
                 <span className="font-serif italic text-xs text-saffron/80 tracking-tighter select-none font-black">Ram Nam Bank</span>
                 <svg className="absolute bottom-0 left-0 w-full h-4 text-saffron/40" viewBox="0 0 100 20">
                    <path d="M5,15 Q25,5 45,15 T95,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                 </svg>
              </div>
              <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">अधिकृत हस्ताक्षर</p>
           </div>
           
           <div className="relative">
              <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-2xl flex items-center justify-center">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `Ram Nam Bank Pass\nName: ${user.name}\nID: ${user.id}\nStatus: VERIFIED & ACTIVE`
                    )}`} 
                    alt="Pass QR Code"
                    className="w-full h-full object-contain"
                 />
              </div>
           </div>
        </div>

        {/* Golden Outline Border */}
        <div className="absolute inset-0 border-2 border-saffron/20 pointer-events-none rounded-[3rem]"></div>
      </div>

      {/* Action Buttons: Download and Share */}
      {showActions && (
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-3.5 px-4 bg-saffron text-black font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-[0_10px_20px_rgba(245,158,11,0.3)] active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            पास डाउनलोड करें
          </button>
          <button 
            onClick={handleShare}
            className="py-3.5 px-5 bg-green-500/20 text-green-400 border border-green-500/30 font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 hover:text-black transition-all shadow-lg active:scale-95"
            title="WhatsApp पर शेयर करें"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'कॉपी हुआ' : 'शेयर'}
          </button>
        </div>
      )}
    </div>
  );
}
