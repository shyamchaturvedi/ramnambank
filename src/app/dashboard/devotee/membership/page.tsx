"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, QrCode, ArrowRight, Award, Star, Zap, Clock, XCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const PLANS = [
  {
    id: 'special_life',
    name: 'केन्द्रीय विशिष्ट आजीवन सदस्य',
    description: 'श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान का सर्वोच्च सम्मान',
    amount: 21051,
    icon: Star,
    color: 'from-amber-400 to-orange-600',
    features: ['विशिष्ट पहचान पत्र (VIP Pass)', 'संस्थान की कोर कमेटी में स्थान', 'वार्षिक महाकुंभ में विशेष सम्मान', 'आजीवन आध्यात्मिक मार्गदर्शन']
  },
  {
    id: 'institute_life',
    name: 'केन्द्रीय आजीवन सदस्य',
    description: 'श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान की स्थाई सदस्यता',
    amount: 2151,
    icon: Award,
    color: 'from-saffron to-orange-500',
    features: ['आजीवन सदस्यता पास', 'सभी आयोजनों में सम्मानजनक प्रवेश', 'संस्थान की त्रैमासिक पत्रिका', 'सदस्यता प्रमाण पत्र']
  },
  {
    id: 'bank_life',
    name: 'श्री राम नाम लेखन सदस्य',
    description: 'श्री राम नाम महा धन संचय बैंक की नियमित लेखन सदस्यता',
    amount: 360,
    icon: Zap,
    color: 'from-orange-400 to-saffron',
    features: ['डिजिटल आजीवन कार्ड / पास', 'निःशुल्क श्री राम नाम अर्चना पुस्तिका', 'सनातनी लेखन सामग्री किट', 'वार्षिक नवीनीकरण सुविधा']
  }
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [adminUpi, setAdminUpi] = useState('8090525961m@pnb');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [activeMembership, setActiveMembership] = useState<any>(null);

  const fetchHistory = async (uid: string) => {
    setIsLoadingHistory(true);
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');
      
      // Fetch member profile
      try {
        const userDoc = await getDoc(doc(db, 'members', uid));
        if (userDoc.exists()) {
          const mData = userDoc.data();
          if (mData.status === 'ACTIVE' && mData.membership_type) {
            setActiveMembership(mData);
          }
        }
      } catch (e) {}

      const q = query(collection(db, 'membership_requests'), where('user_id', '==', uid));
      const snap = await getDocs(q);
      const list: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistory(list);

      // Check if any approved request
      const approved = list.find((r: any) => r.status === 'APPROVED');
      if (approved && !activeMembership) {
        setActiveMembership({
          membership_type: approved.plan_name,
          created_at: approved.created_at || new Date().toISOString(),
          status: 'ACTIVE'
        });
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { auth } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
            fetchHistory(user.uid);
          }
        });
      } catch (e) {}
    };
    loadInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !utrNumber) return;

    setIsSubmitting(true);
    try {
      const { db, auth } = await import('@/lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const currentUid = userId || auth.currentUser?.uid || 'GUEST_' + Date.now();
      
      await addDoc(collection(db, 'membership_requests'), {
        user_id: currentUid,
        plan_name: selectedPlan.name,
        amount: selectedPlan.amount,
        transaction_id: utrNumber,
        status: 'PENDING',
        created_at: new Date().toISOString()
      });

      setIsSuccess(true);
      fetchHistory(currentUid);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlan(null);
        setUtrNumber('');
      }, 4000);
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

      {/* Active Membership Status Banner */}
      {activeMembership && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-8 border-2 border-green-500/40 bg-green-500/[0.04] rounded-3xl relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shrink-0">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-500 text-black font-black uppercase text-[9px] tracking-widest rounded-full">
                    सक्रिय सदस्यता (ACTIVE)
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    ID: {activeMembership.membership_id || 'RN-OD-17-01'}
                  </span>
                </div>
                <h3 className="text-2xl font-black font-serif gold-text mt-1">
                  {activeMembership.membership_type === 'SPECIAL_LIFE' ? 'केन्द्रीय विशिष्ट आजीवन सदस्य (₹21,051)' :
                   activeMembership.membership_type === 'LIFE' ? 'केन्द्रीय आजीवन सदस्य (₹2,151)' :
                   activeMembership.membership_type === 'BANK_LIFE' ? 'श्री राम नाम लिखन सदस्य (₹360)' :
                   activeMembership.membership_type || 'सक्रिय सदस्य'}
                </h3>
                <p className="text-[11px] text-white/60 font-bold mt-1">
                  आपकी सदस्यता पूर्ण रूप से सक्रिय है। डिजिटल पास और सभी सेवाएँ उपलब्ध हैं।
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-right min-w-[200px]">
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">आगामी नवीनीकरण तिथि (Renewal)</p>
              <p className="text-base font-black text-green-400 mt-0.5">
                {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('hi-IN', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-[8px] text-white/30 uppercase font-bold mt-1">✓ ऑटो-वेरिफाइड पास</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isCurrentPlan = activeMembership?.membership_type?.includes(plan.name) || 
                                (activeMembership?.membership_type === 'SPECIAL_LIFE' && plan.id === 'special_life') ||
                                (activeMembership?.membership_type === 'LIFE' && plan.id === 'institute_life') ||
                                (activeMembership?.membership_type === 'BANK_LIFE' && plan.id === 'bank_life');

          return (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -10 }}
              className={`premium-card p-8 flex flex-col space-y-6 border-2 transition-all relative ${
                isCurrentPlan 
                  ? 'border-green-500/50 bg-green-500/[0.03] shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                  : selectedPlan?.id === plan.id 
                    ? 'border-saffron bg-saffron/5 shadow-[0_0_30px_rgba(245,158,11,0.2)] cursor-pointer' 
                    : 'border-white/5 hover:border-white/20 cursor-pointer'
              }`}
              onClick={() => {
                if (!isCurrentPlan) setSelectedPlan(plan);
              }}
            >
              {isCurrentPlan && (
                <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                  वर्तमान सक्रिय प्लान
                </div>
              )}

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

              {isCurrentPlan ? (
                <button disabled className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/40 cursor-default">
                  ✓ सक्रिय (Active)
                </button>
              ) : (
                <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlan?.id === plan.id ? 'bg-saffron text-black shadow-[0_10px_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                   {activeMembership ? 'अपग्रेड करें' : 'चुनें'}
                </button>
              )}
            </motion.div>
          );
        })}
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
                    <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl border-4 border-saffron/30">
                       <div className="space-y-2 mb-3">
                          <p className="text-[9px] font-black text-black/70 uppercase tracking-widest leading-tight">
                             MERCHANT: SHRI JAGANNATH ODIA BABA SEWA SANSTHAN
                          </p>
                          <div className="inline-block bg-saffron text-black text-[9px] font-black uppercase px-3 py-0.5 rounded-full">
                             SCAN & PAY
                          </div>
                       </div>
                       <div className="w-64 h-64 bg-white flex flex-col items-center justify-center p-1 mx-auto">
                          <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${adminUpi}&pn=SHRI JAGANNATH ODIA BABA SEWA SANSTHAN&am=${selectedPlan.amount}&cu=INR`)}`}
                             alt="Payment QR Code"
                             className="w-full h-full object-contain"
                          />
                       </div>
                       <p className="text-[11px] font-black text-black font-mono tracking-wider mt-2">
                          UPI ID: {adminUpi}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">बैंक विवरण (Bank Details)</p>
                       <p className="text-xs font-bold text-white uppercase tracking-wider">पंजाब नेशनल बैंक (PNB)</p>
                       <p className="text-sm font-black text-saffron uppercase tracking-widest">{adminUpi}</p>
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
