"use client";

import React from 'react';
import Image from 'next/image';
import { Shield, QrCode, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface IDCardProps {
  user: {
    name: string;
    role: string;
    id: string;
    branch: string;
    photo?: string;
  }
}

export default function DigitalIDCard({ user }: IDCardProps) {
  const displayId = user.id.length > 10 ? user.id.substring(0, 8).toUpperCase() : user.id;
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-[350px] h-[540px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-[#0A0A0A] group"
    >
      {/* ... (background remains the same) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-saffron/20 via-saffron/5 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sacred-red/10 rounded-full blur-[80px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      {/* Header with Logo */}
      <div className="relative z-10 pt-8 pb-4 text-center space-y-2">
         <div className="relative w-16 h-16 mx-auto bg-black/60 backdrop-blur-md rounded-full border border-saffron/30 shadow-[0_0_20px_rgba(245,158,11,0.3)] overflow-hidden">
            <Image src="/logo.png" alt="Logo" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover scale-125" />
         </div>
         <div className="px-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] gold-text leading-tight">श्री राम नाम महाधन संचय बैंक</h3>
            <p className="text-[6px] text-white/30 uppercase tracking-[0.3em] font-black mt-0.5">अयोध्या धाम | उत्तर प्रदेश</p>
         </div>
      </div>

      {/* Profile Section - Slightly Smaller */}
      <div className="relative z-10 px-8 text-center space-y-4">
         <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron to-sacred-red rounded-[2.2rem] rotate-6 opacity-20 group-hover:rotate-12 transition-all duration-700"></div>
            <div className="relative w-full h-full rounded-[2.2rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-xl flex items-center justify-center text-2xl font-black text-saffron sacred-glow-soft">
               {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-saffron text-black p-1.5 rounded-lg shadow-lg border border-black/20">
               <Shield size={12} strokeWidth={3} />
            </div>
         </div>

         <div className="space-y-1">
            <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{user.name}</h4>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-3 bg-saffron/20"></div>
              <span className="text-[7px] font-black uppercase tracking-[0.25em] text-saffron/70">
                {user.role}
              </span>
              <div className="h-[1px] w-3 bg-saffron/20"></div>
            </div>
         </div>
      </div>

      {/* Details Grid - More Compact */}
      <div className="relative z-10 mx-8 mt-6 p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-sm grid grid-cols-2 gap-4">
          <div className="space-y-1">
             <p className="text-[6px] font-black text-white/20 uppercase tracking-widest">सदस्यता आईडी</p>
             <p className="text-[9px] font-mono font-bold text-white/90 tracking-wider bg-white/5 px-2 py-0.5 rounded-lg inline-block">{displayId}</p>
          </div>
          <div className="space-y-1 text-right">
             <p className="text-[6px] font-black text-white/20 uppercase tracking-widest">शाखा</p>
             <p className="text-[8px] font-black text-white/80 truncate uppercase tracking-widest">{user.branch}</p>
          </div>
      </div>

      {/* Footer / QR Code / Sign */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
         <div className="space-y-3">
            <div className="w-24 h-10 relative">
               {/* Handwritten Style Signature */}
               <div className="absolute inset-0 flex items-center justify-center -rotate-6">
                  <span className="font-serif italic text-sm text-saffron/60 tracking-tighter select-none font-bold">Ram Nam Bank</span>
               </div>
               {/* Thicker Signature Line */}
               <svg className="absolute bottom-0 left-0 w-full h-6 text-saffron/40" viewBox="0 0 100 20">
                  <path d="M5,15 Q25,5 45,15 T95,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
               </svg>
            </div>
            <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">अधिकृत हस्ताक्षर</p>
         </div>
         
         <div className="relative group/qr">
            <div className="absolute -inset-3 bg-saffron/20 rounded-2xl blur-xl opacity-0 group-hover/qr:opacity-100 transition-all"></div>
            <div className="relative w-14 h-14 bg-white p-1 rounded-xl shadow-2xl transform group-hover/qr:scale-105 transition-all flex items-center justify-center">
               <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    `Name: ${user.name}\nID: ${user.id}\nRole: ${user.role}\nBranch: ${user.branch}`
                  )}`} 
                  alt="QR Code"
                  className="w-full h-full object-contain"
               />
            </div>
         </div>
      </div>

      {/* Premium Polish */}
      <div className="absolute inset-0 border-[10px] border-black pointer-events-none opacity-20"></div>
    </motion.div>
  );
}
