"use client";

import React, { useState, useEffect } from 'react';
import DigitalIDCard from '@/components/DigitalIDCard';
import { ShieldCheck, Award, Download, Share2, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DevoteePassPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [hasRequestedMembership, setHasRequestedMembership] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { auth, db } = await import('@/lib/firebase');
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');
        const currentUser = auth.currentUser;
        if (currentUser) {
          const snap = await getDoc(doc(db, 'members', currentUser.uid));
          if (snap.exists()) {
            setProfile(snap.data());
          }

          // Check if user submitted any membership request/payment
          const reqQ = query(collection(db, 'membership_requests'), where('user_id', '==', currentUser.uid));
          const reqSnap = await getDocs(reqQ);
          if (!reqSnap.empty) {
            setHasRequestedMembership(true);
          }
        }
      } catch (err) {
        console.error('Error loading pass:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const userData = {
    name: profile?.full_name || 'भक्त',
    role: profile?.role || 'DEVOTEE',
    id: profile?.membership_id || profile?.id || 'RN-PENDING',
    photo_url: profile?.photo_url || profile?.photo || '',
    branch: profile?.block ? `${profile.block}, ${profile.district}` : (profile?.branch_code || 'मुख्य शाखा'),
    district: profile?.district || '',
    state: profile?.state || '',
    membership_type: profile?.membership_type || null
  };

  const isApprovedActive = profile?.status === 'ACTIVE' && profile?.membership_type;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black uppercase tracking-widest">
          <Award size={13} />
          <span>आध्यात्मिक पहचान पत्र</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-serif gold-text uppercase tracking-tight">
          डिजिटल सदस्यता पास (Digital Pass)
        </h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
          Download, Print or Share your verified Bank Membership Pass
        </p>
      </div>

      {/* Case 1: Active & Approved Membership */}
      {isApprovedActive ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          {/* Main Card Column */}
          <div className="xl:col-span-6 flex justify-center w-full">
            <DigitalIDCard user={userData} showActions={true} />
          </div>

          {/* Benefits & Info Column */}
          <div className="xl:col-span-6 space-y-6">
            <div className="premium-card p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider gold-text flex items-center gap-2">
                <ShieldCheck className="text-saffron" size={20} />
                पास के प्रमुख लाभ एवं उपयोगिता
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'डिजिटल एवं फिजिकल स्वीकार्यता', desc: 'यह पास सभी 30 जिलों की शाखाओं में मान्य है।' },
                  { title: 'आध्यात्मिक बुकलेट संचय', desc: 'पास दिखाकर अपनी शाखा से निःशुल्क पुस्तिका प्राप्त करें।' },
                  { title: 'अयोध्या धाम प्राथमिकता', desc: 'वार्षिक महाकुंभ एवं विशेष आयोजनों में सम्मानजनक प्रवेश।' },
                  { title: 'QR कोड सत्यापन', desc: 'किसी भी स्मार्टफोन से स्कैन करके तुरंत प्रमाणिकता देखें।' },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                    <p className="text-xs font-black text-white uppercase tracking-wider">{item.title}</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-card p-6 bg-gradient-to-r from-saffron/10 via-sacred-red/5 to-transparent border border-saffron/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-white">सदस्यता अपग्रेड करें</p>
                <p className="text-[10px] text-white/50 uppercase">आजीवन या विशेष आजीवन सदस्य बनकर संस्थान के कोर परिवार में शामिल हों।</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/devotee/membership')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shrink-0"
              >
                प्लान्स देखें
              </button>
            </div>
          </div>
        </div>
      ) : hasRequestedMembership ? (
        /* Case 2: Payment Submitted, Waiting for Admin Approval */
        <div className="premium-card p-10 text-center space-y-6 max-w-2xl mx-auto border-amber-500/30 bg-amber-500/[0.03]">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <AlertCircle size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black font-serif gold-text uppercase">पास एक्टिवेशन प्रक्रियाधीन है</h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
              आपका पेमेंट और सदस्यता अनुरोध प्राप्त हो गया है। एडमिन द्वारा UTR सत्यापित होते ही आपका डिजिटल पास सक्रिय हो जाएगा।
            </p>
          </div>
          <Link 
            href="/dashboard/devotee/orders"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all"
          >
            आर्डर व पेमेंट स्थिति देखें <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Case 3: User has NOT subscribed or paid yet */
        <div className="premium-card p-12 text-center space-y-6 max-w-2xl mx-auto border-saffron/30 bg-white/[0.02]">
          <div className="w-20 h-20 rounded-3xl bg-saffron/10 border border-saffron/30 flex items-center justify-center text-saffron mx-auto">
            <Lock size={40} />
          </div>
          <div className="space-y-3">
            <span className="px-4 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-[9px] font-black uppercase tracking-widest">
              पास लॉक है (No Active Plan)
            </span>
            <h3 className="text-2xl md:text-3xl font-black font-serif gold-text uppercase">डिजिटल पास प्राप्त करने के लिए सदस्यता लें</h3>
            <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
              आपने अभी तक कोई सदस्यता प्लान नहीं लिया है। डिजिटल पास, निःशुल्क अर्चना पुस्तिका और सनातनी लेखन किट प्राप्त करने के लिए कृपया अपनी सदस्यता योजना चुनें।
            </p>
          </div>
          <Link 
            href="/dashboard/devotee/membership"
            className="inline-flex items-center gap-3 px-8 py-4 saffron-btn text-xs font-black uppercase tracking-[0.2em]"
          >
            <Award size={18} /> सदस्यता प्लान चुनें और सक्रिय करें
          </Link>
        </div>
      )}
    </div>
  );
}
