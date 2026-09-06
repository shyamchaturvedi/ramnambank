"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  MapPin, 
  Building2, 
  ArrowLeft,
  Share2,
  Sparkles,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

function VerifyContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || searchParams.get('member_id') || searchParams.get('uid');

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function verifyDevotee() {
      if (!idParam) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        // 1. Try by Membership ID
        const q = query(collection(db, 'members'), where('membership_id', '==', idParam.trim()));
        const snap = await getDocs(q);

        if (!snap.empty) {
          setMember({ id: snap.docs[0].id, ...snap.docs[0].data() });
          setNotFound(false);
        } else {
          // 2. Try by Doc ID / UID
          const docRef = doc(db, 'members', idParam.trim());
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMember({ id: docSnap.id, ...docSnap.data() });
            setNotFound(false);
          } else {
            // 3. Try by mobile number
            const mobileQ = query(collection(db, 'members'), where('mobile_number', '==', idParam.trim()));
            const mobileSnap = await getDocs(mobileQ);
            if (!mobileSnap.empty) {
              setMember({ id: mobileSnap.docs[0].id, ...mobileSnap.docs[0].data() });
              setNotFound(false);
            } else {
              setNotFound(true);
            }
          }
        }
      } catch (err) {
        console.error('Verify error:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    verifyDevotee();
  }, [idParam]);

  const roleTitle = member?.membership_type === 'SPECIAL_LIFE' ? 'केन्द्रीय विशिष्ट आजीवन सदस्य' : 
                    member?.membership_type === 'LIFE' ? 'केन्द्रीय आजीवन सदस्य' : 
                    member?.membership_type === 'BANK_LIFE' ? 'श्री राम नाम लेखन सदस्य' : 
                    member?.membership_type === 'REGULAR' ? 'साधारण सदस्य' :
                    (member?.membership_type || member?.role || 'श्री राम नाम लेखन सदस्य');

  return (
    <div className="min-h-screen bg-[#070605] text-white flex flex-col justify-between selection:bg-saffron selection:text-black">
      {/* Navbar */}
      <header className="p-6 border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-saffron/40 overflow-hidden bg-black p-0.5">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black font-serif gold-text uppercase tracking-wider">
                श्री राम नाम महाधन संचय बैंक
              </h1>
              <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em]">
                आधिकारिक डिजिटल सदस्यता सत्यापन पोर्टल
              </p>
            </div>
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold transition-all border border-white/10"
          >
            <ArrowLeft size={14} /> मुख्य पृष्ठ
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-xl mx-auto w-full p-6 sm:p-8 flex flex-col justify-center my-8">
        {loading ? (
          <div className="p-12 text-center space-y-4 rounded-3xl bg-white/5 border border-white/10">
            <Loader2 size={40} className="text-saffron animate-spin mx-auto" />
            <p className="text-sm font-black uppercase tracking-widest text-saffron">
              सदस्यता डेटा सत्यापित किया जा रहा है...
            </p>
            <p className="text-xs text-white/40">कृपया प्रतीक्षा करें</p>
          </div>
        ) : notFound ? (
          <div className="p-8 sm:p-12 text-center space-y-6 rounded-[2.5rem] bg-red-500/[0.04] border border-red-500/20 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <XCircle size={44} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase text-red-400 font-serif">
                अमान्य या अपंजीकृत पास (Invalid Pass)
              </h2>
              <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                इस सदस्यता आईडी ({idParam || 'N/A'}) का कोई सक्रिय रिकॉर्ड नहीं मिला। कृपया आईडी की पुनः जांच करें या बैंक कार्यालय से संपर्क करें।
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/open-account" className="saffron-btn py-3.5 px-6 text-xs uppercase font-black tracking-wider text-center">
                नया खाता खोलें (Open Account)
              </Link>
              <Link href="/" className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-xs uppercase font-bold text-white/80 border border-white/10 text-center">
                होम पर जाएँ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-zoom-in">
            {/* Success Badge */}
            <div className="p-5 rounded-3xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck size={28} className="text-green-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-300">
                  ✓ आधिकारिक डिजिटल सदस्यता प्रमाणित (Verified Official Pass)
                </span>
                <p className="text-xs text-white/80 font-bold mt-0.5">
                  यह पास श्री राम नाम महाधन संचय बैंक के केंद्रीय रिकॉर्ड में सक्रिय (ACTIVE) है।
                </p>
              </div>
            </div>

            {/* Member Details Card */}
            <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#0E0D0C] border-2 border-saffron/40 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Header inside Card */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[9px] font-black text-saffron uppercase tracking-widest">
                    सदस्यता विवरण (Member Profile)
                  </span>
                  <p className="text-xs font-mono font-bold text-white/60">ID: {member.membership_id || member.id}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-400/10 border border-green-400/30 text-green-400 text-[10px] font-black uppercase tracking-widest">
                  सक्रिय (ACTIVE)
                </span>
              </div>

              {/* Devotee Info */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-24 rounded-2xl border-2 border-saffron/40 bg-black overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                  {member.photo_url || member.photo ? (
                    <img src={member.photo_url || member.photo} alt={member.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-saffron font-serif">
                      {member.full_name ? member.full_name[0].toUpperCase() : 'भ'}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-serif tracking-wide">
                    {member.full_name || 'भक्त'}
                  </h2>
                  <p className="text-xs font-black text-saffron uppercase tracking-wider">
                    {roleTitle}
                  </p>
                  <p className="text-[11px] text-white/60 flex items-center gap-1.5 font-bold">
                    <MapPin size={13} className="text-saffron" />
                    {[member.district, member.state].filter(Boolean).join(', ') || 'अयोध्या धाम'}
                  </p>
                </div>
              </div>

              {/* Key Meta Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">आवंटित शाखा</span>
                  <p className="text-xs font-bold text-amber-200 truncate">
                    {member.branch_name || member.branch || 'अयोध्या धाम मुख्य शाखा'}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">शाखा कोड</span>
                  <p className="text-xs font-bold font-mono text-saffron">
                    {member.branch_code || 'UP/AY/01'}
                  </p>
                </div>
              </div>

              {/* Sanstha Footer */}
              <div className="border-t border-white/10 pt-4 text-center space-y-1 text-[10px] text-white/50">
                <p className="font-serif font-black text-saffron text-xs">।। ॐ श्री रामचन्द्राय नमः ।।</p>
                <p className="font-bold text-white/80">श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान</p>
                <p className="text-white/60 text-[9px]">जगन्नाथ घाट, निकट-राज घाट, अयोध्या, उत्तर प्रदेश - 224123</p>
                <p className="font-mono text-[9px] text-white/40">हेल्पलाइन: +91 8090525961, +91 9794640807</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} श्री राम नाम महाधन संचय बैंक • समस्त अधिकार सुरक्षित।
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Loader2 size={32} className="text-saffron animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
