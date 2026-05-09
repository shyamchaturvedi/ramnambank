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
import { supabase } from '@/lib/supabase';

export default function CentralLogin() {
  const router = useRouter();
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      alert('कृपया आईडी और पासवर्ड दोनों भरें!');
      return;
    }

    console.log('Login attempt started for:', email);
    setIsLoggingIn(true);
    setError(null);

    try {
      console.log('Login process started for:', email);
      
      // 1. Search the 'members' table for ANY match (Mobile, Email, or Membership ID)
      // We do this by searching columns separately to avoid issues with special characters in '.or'
      let memberRecord = null;
      
      // Try Membership ID
      const { data: byId } = await supabase.from('members').select('email, role, full_name, membership_id').eq('membership_id', email).maybeSingle();
      if (byId) memberRecord = byId;
      
      // Try Mobile
      if (!memberRecord) {
        const { data: byMobile } = await supabase.from('members').select('email, role, full_name, membership_id').eq('mobile_number', email).maybeSingle();
        if (byMobile) memberRecord = byMobile;
      }
      
      // Try Email
      if (!memberRecord && email.includes('@')) {
        const { data: byEmail } = await supabase.from('members').select('email, role, full_name, membership_id').eq('email', email).maybeSingle();
        if (byEmail) memberRecord = byEmail;
      }

      console.log('Member Record Result:', memberRecord ? 'Found' : 'Not Found');

      let targetEmail = email;
      if (memberRecord?.email) {
        targetEmail = memberRecord.email;
        console.log('Found registered email:', targetEmail);
      } else if (!email.includes('@')) {
        targetEmail = `${email}@ramnam.bank`;
      }

      // 2. Attempt Login
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password,
      });

      if (authError) {
        console.log('Auth Failed:', authError.message);
        
        // 3. AUTO-SYNC: If user exists in DB but not in Auth, sync them
        if (memberRecord) {
          console.log('Syncing DB member to Auth...');
          const { error: syncError } = await supabase.auth.signUp({
            email: targetEmail,
            password: password,
            options: { data: { role: memberRecord.role || 'MEMBER', full_name: memberRecord.full_name } }
          });

          if (!syncError || syncError.message.includes('already registered')) {
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email: targetEmail,
              password: password
            });
            
            if (!retryError) {
              alert('लॉगिन सफल! डैशबोर्ड पर जा रहे हैं...');
              router.push('/dashboard');
              router.refresh();
              return;
            }
          }
        }
        
        setError('गलत आईडी या पासवर्ड। कृपया पुनः प्रयास करें।');
        alert('लॉगिन विफल: ' + authError.message);
      } else {
        console.log('Login success!');
        alert('लॉगिन सफल! डैशबोर्ड पर जा रहे हैं...');
        router.push('/dashboard');
        setTimeout(() => router.refresh(), 500);
        return;
      }
    } catch (err: any) {
      console.error('System Login Error:', err);
      setError('सर्वर की समस्या। कृपया इंटरनेट चेक करें।');
      alert('सिस्टम एरर: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md relative z-[100]"
      >
        <div className="bg-[#111] p-10 rounded-3xl border border-white/10 space-y-10 shadow-2xl">
          <div className="text-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-saffron mx-auto flex items-center justify-center text-3xl font-bold text-black">ॐ</div>
             <h1 className="text-3xl font-black font-serif gold-text uppercase tracking-widest mt-4">पोर्टल प्रवेश</h1>
             <p className="text-[8px] text-white/10 uppercase tracking-[0.3em]">Build: {new Date().toLocaleTimeString()} (Robust Auth V3)</p>
             
             <button 
               type="button"
               onClick={async () => {
                 const { data, error } = await supabase.from('members').select('id').limit(1);
                 if (error) alert('कनेक्शन एरर: ' + error.message);
                 else alert('कनेक्शन सफल! डेटाबेस से संपर्क हो पा रहा है।');
               }}
               className="mt-2 text-[8px] font-black text-saffron/40 hover:text-saffron uppercase tracking-widest border border-saffron/10 px-3 py-1 rounded-full transition-all"
             >
                कनेक्शन जांचें (Check Status)
             </button>

             {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                   <AlertCircle size={14} />
                   {error}
                </div>
             )}
          </div>

          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
             <button 
               onClick={() => setRole('MEMBER')}
               className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'MEMBER' ? 'bg-saffron text-black' : 'text-white/40'}`}
             >
                भक्त
             </button>
             <button 
               onClick={() => setRole('ADMIN')}
               className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'ADMIN' ? 'bg-saffron text-black' : 'text-white/40'}`}
             >
                एडमिन
             </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-4">
                <input 
                  required
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'ADMIN' ? 'एडमिन ID / ईमेल' : 'मोबाइल नंबर / भक्त ID'} 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-sm"
                />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron text-white text-sm"
                />
             </div>

             <button 
               type="submit"
               disabled={isLoggingIn}
               className="w-full bg-saffron text-black py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
             >
                {isLoggingIn ? 'प्रतीक्षा करें...' : 'लॉगिन करें'}
             </button>
          </form>

          <div className="flex flex-col gap-4 text-center">
             <Link href="/open-account" className="text-[10px] font-bold text-saffron uppercase tracking-widest hover:underline">नया खाता खोलें</Link>
             <Link href="/" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">वापस मुख्य पृष्ठ</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
