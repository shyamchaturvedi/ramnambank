"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DigitalIDCard from '@/components/DigitalIDCard';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Award, Download, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DevoteePassPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { auth, db } = await import('@/lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const currentUser = auth.currentUser;
        if (currentUser) {
          const snap = await getDoc(doc(db, 'members', currentUser.uid));
          if (snap.exists()) {
            setProfile(snap.data());
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
    branch: profile?.block ? `${profile.block}, ${profile.district}` : (profile?.branch_code || 'मुख्य शाखा'),
    membership_type: profile?.membership_type || 'BANK_LIFE'
  };

  const isPending = !profile?.membership_type || profile?.status === 'PENDING';

  return (
    <DashboardLayout userRole="DEVOTEE">
      <div className="space-y-8 pb-20">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} />
            <span>आध्यात्मिक पहचान पत्र</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-serif gold-text uppercase">
            डिजिटल सदस्यता पास (Digital Pass)
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Download, Print or Share your verified Bank Membership Pass
          </p>
        </div>

        {isPending && (
          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-white tracking-wider">पास एक्टिवेशन प्रक्रियाधीन है</p>
                <p className="text-[10px] text-white/50 uppercase">एडमिन द्वारा पेमेंट वेरीफाई होते ही आपका पास पूर्ण रूप से सक्रिय हो जाएगा।</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard/devotee/membership')}
              className="px-6 py-3 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shrink-0"
            >
              सदस्यता स्थिति देखें
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="flex justify-center lg:col-span-1">
            <DigitalIDCard user={userData} showActions={true} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider gold-text flex items-center gap-2">
                <ShieldCheck className="text-saffron" size={20} />
                पास के प्रमुख लाभ एवं उपयोगिता
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </DashboardLayout>
  );
}
