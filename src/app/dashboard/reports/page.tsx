"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart3, TrendingUp, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-center">
           <div className="space-y-1">
              <h2 className="text-3xl font-black font-serif gold-text uppercase">रिपोर्ट्स एवं विश्लेषण</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Comprehensive Spiritual & Financial Data</p>
           </div>
           <button className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all">
              <Download size={16} /> एक्सपोर्ट PDF
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="premium-card p-8 border-l-4 border-saffron">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">इस माह का संचय</p>
              <h3 className="text-3xl font-black gold-text">45.8 Cr</h3>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold mt-4">
                 <ArrowUpRight size={14} /> +12% पिछले माह से
              </div>
           </div>
           <div className="premium-card p-8 border-l-4 border-sacred-red">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">कुल दान संचय</p>
              <h3 className="text-3xl font-black gold-text">₹12.5L</h3>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold mt-4">
                 <ArrowUpRight size={14} /> +5% लक्ष्य से ऊपर
              </div>
           </div>
           <div className="premium-card p-8 border-l-4 border-blue-500">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">सक्रिय शाखाएं</p>
              <h3 className="text-3xl font-black gold-text">450</h3>
              <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold mt-4">
                 स्थिर प्रगति पर
              </div>
           </div>
        </div>

        <div className="premium-card p-12 text-center space-y-6 bg-white/[0.01]">
           <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-saffron">
              <BarChart3 size={40} />
           </div>
           <h4 className="text-xl font-bold uppercase tracking-widest">विस्तृत ग्राफ लोड हो रहा है...</h4>
           <p className="text-white/40 text-sm max-w-md mx-auto">हम आपके लिए रियल-टाइम आध्यात्मिक डेटा तैयार कर रहे हैं। पूर्ण रिपोर्ट देखने के लिए शाखा अनुसार चयन करें।</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
