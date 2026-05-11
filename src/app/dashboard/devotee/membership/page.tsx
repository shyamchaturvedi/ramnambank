"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, QrCode, ArrowRight, Award, Star, Zap, Clock, XCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const PLANS = [
  {
    id: 'special_life',
    name: 'विशेष आजीवन सदस्य',
    description: 'श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान का सर्वोच्च सम्मान',
    amount: 21000,
    icon: Star,
    color: 'from-amber-400 to-orange-600',
    features: ['विशिष्ट पहचान पत्र', 'संस्थान की कोर टीम में प्राथमिकता', 'वार्षिक उत्सवों में विशेष आमंत्रण', 'विशेष आध्यात्मिक मार्गदर्शन']
  },
  {
    id: 'institute_life',
    name: 'आजीवन सदस्य',
    description: 'श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान की स्थाई सदस्यता',
    amount: 2100,
    icon: Award,
    color: 'from-saffron to-orange-500',
    features: ['आजीवन सदस्यता कार्ड', 'सभी आयोजनों में भागीदारी', 'संस्थान की मासिक पत्रिका', 'सदस्यता प्रमाण पत्र']
  },
  {
    id: 'bank_life',
    name: 'बैंक आजीवन सदस्य',
    description: 'श्री राम नाम संचय बैंक की स्थाई सदस्यता',
    amount: 360,
    icon: Zap,
    color: 'from-orange-400 to-saffron',
    features: ['डिजिटल आजीवन कार्ड', '₹108 वार्षिक रखरखाव शुल्क (365 दिन बाद)', 'बैंक गतिविधियों की विशेष सूचना', 'सदस्यता बैच']
  }
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [adminUpi, setAdminUpi] = useState('shreejagannath@upi');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchHistory = async (uid: string) => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: member } = await supabase
          .from('members')
          .select('id')
          .ilike('email', session.user.email.trim())
          .maybeSingle();
        
        if (member) {
          setUserId(member.id);
          fetchHistory(member.id);
        }
      }

      const { data: settings } = await supabase.from('system_settings').select('upi_id').limit(1).maybeSingle();
      if (settings?.upi_id) {
        setAdminUpi(settings.upi_id);
      }
    };
    loadInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !utrNumber || !userId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('membership_requests').insert([{
        user_id: userId,
        plan_name: selectedPlan.name,
        amount: selectedPlan.amount,
        transaction_id: utrNumber,
        status: 'PENDING'
      }]);

      if (error) throw error;
      
      setIsSuccess(true);
      fetchHistory(userId); // Refresh history
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlan(null);
        setUtrNumber('');
      }, 5000);
    } catch (err) {
      console.error('Membership Error:', err);
      alert('अनुरोध भेजने में समस्या आई। कृपया बाद में प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black font-serif uppercase text-white gold-text">भक्त सदस्यता</h2>
        <p className="text-white/40 text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold">
           श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान एवं श्री राम नाम संचय बैंक परिवार का हिस्सा बनें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`premium-card p-8 flex flex-col space-y-6 cursor-pointer border-2 transition-all ${selectedPlan?.id === plan.id ? 'border-saffron bg-saffron/5 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-white/5 hover:border-white/20'}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg`}>
              <plan.icon size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{plan.name}</h3>
              <p className="text-[10px] text-white/40 font-bold leading-relaxed">{plan.description}</p>
            </div>

            <div className="text-3xl font-black gold-text">₹{plan.amount}/-</div>

            <ul className="space-y-3 pt-6 border-t border-white/5 flex-1">
               {plan.features.map((f, i) => (
                 <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={12} className="text-saffron mt-1 shrink-0" />
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">{f}</span>
                 </li>
               ))}
            </ul>

            <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlan?.id === plan.id ? 'bg-saffron text-black shadow-[0_10px_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
               चुनें
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPlan && !isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="premium-card p-10 md:p-16 border-saffron/30 bg-saffron/[0.02]"
          >
             <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/3 text-center space-y-6">
                   <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl">
                      <div className="w-64 h-64 bg-white flex flex-col items-center justify-center p-2">
                         <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${adminUpi}&pn=Shree Jagannath Odia Baba Sansthan&am=${selectedPlan.amount}&cu=INR`)}`}
                            alt="Payment QR Code"
                            className="w-full h-full object-contain"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">UPI ID (Copy & Pay)</p>
                      <p className="text-2xl font-black text-saffron uppercase tracking-widest">{adminUpi}</p>
                   </div>
                </div>

                <div className="flex-1 space-y-8 w-full">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <h4 className="text-2xl font-black text-white uppercase tracking-widest">सदस्यता भुगतान विवरण</h4>
                         <button onClick={() => setSelectedPlan(null)} className="p-2 text-white/20 hover:text-white transition-all"><XCircle size={24} /></button>
                      </div>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                         <span className="text-xs font-bold text-white/40 uppercase">चुनी गई योजना:</span>
                         <span className="text-lg font-black text-saffron uppercase">{selectedPlan.name}</span>
                      </div>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                         <span className="text-xs font-bold text-white/40 uppercase">भुगतान राशि:</span>
                         <span className="text-3xl font-black text-white">₹{selectedPlan.amount}/-</span>
                      </div>
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">पेमेंट ट्रांजेक्शन ID (UTR Number)</label>
                         <input 
                           required
                           type="text" 
                           value={utrNumber}
                           onChange={(e) => setUtrNumber(e.target.value)}
                           placeholder="Enter 12-digit UTR or Transaction ID" 
                           className="w-full px-6 py-5 bg-black/40 border border-white/20 rounded-2xl outline-none focus:border-saffron text-white font-black tracking-widest transition-all"
                         />
                         <p className="text-[9px] text-saffron/60 italic font-bold uppercase tracking-widest">
                            * एडमिन द्वारा वेरिफिकेशन के बाद आपकी सदस्यता अपडेट कर दी जाएगी।
                         </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full saffron-btn py-6 text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 disabled:opacity-50"
                      >
                         {isSubmitting ? 'अनुरोध भेजा जा रहा है...' : 'सदस्यता हेतु आवेदन करें'}
                         <ArrowRight size={20} />
                      </button>
                   </form>
                </div>
             </div>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="premium-card p-20 text-center space-y-8 bg-green-500/5 border-green-500/30"
          >
             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto">
                <CheckCircle2 size={60} />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest">आवेदन सफलतापूर्वक प्राप्त हुआ!</h3>
                <p className="text-sm text-white/60 font-bold uppercase leading-relaxed max-w-lg mx-auto">
                   आपका भुगतान विवरण वेरिफिकेशन के लिए एडमिन के पास भेज दिया गया है। जल्द ही आपकी सदस्यता अपडेट कर दी जाएगी।
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment History Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-saffron/10 rounded-xl text-saffron">
            <History size={24} />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest">भुगतान इतिहास (Payment History)</h3>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">प्लान</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">राशि</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">UTR ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">तारीख</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoadingHistory ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">लोड हो रहा है...</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई इतिहास नहीं मिला</td></tr>
                ) : history.map((req) => (
                  <tr key={req.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-white uppercase tracking-wide">{req.plan_name}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-white/80">₹{req.amount}</td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] px-3 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-white/60 tracking-wider uppercase">
                        {req.transaction_id}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                        {new Date(req.created_at).toLocaleString('hi-IN', { 
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true 
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      {req.status === 'PENDING' ? (
                        <span className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 w-fit">
                          <Clock size={10} /> पेंडिंग
                        </span>
                      ) : req.status === 'APPROVED' ? (
                        <span className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 size={10} /> स्वीकृत
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1.5 w-fit">
                          <XCircle size={10} /> अस्वीकृत
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
         <div className="p-6 bg-saffron/10 rounded-full text-saffron">
            <ShieldCheck size={40} />
         </div>
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-black text-white uppercase tracking-widest">सुरक्षित भुगतान एवं सदस्यता</h4>
            <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">
               आपकी सदस्यता शुल्क का उपयोग सेवा प्रकल्पों और आध्यात्मिक प्रसार कार्यों में किया जाता है। सभी भुगतान 100% सुरक्षित और पारदर्शी हैं।
            </p>
         </div>
      </div>
    </div>
  );
}
