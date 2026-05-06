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
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-[380px] h-[550px] rounded-[2.5rem] overflow-hidden sacred-glow border border-saffron/30 bg-black group"
    >
      {/* Golden Patterns Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] bg-repeat"></div>
      </div>
      
      {/* Card Header */}
      <div className="relative z-10 bg-gradient-to-b from-saffron/20 to-transparent p-10 text-center space-y-4">
         <div className="relative w-16 h-16 mx-auto rounded-xl overflow-hidden border border-saffron/30">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
         </div>
         <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] gold-text">श्री राम नाम महाधन संचय बैंक</h3>
            <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-bold">अयोध्या धाम</p>
         </div>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 px-10 -mt-4 text-center space-y-6">
         <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron to-sacred-red rounded-[2rem] rotate-6 opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full rounded-[2rem] border-2 border-saffron/50 overflow-hidden bg-white/5 flex items-center justify-center text-4xl font-black text-saffron">
               {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-saffron text-black p-2 rounded-xl shadow-lg border border-black">
               <Shield size={16} />
            </div>
         </div>

         <div className="space-y-1">
            <h4 className="text-2xl font-black gold-text uppercase tracking-tight">{user.name}</h4>
            <span className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-saffron">
               {user.role}
            </span>
         </div>
      </div>

      {/* Details Grid */}
      <div className="relative z-10 px-10 pt-8 grid grid-cols-2 gap-6 border-t border-white/5 mt-8 mx-6">
         <div className="space-y-1">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">सदस्यता आईडी</p>
            <p className="text-[10px] font-mono font-bold text-white/80 tracking-tighter">{user.id}</p>
         </div>
         <div className="space-y-1 text-right">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">शाखा</p>
            <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{user.branch}</p>
         </div>
      </div>

      {/* Footer / QR Code */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end bg-gradient-to-t from-white/5 to-transparent">
         <div className="space-y-1">
            <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">अधिकृत हस्ताक्षर</p>
            <div className="w-20 h-8 border-b border-white/10 opacity-30 italic text-[10px] text-white/40">Bank Manager</div>
         </div>
         <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-xl">
            <QrCode className="w-full h-full text-black" />
         </div>
      </div>

      {/* Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 group-hover:opacity-30 transition-all pointer-events-none"></div>
    </motion.div>
  );
}
