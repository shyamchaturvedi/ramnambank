"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { 
  History, 
  Share2, 
  Award, 
  Download, 
  CheckCircle2,
  Star,
  MapPin,
  Shield,
  Zap,
  Loader2,
  Truck,
  Package,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getMemberBookletHistory } from '@/services/dataService';
import { useRole } from '@/components/RoleContext';

export default function DevoteeDashboard() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const [memberId, setMemberId] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    let unsubscribe = () => {};

    const loadData = async () => {
      try {
        const { auth, db } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              let userDoc = await getDoc(doc(db, 'members', currentUser.uid));
              let member = userDoc.exists() ? userDoc.data() : null;

              if (!member && currentUser.email) {
                const q = query(collection(db, 'members'), where('email', '==', currentUser.email));
                const snap = await getDocs(q);
                if (!snap.empty) {
                  member = snap.docs[0].data();
                }
              }

              const thisYear = new Date().getFullYear();
              if (member) {
                setMemberId(member.membership_id || `OD/17/${thisYear}/001`);
                setProfileData(member);
                
                // Get submission history from Firestore
                try {
                  const histQ = query(collection(db, 'booklet_submissions'), where('user_id', '==', currentUser.uid));
                  const histSnap = await getDocs(histQ);
                  setHistory(histSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                } catch(e) {}
              } else {
                setProfileData({
                  id: currentUser.uid,
                  full_name: currentUser.displayName || 'भक्त',
                  role: 'DEVOTEE',
                  status: 'ACTIVE',
                  membership_type: 'BANK_LIFE'
                });
              }
            } catch (e) {}
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Devotee Dashboard Load Error:', err);
        setIsLoading(false);
      }
    };

    loadData();
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-saffron animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-saffron/60 animate-pulse">डेटा लोड हो रहा है...</p>
      </div>
    );
  }

  const deliveryStatus = profileData?.delivery_status || (profileData?.status === 'ACTIVE' ? 'PROCESSING' : 'PENDING');
  const isKitDispatched = deliveryStatus === 'DISPATCHED' || deliveryStatus === 'DELIVERED';

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">मेरा आध्यात्मिक खाता</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">भक्त ID: {memberId || '...'}</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron/20 via-orange-500/10 to-saffron/20 blur-[50px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="premium-card p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border-saffron/30">
          <div className="space-y-4 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-saffron/20 rounded-2xl text-saffron sacred-glow">
                <Award size={32} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-saffron/60">मेरी आध्यात्मिक संचित पूँजी</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white gold-text tracking-tighter">
              {history.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0).toLocaleString()}
            </h1>
            <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> कुल लिखित एवं सत्यापित 'राम नाम'
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 relative z-10">
            <div className="text-[60px] md:text-[100px] font-black text-white/[0.03] absolute -top-10 -right-10 select-none pointer-events-none">DHAN</div>
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-saffron/30 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700 bg-black/40 shadow-[0_0_30px_rgba(245,158,11,0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-saffron/5 rounded-full animate-pulse"></div>
              <Image 
                src="/logo.png" 
                alt="Ram Nam Bank" 
                width={140} 
                height={140} 
                className="object-cover scale-125 opacity-100 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
              />
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full mt-4 flex items-center gap-3 border transition-all ${
              profileData?.status === 'ACTIVE' && profileData?.membership_type
                ? 'bg-saffron/10 text-saffron border-saffron/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <Star size={14} className="animate-pulse" />
              <span>
                {profileData?.status === 'ACTIVE' && profileData?.membership_type ? (
                  profileData.membership_type === 'SPECIAL_LIFE' ? 'केन्द्रीय विशिष्ट आजीवन सदस्य' : 
                  profileData.membership_type === 'LIFE' ? 'केन्द्रीय आजीवन सदस्य' : 
                  profileData.membership_type === 'BANK_LIFE' ? 'श्री राम नाम लिखन सदस्य' : 
                  profileData.membership_type === 'REGULAR' ? 'साधारण सदस्य' : 
                  profileData.membership_type
                ) : 'सदस्यता प्लान चुनें (Pending)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${profileData?.status === 'ACTIVE' && profileData?.membership_type ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-amber-400 animate-ping'}`}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Kit / Booklet Order Tracking Card */}
      <div className="premium-card p-8 bg-gradient-to-r from-blue-500/10 via-saffron/5 to-transparent border-blue-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wider">स्वागत किट एवं पुस्तिका आर्डर स्थिति</h3>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  Welcome Kit & Pen
                </span>
              </div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">
                राम नाम लेखन पुस्तिका एवं विशेष कलम डिलीवरी ट्रैकिंग
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deliveryStatus === 'DELIVERED' ? (
              <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={14} /> सुरक्षित डिलीवर हुआ
              </span>
            ) : deliveryStatus === 'DISPATCHED' ? (
              <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2 shadow-sm animate-pulse">
                <Truck size={14} /> डाक / कुरियर द्वारा रवाना
              </span>
            ) : (
              <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-2">
                <Package size={14} /> किट पैकिंग / तैयारी में
              </span>
            )}
          </div>
        </div>

        {/* Tracking Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className={`p-4 rounded-2xl border transition-all ${
            profileData?.status === 'ACTIVE' 
              ? 'bg-green-500/5 border-green-500/20 text-green-400' 
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs font-black uppercase tracking-wider">1. सदस्यता स्वीकृत</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              {profileData?.status === 'ACTIVE' ? 'भुगतान सत्यापित एवं पास सक्रिय' : 'पेमेंट सत्यापन शेष'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            deliveryStatus === 'DISPATCHED' || deliveryStatus === 'DELIVERED'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
              : deliveryStatus === 'PROCESSING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Truck size={16} />
              <span className="text-xs font-black uppercase tracking-wider">2. पार्सल डिस्पैच</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              {profileData?.kit_courier_name ? `${profileData.kit_courier_name}` : 'अयोध्या धाम मुख्यालय द्वारा प्रेषित'}
              {profileData?.kit_tracking_id && <span className="block font-mono text-white/80 font-bold mt-0.5">TRK: {profileData.kit_tracking_id}</span>}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            deliveryStatus === 'DELIVERED' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} />
              <span className="text-xs font-black uppercase tracking-wider">3. घर पर डिलीवरी</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              {profileData?.address_line 
                ? `${profileData.address_line}${profileData.pincode ? ` (${profileData.pincode})` : ''}` 
                : 'पंजीकृत पते पर डाक द्वारा वितरण'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2">
            <History size={16} /> मेरा पुस्तिका इतिहास (Booklet History)
          </h3>
          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">दिनांक</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">प्रकार</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">संख्या</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">शाखा</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई इतिहास नहीं</td></tr>
                  ) : history.map((log, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 text-[10px] font-bold text-white/60">{mounted ? new Date(log.created_at).toLocaleDateString('hi-IN') : '--'}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-green-400/10 text-green-400">
                          जमा
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-white">{log.quantity?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">{log.branches?.name || 'मुख्यालय'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2">
            <MapPin size={16} /> मेरी आवंटित शाखा (My Branch)
          </h3>
          <div className="premium-card p-8 bg-blue-500/5 border-blue-500/20 space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">शाखा का नाम</p>
                <p className="text-sm font-bold text-white uppercase">{profileData?.branches?.name || profileData?.branch_code || 'मुख्य कार्यालय'}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white/20">स्थान</span>
                <span className="text-white/60">{profileData?.district || 'मथुरा'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white/20">राज्य</span>
                <span className="text-white/60">{profileData?.state || 'उत्तर प्रदेश'}</span>
              </div>
            </div>
            <p className="text-[9px] text-blue-400/60 italic font-bold uppercase leading-relaxed border-l-2 border-blue-500/30 pl-4 mt-4">
              पुस्तिका प्राप्त करने एवं जमा करने हेतु कृपया अपनी आवंटित शाखा से ही संपर्क करें।
            </p>
          </div>

          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2 mt-10">
            <Share2 size={16} /> प्रचार एवं सेवा
          </h3>
          <div className="premium-card p-8 bg-saffron/5 border-saffron/20 space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">आपका रेफरल कोड</p>
              <div className="text-2xl font-black text-white tracking-[0.3em] font-mono">{memberId ? memberId.replace(/\//g, '') : '...'}</div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-white/40 uppercase leading-relaxed text-center mb-6">
                इस लिंक को साझा कर नए भक्तों को राम नाम बैंक से जोड़ें
              </p>
              <button 
                onClick={() => {
                  const link = `${window.location.origin}/open-account?ref=${memberId.replace(/\//g, '')}`;
                  navigator.clipboard.writeText(link);
                  alert('रेफरल लिंक कॉपी हो गया!');
                }}
                className="w-full saffron-btn py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase"
              >
                <Share2 size={16} /> लिंक कॉपी करें
              </button>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2 mt-10">
            <Award size={16} /> मेरे प्रमाण पत्र
          </h3>
          <div className="space-y-4">
            {history.length > 0 ? (
              <div className="premium-card p-6 border-l-4 border-saffron space-y-4 group hover:bg-saffron/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-saffron/10 rounded-xl text-saffron"><Award size={20} /></div>
                  <button onClick={() => window.print()} className="p-2 text-white/20 hover:text-white transition-all"><Download size={18} /></button>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">सहभागिता प्रमाण पत्र</h4>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">पुस्तिका संचय प्रारंभ करने पर</p>
                </div>
              </div>
            ) : (
              <div className="premium-card p-8 text-center border-dashed border-white/10 opacity-40">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">पहली पुस्तिका जमा करने पर <br /> प्रमाण पत्र प्राप्त होगा</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
