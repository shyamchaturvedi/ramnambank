"use client";

import React from 'react';

import { CheckCircle2, Search, BookOpen, AlertCircle, ArrowRight, Package, Download } from 'lucide-react';

export default function VolunteerVerifyPage() {
  return (
    <div className="space-y-8 pb-20">
        <div className="space-y-1">
           <h2 className="text-3xl font-black font-serif gold-text uppercase">पुस्तिका सत्यापन</h2>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Verify physical booklets and approve entries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Section 1: Distribution (Issue) */}
           <div className="premium-card p-10 space-y-8 border-t-4 border-blue-500">
              <div className="flex items-center gap-4 text-blue-500">
                 <Package size={24} />
                 <h3 className="text-xl font-black uppercase tracking-widest">वितरण (Issue Copy/Pen)</h3>
              </div>
              <div className="space-y-4">
                 <input type="text" placeholder="भक्त की सदस्यता ID (RN-ID)..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs font-mono" />
                 
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">पुस्तिका का प्रकार (Type & Value)</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold text-saffron">
                       <option value="5000">छोटी पुस्तिका (5,000 राम नाम)</option>
                       <option value="10000">मध्यम पुस्तिका (10,000 राम नाम)</option>
                       <option value="21000">बड़ी पुस्तिका (21,000 राम नाम)</option>
                       <option value="custom">अन्य (Custom Value)</option>
                    </select>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-white/40 uppercase">पेन शामिल करें?</span>
                       <input type="checkbox" className="w-5 h-5 accent-saffron" defaultChecked />
                    </div>
                 </div>

                 <button className="w-full bg-blue-500/10 text-blue-500 border border-blue-500/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                    पुस्तिका जारी करें (Issue)
                 </button>
              </div>
           </div>

           {/* Section 2: Collection (Return) */}
           <div className="premium-card p-10 space-y-8 border-t-4 border-green-500">
              <div className="flex items-center gap-4 text-green-500">
                 <Download size={24} />
                 <h3 className="text-xl font-black uppercase tracking-widest">संग्रह (Submit & Credit)</h3>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">पुस्तिका सीरियल नंबर</label>
                    <input type="text" placeholder="RN-XXXX-XXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs font-mono" />
                 </div>
                 
                 <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl">
                    <p className="text-[10px] text-white/60 leading-relaxed font-bold uppercase tracking-widest">
                       सिस्टम इस कॉपी की वैल्यू (जैसे 10,000) अपने आप पहचान लेगा और सबमिट करते ही भक्त के खाते में क्रेडिट कर देगा।
                    </p>
                 </div>

                 <button className="w-full bg-green-500/10 text-green-500 border border-green-500/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl">
                    पुस्तिका जमा करें (Auto-Credit)
                 </button>
              </div>
           </div>
        </div>

           {/* Recent Verifications */}
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">हालिया सत्यापन (Recent)</h4>
              {[
                { id: 'RN-8821', user: 'अमित कुमार', names: '10,000', time: '10 min ago' },
                { id: 'RN-8819', user: 'सुनील सिंह', names: '5,000', time: '2 hours ago' },
              ].map((v, i) => (
                <div key={i} className="premium-card p-6 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-saffron">
                         <BookOpen size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-sm">{v.user}</p>
                         <p className="text-[10px] text-white/30 uppercase font-mono tracking-widest">{v.id}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-saffron">{v.names} नाम</p>
                      <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">{v.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
  );
}
