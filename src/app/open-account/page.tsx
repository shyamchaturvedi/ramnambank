"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft,
  Lock,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

import Footer from '@/components/Footer';

export default function OpenAccount() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate account creation
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-sacred-red/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">वापस मुख्य पृष्ठ</span>
        </Link>
        <div className="text-xl font-bold font-serif gold-text uppercase tracking-widest">पंजीकरण</div>
        <div className="w-20"></div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <div className="premium-card p-10 md:p-16 space-y-10 sacred-glow border-t-4 border-saffron">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-black font-serif gold-text uppercase">राम नाम खाता खोलें</h1>
              <p className="text-white/40 text-xs tracking-widest uppercase font-bold">अपनी आध्यात्मिक यात्रा आज ही प्रारंभ करें</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">भक्त का पूर्ण नाम</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="नाम दर्ज करें" 
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">मोबाइल नंबर</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                    <input 
                      required
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">राज्य</label>
                    <input 
                      required
                      type="text" 
                      placeholder="राज्य" 
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">जिला</label>
                    <input 
                      required
                      type="text" 
                      placeholder="जिला" 
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">पासवर्ड बनाएं</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full saffron-btn py-5 flex items-center justify-center gap-3 text-sm group"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      खाता खोलें और आगे बढ़ें
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest pt-4">
                <ShieldCheck size={14} className="text-saffron" />
                सुरक्षित और आध्यात्मिक संचय
              </div>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
