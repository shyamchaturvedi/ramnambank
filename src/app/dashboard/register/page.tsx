"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { UserPlus, Save, ShieldCheck, MapPin, QrCode, CreditCard } from 'lucide-react';

export default function MemberRegistration() {
  const [membership, setMembership] = useState<'REGULAR' | 'LIFE'>('REGULAR');

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black font-serif uppercase gold-text text-white">नवीन भक्त पंजीकरण</h2>
            <p className="text-white/40 text-sm mt-1">वैश्विक राम नाम नेटवर्क में नए सदस्य को जोड़ें।</p>
          </div>
          <div className="flex gap-4">
             <button className="saffron-btn flex items-center gap-3 text-xs">
                <Save size={18} />
                पंजीकरण पूर्ण करें
             </button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="premium-card p-10 space-y-8">
              <div className="flex items-center gap-3 text-saffron">
                <UserPlus size={20} />
                <h3 className="font-bold tracking-widest uppercase text-[10px]">व्यक्तिगत विवरण</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">पूर्ण नाम</label>
                  <input type="text" placeholder="भक्त का नाम" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white transition-all text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">मोबाइल नंबर</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white transition-all text-sm" />
                </div>
              </div>
            </section>

            <section className="premium-card p-10 space-y-8">
              <div className="flex items-center gap-3 text-saffron">
                <MapPin size={20} />
                <h3 className="font-bold tracking-widest uppercase text-[10px]">स्थान विवरण</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">राज्य</label>
                  <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white transition-all appearance-none text-sm">
                    <option className="bg-black">राज्य चुनें</option>
                    <option className="bg-black">उत्तर प्रदेश</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">जिला</label>
                  <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white appearance-none transition-all text-sm">
                    <option className="bg-black">जिला चुनें</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">ब्लॉक / तहसील</label>
                  <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white appearance-none transition-all text-sm">
                    <option className="bg-black">ब्लॉक चुनें</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Dynamic Payment Section */}
            {membership === 'LIFE' && (
              <section className="premium-card p-10 space-y-8 border-2 border-saffron/30 animate-fade-in bg-saffron/[0.02]">
                <div className="flex items-center gap-4 text-saffron">
                  <CreditCard size={24} />
                  <h3 className="font-bold tracking-widest uppercase text-[10px]">आजीवन सदस्यता पेमेंट (₹1100/-)</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-48 h-48 bg-white p-2 rounded-2xl shrink-0">
                    {/* Placeholder for QR Code */}
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                       <QrCode size={40} className="text-gray-400" />
                       <span className="text-[8px] text-gray-500 mt-2 font-bold uppercase">Scan to Pay</span>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1">
                     <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">UPI ID:</p>
                        <p className="text-xl font-bold gold-text">ramnam@upi</p>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">पेमेंट ट्रांजेक्शन ID (UTR)</label>
                        <input type="text" placeholder="12-अंकों का UTR नंबर दर्ज करें" className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl outline-none focus:border-saffron text-white text-sm" />
                        <p className="text-[9px] text-saffron font-bold uppercase tracking-widest italic">*वेरिफिकेशन के बाद आपका आजीवन कार्ड एक्टिव होगा।</p>
                     </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Photo & Membership */}
          <div className="space-y-8">
            <section className="premium-card p-10 text-center space-y-6">
              <div className="w-32 h-32 rounded-full border-4 border-white/5 bg-white/5 mx-auto flex items-center justify-center overflow-hidden relative group">
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span className="text-[10px] font-bold">फोटो अपलोड</span>
                 </div>
                 <UserPlus size={40} className="text-white/10" />
              </div>
              <h4 className="font-bold text-sm">भक्त की फोटो</h4>
            </section>

            <section className="premium-card p-10 space-y-6">
              <div className="flex items-center gap-3 text-saffron">
                <ShieldCheck size={20} />
                <h3 className="font-bold tracking-widest uppercase text-[10px]">सदस्यता का प्रकार</h3>
              </div>
              <div className="space-y-4">
                <label 
                  onClick={() => setMembership('REGULAR')}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${membership === 'REGULAR' ? 'bg-saffron/10 border-saffron shadow-[0_0_20px_rgba(255,153,51,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <input type="radio" name="membership" className="w-5 h-5 accent-saffron" checked={membership === 'REGULAR'} readOnly />
                   <div>
                      <p className="font-bold text-sm">साधारण सदस्य</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">निःशुल्क</p>
                   </div>
                </label>
                <label 
                  onClick={() => setMembership('LIFE')}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${membership === 'LIFE' ? 'bg-saffron/10 border-saffron shadow-[0_0_20px_rgba(255,153,51,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <input type="radio" name="membership" className="w-5 h-5 accent-saffron" checked={membership === 'LIFE'} readOnly />
                   <div>
                      <p className="font-bold text-sm gold-text">आजीवन सदस्य</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">₹1100/- सशुल्क</p>
                   </div>
                </label>
              </div>
            </section>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
