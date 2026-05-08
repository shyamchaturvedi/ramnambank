"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

export default function CentralLogin() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    // If it's a numeric ID or member ID, we append the domain
    const loginEmail = email.includes('@') ? email : `${email}@ramnam.bank`;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (authError) {
      setError('गलत आईडी या पासवर्ड। कृपया पुनः प्रयास करें।');
      setIsLoggingIn(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Sacred Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-sacred-red/5 rounded-full blur-[150px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="premium-card p-10 md:p-12 space-y-10 border-t-4 border-saffron sacred-glow">
          <div className="text-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron to-sacred-red mx-auto flex items-center justify-center text-3xl font-bold gold-text shadow-2xl">ॐ</div>
             <h1 className="text-3xl font-black font-serif gold-text uppercase tracking-widest mt-4">पोर्टल प्रवेश</h1>
             <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">अपनी भूमिका का चयन करें</p>
             {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"
                >
                   <AlertCircle size={14} /> {error}
                </motion.div>
             )}
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
             <button 
               onClick={() => setRole('MEMBER')}
               className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'MEMBER' ? 'bg-saffron text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
             >
                <Users size={16} /> भक्त
             </button>
             <button 
               onClick={() => setRole('ADMIN')}
               className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'ADMIN' ? 'bg-saffron text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
             >
                <Settings size={16} /> एडमिन
             </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-4">
                <div className="relative group">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                   <input 
                     required
                     type="text" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder={role === 'ADMIN' ? 'एडमिन ID / ईमेल' : 'मोबाइल नंबर / भक्त ID'} 
                     className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                   />
                </div>
                <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                   <input 
                     required
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="पासवर्ड" 
                     className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm transition-all"
                   />
                </div>
             </div>

             <button 
               type="submit"
               disabled={isLoggingIn}
               className="w-full saffron-btn py-5 flex items-center justify-center gap-3 text-[10px] group"
             >
                {isLoggingIn ? (
                   <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    लॉगिन करें 
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
             </button>
          </form>

          <div className="flex flex-col gap-4 text-center">
             <Link href="/open-account" className="text-[10px] font-bold text-saffron uppercase tracking-widest hover:underline">नया खाता खोलें</Link>
             <Link href="/" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                <ChevronLeft size={14} /> वापस मुख्य पृष्ठ
             </Link>
          </div>
        </div>

        <div className="mt-10 text-center flex items-center justify-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
           <ShieldCheck size={16} className="text-saffron" />
           Ayodhya Admin Secure Access
        </div>
      </motion.div>
    </div>
  );
}
