"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  MapPin, 
  User, 
  Hash, 
  ArrowLeft, 
  ShieldCheck, 
  Plus,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AddBranchPage() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    headId: '',
    level: 'BLOCK'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy list of users who can be assigned as Branch Head
  const availableHeads = [
    { id: 'usr-001', name: 'शांति स्वरूप दास' },
    { id: 'usr-002', name: 'रमेश चंद्र शास्त्री' },
    { id: 'usr-003', name: 'जगन मोहन महापात्र' },
    { id: 'usr-004', name: 'स्वामी चिन्मयानंद' },
    { id: 'usr-005', name: 'निर्मल रंजन स्वाइन' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('नई शाखा सफलतापूर्वक जोड़ी गई!');
      window.location.href = '/dashboard/branches';
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/branches" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
               <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-3xl font-black font-serif uppercase gold-text">नई शाखा जोड़ें</h2>
              <p className="text-white/40 text-sm mt-1">बैंक के नेटवर्क का विस्तार करें।</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-10 md:p-16 border-t-4 border-saffron"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side: General Info */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-black text-saffron uppercase tracking-[0.3em]">बुनियादी जानकारी</h3>
                  
                  {/* Branch Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">शाखा का नाम</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-all" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="जैसे: कटक मुख्य शाखा" 
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Branch Code */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">शाखा कोड (Unique Code)</label>
                    <div className="relative group">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-all" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="जैसे: OD/17" 
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-mono uppercase"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">पूरा पता</label>
                    <textarea 
                      required
                      placeholder="शाखा का पूरा पता दर्ज करें..." 
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm min-h-[120px] resize-none transition-all"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
               </div>
            </div>

            {/* Right Side: Admin Info */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-black text-saffron uppercase tracking-[0.3em]">प्रशासनिक विवरण</h3>

                  {/* Level Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">शाखा का स्तर</label>
                    <select 
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm appearance-none cursor-pointer"
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                    >
                      <option value="STATE">State (राज्य)</option>
                      <option value="DISTRICT">District (जिला)</option>
                      <option value="BLOCK">Block (ब्लॉक/तहसील)</option>
                    </select>
                  </div>
                  
                  {/* Branch Head Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">शाखा प्रबंधक चुनें (Branch Head)</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-all" size={18} />
                      <select 
                        required
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm appearance-none cursor-pointer"
                        value={formData.headId}
                        onChange={(e) => setFormData({...formData, headId: e.target.value})}
                      >
                        <option value="">प्रबंधक का चयन करें</option>
                        {availableHeads.map(head => (
                          <option key={head.id} value={head.id}>{head.name}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[9px] text-white/20 mt-2 ml-2 italic">* केवल वे ही यूजर्स दिखेंगे जिनके पास 'ADMIN' रोल है।</p>
                  </div>

                  <div className="p-6 bg-saffron/5 border border-saffron/10 rounded-2xl space-y-3">
                     <div className="flex items-center gap-3 text-saffron">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">एक्सेस कंट्रोल</span>
                     </div>
                     <p className="text-[10px] text-white/40 leading-relaxed font-medium">चयनित प्रबंधक अपनी लॉगिन आईडी का उपयोग करके इस शाखा के सभी भक्तों और पुस्तिकाओं को मैनेज कर पाएगा।</p>
                  </div>
               </div>

               <div className="pt-6">
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full saffron-btn py-5 flex items-center justify-center gap-3 text-sm group"
                 >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>
                        <Save size={20} />
                        शाखा डेटा सुरक्षित करें
                     </>
                   )}
                 </button>
               </div>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
