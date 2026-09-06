"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  IndianRupee,
  BookOpen,
  Sparkles,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitDonation, getSettings } from '@/services/dataService';

export default function DevoteeDonatePage() {
  const [upiId, setUpiId] = useState('8090525961m@pnb');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
    phone: '',
    cause: 'अर्चना पुस्तिका छपाई',
    utr_number: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getSettings();
        if (settings?.upi_id) setUpiId(settings.upi_id);

        const { auth, db } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc } = await import('firebase/firestore');

        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              const userDoc = await getDoc(doc(db, 'members', currentUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                setFormData(prev => ({
                  ...prev,
                  donor_name: data.full_name || currentUser.displayName || '',
                  phone: data.mobile_number || ''
                }));
              }
            } catch (e) {}
          }
        });
      } catch (e) {}
    }
    loadData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.utr_number) {
      alert('कृपया दान राशि और UTR नंबर दोनों भरें!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitDonation({
        donor_name: formData.donor_name || 'भक्त',
        amount: Number(formData.amount),
        phone: formData.phone,
        donation_type: formData.cause,
        utr_number: formData.utr_number,
        status: 'PENDING',
        created_at: new Date().toISOString()
      });

      if (res.success) {
        setIsSuccess(true);
        setFormData(prev => ({ ...prev, amount: '', utr_number: '' }));
      }
    } catch (err) {
      console.error(err);
      alert('अनुरोध भेजने में समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">दान एवं सेवा सहयोग</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">
            श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान | राम नाम महाधन संचय बैंक
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Scan & Pay PNB QR Code */}
        <div className="premium-card p-10 md:p-14 space-y-8 sacred-glow border-2 border-saffron/20 text-center relative overflow-hidden">
          <div className="space-y-3">
            <span className="px-4 py-1 bg-saffron/10 border border-saffron/30 text-saffron text-[9px] font-black uppercase tracking-widest rounded-full">
              त्वरित सेवा (SCAN & PAY)
            </span>
            <h3 className="text-2xl font-black font-serif gold-text">किसी भी UPI ऐप से स्कैन करें</h3>
            <p className="text-white/40 text-xs font-bold">Google Pay, PhonePe, Paytm, BHIM</p>
          </div>

          <div className="w-72 bg-white p-5 rounded-3xl mx-auto shadow-[0_0_50px_rgba(255,153,51,0.25)] border-4 border-saffron/30">
            <div className="text-center mb-3">
              <p className="text-[8px] font-black text-black/70 uppercase tracking-widest leading-tight">
                SHRI JAGANNATH ODIA BABA SEWA SANSTHAN
              </p>
              <span className="inline-block bg-saffron text-black text-[9px] font-black uppercase px-3 py-0.5 rounded-full mt-1">
                SCAN & PAY
              </span>
            </div>
            <div className="w-56 h-56 bg-white flex items-center justify-center mx-auto">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=SHRI JAGANNATH ODIA BABA SEWA SANSTHAN&cu=INR`)}`}
                alt="Donation QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] font-black text-black font-mono text-center tracking-wider mt-2">
              UPI: {upiId}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={handleCopy}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-mono text-saffron flex items-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              <span>{upiId}</span>
              <span className="text-[9px] text-white/40 uppercase font-sans font-bold">{copied ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
            </button>
          </div>

          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left space-y-2 text-xs font-bold">
            <p className="text-white/80">संस्थान: <span className="text-white font-bold">श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान</span></p>
            <p className="text-white/80">बैंक: <span className="text-saffron font-black">पंजाब नेशनल बैंक (PNB)</span></p>
            <p className="text-white/80">UPI ID: <span className="text-amber-400 font-mono">{upiId}</span></p>
          </div>
        </div>

        {/* Right: Payment Details Submission Form */}
        <div className="premium-card p-10 md:p-14 space-y-8 border-t-4 border-saffron">
          <div className="space-y-2">
            <h3 className="text-2xl font-black font-serif gold-text">दान / सेवा भुगतान विवरण सबमिट करें</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
              Submit your donation transaction for instant admin verification
            </p>
          </div>

          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 flex items-center gap-4 text-xs font-bold"
              >
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-black uppercase">🎉 दान विवरण सफलतापूर्वक सबमिट हो गया!</p>
                  <p className="text-[10px] text-white/60 mt-0.5">एडमिन द्वारा सत्यापन के बाद रसीद आपके लेजर में जुड़ जाएगी।</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">दाता का नाम (Donor Name) *</label>
              <input 
                required
                type="text"
                value={formData.donor_name}
                onChange={e => setFormData({...formData, donor_name: e.target.value})}
                placeholder="आपका शुभ नाम"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">दान राशि (Amount in ₹) *</label>
                <input 
                  required
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="₹ 501, ₹ 1100..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-saffron text-lg font-black font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">मोबाइल नंबर</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="10 अंकों का नंबर"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">सेवा का संकल्प (Cause)</label>
              <select 
                value={formData.cause}
                onChange={e => setFormData({...formData, cause: e.target.value})}
                className="w-full px-5 py-4 bg-[#141414] border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-sm font-bold"
              >
                <option value="अर्चना पुस्तिका छपाई">📖 अर्चना पुस्तिका छपाई सहयोग</option>
                <option value="साधु एवं संत सेवा">🕉️ साधु एवं संत सेवा (अयोध्या धाम)</option>
                <option value="राम नाम संचय बैंक विस्तार">🚩 राम नाम संचय बैंक डिजिटल विस्तार</option>
                <option value="सामान्य धार्मिक दान">🙏 सामान्य धार्मिक दान</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">UPI UTR / Reference No. *</label>
              <input 
                required
                type="text"
                value={formData.utr_number}
                onChange={e => setFormData({...formData, utr_number: e.target.value})}
                placeholder="12 अंकों का UPI Reference / UTR Number"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-amber-400 text-sm font-mono font-bold"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full saffron-btn py-5 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'जमा हो रहा है...' : 'दान विवरण सबमिट करें (Submit Donation) ✓'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
