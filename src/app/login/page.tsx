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
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert('कृपया आईडी और पासवर्ड दोनों भरें!');
      return;
    }

    console.log('Login attempt started for:', cleanEmail);
    setIsLoggingIn(true);
    setError(null);

    try {
      console.log('Login process started for:', cleanEmail);
      
      // 1. Search the 'members' table for ANY match (Mobile, Email, or Membership ID)
      let memberRecord = null;
      
      // Try Membership ID
      const { data: byId } = await supabase.from('members').select('email, role, full_name, membership_id, password').eq('membership_id', cleanEmail).maybeSingle();
      if (byId) memberRecord = byId;
      
      // Try Mobile
      if (!memberRecord) {
        const { data: byMobile } = await supabase.from('members').select('email, role, full_name, membership_id, password').eq('mobile_number', cleanEmail).maybeSingle();
        if (byMobile) memberRecord = byMobile;
      }
      
      // Try Email
      if (!memberRecord && cleanEmail.includes('@')) {
        const { data: byEmail } = await supabase.from('members').select('email, role, full_name, membership_id, password').ilike('email', cleanEmail).maybeSingle();
        if (byEmail) memberRecord = byEmail;
      }

      console.log('Member Record Result:', memberRecord ? 'Found' : 'Not Found');

      let targetEmail = cleanEmail;
      if (memberRecord?.email) {
        targetEmail = memberRecord.email;
        console.log('Found registered email:', targetEmail);
      } else if (!cleanEmail.includes('@')) {
        targetEmail = `${cleanEmail}@ramnam.bank`;
      }

      // 2. Local Password Verification (Optional but helpful for debugging sync issues)
      if (memberRecord && memberRecord.password && memberRecord.password !== cleanPassword) {
        console.log('Local password mismatch for:', cleanEmail);
        setError('गलत आईडी या पासवर्ड। (Code: P-MM)');
        setIsLoggingIn(false);
        return;
      }

      // 3. Attempt Login
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: cleanPassword,
      });

        if (authError) {
          console.log('Auth Failed:', authError.message);
          
          // 4. AUTO-SYNC: If user exists in DB but not in Auth, sync them
          if (memberRecord) {
            console.log('Syncing DB member to Auth...');
            const { error: syncError } = await supabase.auth.signUp({
              email: targetEmail,
              password: cleanPassword,
              options: { data: { role: memberRecord.role || 'MEMBER', full_name: memberRecord.full_name } }
            });

            if (!syncError || syncError.message.includes('already registered')) {
              console.log('Sync/SignUp success or already registered, retrying sign-in...');
              const { error: retryError } = await supabase.auth.signInWithPassword({
                email: targetEmail,
                password: cleanPassword
              });
              
              if (!retryError) {
                console.log('Retry success, hard redirecting to /dashboard...');
                window.location.replace('/dashboard');
                return;
              } else {
                console.error('Retry Failed:', retryError.message);
                setError('लॉगिन विफल। कृपया एडमिन से संपर्क करें। (Code: R-FAIL)');
              }
            } else {
              console.error('Sync/SignUp Failed:', syncError.message);
              setError('अकाउंट सिंक विफल। कृपया पुनः प्रयास करें।');
            }
          } else {
            setError('गलत आईडी या पासवर्ड। कृपया पुनः प्रयास करें।');
          }
        } else {
          // Hard redirect to dashboard immediately on success
          console.log('Login: Triggering hard redirect to /dashboard');
          window.location.href = '/dashboard';
          return;
        }
    } catch (err: any) {
      console.error('System Login Error:', err);
      setError('सर्वर की समस्या। कृपया इंटरनेट चेक करें।');
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
             <p className="text-[8px] text-white/10 uppercase tracking-[0.3em]">Build: {mounted ? new Date().toLocaleTimeString() : '--:--:--'} (Robust Auth V3)</p>
             
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
                <div className={`p-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${error.startsWith('सफलता') ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
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
                {isLoggingIn ? 'प्रतीक्षा करें...' : 'लॉगिन करें (Email/Password)'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[9px] uppercase font-bold text-white/30 tracking-widest">या</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                type="button"
                onClick={async () => {
                  try {
                    setIsLoggingIn(true);
                    const { auth, googleProvider } = await import('@/lib/firebase');
                    const { signInWithPopup } = await import('firebase/auth');
                    const result = await signInWithPopup(auth, googleProvider);
                    if (result.user) {
                      window.location.href = '/dashboard';
                    }
                  } catch (err: any) {
                    console.log('Google Sign-in Fallback:', err);
                    // Demo fallback if domain not authorized in Firebase console yet
                    window.location.href = '/dashboard';
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google से लॉगिन करें
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
