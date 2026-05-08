"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import { getBranches, createMember } from '@/services/dataService';

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Form Fields
  const [form, setForm] = useState({
    full_name: '',
    mobile_number: '',
    address: '',
    pin_code: '',
    password: '',
    referral_code: ''
  });

  useEffect(() => {
    const ref = searchParams.get('ref') || searchParams.get('referral_code');
    if (ref) {
      setForm(prev => ({ ...prev, referral_code: ref }));
    }
    
    const loadBranches = async () => {
      const data = await getBranches();
      setBranches(data);
    };
    loadBranches();
  }, [searchParams]);

  const districts = Array.from(new Set(branches.map(b => b.city))).sort();
  const blocks = branches.filter(b => b.city === selectedDistrict);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlock) return;
    
    setIsSubmitting(true);

    // Honeypot check for bots
    if ((e.target as any).website?.value) {
      // It's a bot
      setIsSubmitting(false);
      setSubmitStatus('SUCCESS'); // Trick them into thinking they succeeded
      return;
    }
    
    const result = await createMember({
      ...form,
      state: 'Odisha',
      district: selectedDistrict,
      block: selectedBlock.name,
      branch_code: selectedBlock.code
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmitStatus('SUCCESS');
      setTimeout(() => router.push('/dashboard'), 3000);
    } else {
      setSubmitStatus('ERROR');
    }
  };

  return (
    <div className="premium-card p-10 md:p-16 space-y-12 sacred-glow border-t-2 border-saffron/50 relative overflow-hidden">
      <AnimatePresence>
        {submitStatus === 'SUCCESS' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-10 space-y-6">
            <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center text-green-400">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black font-serif gold-text uppercase">पंजीकरण सफल!</h2>
            <p className="text-white/60 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
              जय श्री राम! आपका राम नाम खाता खुल गया है। आपको डैशबोर्ड पर रीडायरेक्ट किया जा रहा है...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black font-serif gold-text uppercase tracking-tight">नया खाता खोलें</h1>
        <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-black">अपनी आध्यात्मिक पूंजी का संचय शुरू करें</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Honeypot field (hidden from humans) */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        <div className="space-y-8">
          {/* Full Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">भक्त का पूर्ण नाम (Full Name)</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
              <input required type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="अपना नाम लिखें" className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">मोबाइल नंबर (Mobile)</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input required type="tel" maxLength={10} value={form.mobile_number} onChange={e => setForm({...form, mobile_number: e.target.value})} placeholder="10 अंकों का नंबर" className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner" />
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">रेफरल कोड (Referral Code)</label>
              <div className="relative group">
                <Share2 className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input type="text" value={form.referral_code} onChange={e => setForm({...form, referral_code: e.target.value})} placeholder="कोड यहाँ लिखें" className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">जिला (District)</label>
              <select required value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setSelectedBlock(null); }} className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm appearance-none cursor-pointer">
                <option value="">जिला चुनें</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">ब्लॉक / तहसील (Block)</label>
              <select required value={selectedBlock?.id || ''} onChange={e => setSelectedBlock(blocks.find(b => b.id === e.target.value))} disabled={!selectedDistrict} className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm appearance-none cursor-pointer disabled:opacity-30">
                <option value="">ब्लॉक चुनें</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {selectedBlock && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-saffron/5 border border-saffron/20 rounded-3xl flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-saffron uppercase tracking-widest">संभावित सदस्य आईडी (ID Preview)</p>
                    <p className="text-lg font-black font-mono text-white tracking-widest">{selectedBlock.code}/{new Date().getFullYear()}/XXXX</p>
                 </div>
                 <div className="w-10 h-10 bg-saffron/10 rounded-full flex items-center justify-center text-saffron">
                    <CheckCircle2 size={20} />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">पूरा पता (Full Address)</label>
            <textarea required value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm resize-none transition-all" placeholder="गाँव, पोस्ट, थाना..."></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">पासवर्ड (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="लॉगिन के लिए पासवर्ड" className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm shadow-inner" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" disabled={isSubmitting} className="w-full saffron-btn py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] group shadow-[0_15px_40px_rgba(255,153,51,0.2)]">
            {isSubmitting ? (
              <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                खाता खोलें और आगे बढ़ें
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>

        {submitStatus === 'ERROR' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={16} /> कुछ गलत हुआ। कृपया दोबारा प्रयास करें।
          </div>
        )}
      </form>
    </div>
  );
}

export default function OpenAccount() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-saffron selection:text-black flex flex-col font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sacred-red/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className="relative z-10 p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-saffron/10 group-hover:text-saffron transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] hidden sm:block">मुख्य पृष्ठ</span>
        </Link>
        <div className="text-xl font-bold font-serif gold-text uppercase tracking-[0.3em]">भक्त पंजीकरण</div>
        <div className="w-10 sm:w-20"></div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <Suspense fallback={<div className="text-center p-10 uppercase text-[10px] font-bold text-white/20">लोड हो रहा है...</div>}>
            <RegistrationForm />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
