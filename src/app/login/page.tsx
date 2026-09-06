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
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';

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

    setIsLoggingIn(true);
    setError(null);

    try {
      let targetEmail = cleanEmail;

      // Check if user entered Membership ID (e.g. OD/17/2026/001) or Mobile Number
      if (!cleanEmail.includes('@')) {
        // If it's a Membership ID, find the user doc
        if (cleanEmail.includes('/')) {
          try {
            const memberQuery = query(collection(db, 'members'), where('membership_id', '==', cleanEmail));
            const memberSnap = await getDocs(memberQuery);
            if (!memberSnap.empty) {
              const data = memberSnap.docs[0].data();
              targetEmail = data.email || `${data.mobile_number}@ramnam.bank`;
            } else {
              targetEmail = `${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}@ramnam.bank`;
            }
          } catch(err) {
            targetEmail = `${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}@ramnam.bank`;
          }
        } else {
          targetEmail = `${cleanEmail}@ramnam.bank`;
        }
      }

      // Check if Admin Login
      if (role === 'ADMIN') {
        if (cleanEmail === 'admin' || cleanEmail === 'iammshyam@gmail.com' || cleanEmail.includes('admin')) {
          targetEmail = cleanEmail.includes('@') ? cleanEmail : 'iammshyam@gmail.com';
        }
      }

      try {
        // 1. Firebase Sign In
        const userCred = await signInWithEmailAndPassword(auth, targetEmail, cleanPassword);
        const signedInUid = userCred.user.uid;

        // Fetch actual member role from Firestore
        let actualRole = 'DEVOTEE';
        try {
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          let userDoc = await getDoc(doc(db, 'members', signedInUid));
          let data: any = userDoc.exists() ? userDoc.data() : null;

          if (!data && targetEmail) {
            const q = query(collection(db, 'members'), where('email', '==', targetEmail));
            const snap = await getDocs(q);
            if (!snap.empty) data = snap.docs[0].data();
          }

          if (data && data.role) {
            actualRole = data.role.toUpperCase();
          }
        } catch(e) {}

        // Tab selection determines the destination portal:
        if (role === 'ADMIN') {
          if (actualRole === 'ADMIN') {
            window.location.href = '/dashboard/admin';
          } else {
            setError('आपके पास व्यवस्थापक (Admin) अधिकार नहीं हैं। कृपया "भक्त प्रवेश" से लॉगिन करें।');
            setIsLoggingIn(false);
            return;
          }
        } else {
          // User chose "भक्त प्रवेश" (Devotee Portal Login)
          window.location.href = '/dashboard/devotee';
        }
        return;
      } catch (authError: any) {
        // Auto-Register or fallback if first time
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
          try {
            const userCred = await createUserWithEmailAndPassword(auth, targetEmail, cleanPassword);
            if (userCred.user) {
              await setDoc(doc(db, 'members', userCred.user.uid), {
                id: userCred.user.uid,
                email: targetEmail,
                full_name: cleanEmail.split('@')[0],
                mobile_number: cleanEmail.replace(/[^0-9]/g, '') || '9999999999',
                role: role === 'ADMIN' ? 'ADMIN' : 'DEVOTEE',
                status: 'ACTIVE',
                membership_type: 'BANK_LIFE',
                created_at: new Date().toISOString()
              }, { merge: true });

              window.location.href = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/devotee';
              return;
            }
          } catch (signUpErr) {
            // If already exists but wrong password
            setError('गलत पासवर्ड या आईडी। कृपया सही जानकारी भरें।');
          }
        } else {
          setError(authError.message || 'लॉगिन में त्रुटि आई। कृपया पुनः प्रयास करें।');
        }
      }
    } catch (err: any) {
      console.error('System Login Error:', err);
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया इंटरनेट चेक करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userEmail = result.user.email || '';
        const isAdmin = role === 'ADMIN' && (userEmail === 'iammshyam@gmail.com' || userEmail.toLowerCase().includes('admin'));
        const userRole = isAdmin ? 'ADMIN' : 'DEVOTEE';

        // 1. Check if user already registered manually with this Email
        let existingMemberData: any = null;
        let existingDocId = result.user.uid;

        try {
          const userDoc = await getDoc(doc(db, 'members', result.user.uid));
          if (userDoc.exists()) {
            existingMemberData = userDoc.data();
          } else if (userEmail) {
            // Search in members collection by email
            const q = query(collection(db, 'members'), where('email', '==', userEmail));
            const snap = await getDocs(q);
            if (!snap.empty) {
              existingMemberData = snap.docs[0].data();
              existingDocId = snap.docs[0].id;
            }
          }
        } catch(e) {}

        const finalRole = existingMemberData?.role || userRole;
        const year = new Date().getFullYear();
        const serial = Math.floor(1000 + Math.random() * 9000);
        const membershipId = existingMemberData?.membership_id || `OD/17/01/${year}/${serial}`;

        // Merge existing member data under this UID
        const memberPayload = {
          ...(existingMemberData || {}),
          id: result.user.uid,
          email: userEmail,
          full_name: existingMemberData?.full_name || result.user.displayName || 'भक्त',
          role: finalRole,
          membership_id: membershipId,
          district: existingMemberData?.district || 'Kendrapara',
          block: existingMemberData?.block || 'KENDRAPARA SUB DIVISION',
          branch_code: existingMemberData?.branch_code || 'OD/17/01',
          mobile_number: existingMemberData?.mobile_number || result.user.phoneNumber || '',
          status: 'ACTIVE',
          membership_type: existingMemberData?.membership_type || 'BANK_LIFE',
          last_login_at: new Date().toISOString()
        };

        await setDoc(doc(db, 'members', result.user.uid), memberPayload, { merge: true });

        window.location.href = finalRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard/devotee';
      }
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError('Google लॉगिन में त्रुटि: ' + (err.message || 'पॉपअप बंद कर दिया गया।'));
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
             <p className="text-[9px] text-saffron/70 uppercase tracking-[0.3em] font-bold">
               विश्वस्तरीय श्री राम नाम महा धन संचय बैंक
             </p>

             {error && (
                <div className="p-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-red-500/10 border-red-500/20 text-red-500 text-left">
                   <AlertCircle size={14} className="shrink-0" />
                   <span>{error}</span>
                </div>
             )}
          </div>

          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
             <button 
               onClick={() => setRole('MEMBER')}
               className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'MEMBER' ? 'bg-saffron text-black' : 'text-white/40'}`}
             >
                भक्त प्रवेश
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
                  placeholder={role === 'ADMIN' ? 'एडमिन ईमेल दर्ज करें (Admin Email)' : 'मोबाइल नंबर / ईमेल / भक्त ID'} 
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
                className="w-full bg-saffron text-black py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
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
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google से 1-क्लिक लॉगिन
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
