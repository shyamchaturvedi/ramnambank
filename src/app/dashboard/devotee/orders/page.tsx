"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Award, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { auth, db } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');

        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              const userDoc = await getDoc(doc(db, 'members', currentUser.uid));
              if (userDoc.exists()) {
                setProfileData(userDoc.data());
              }

              const reqQuery = query(collection(db, 'membership_requests'), where('user_id', '==', currentUser.uid));
              const reqSnap = await getDocs(reqQuery);
              setMembershipRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
              console.error("Orders load error:", err);
            }
          }
          setIsLoading(false);
        });
      } catch (e) {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-saffron uppercase font-black tracking-widest text-xs animate-pulse">
        आर्डर एवं किट डिलीवरी विवरण लोड हो रहा है...
      </div>
    );
  }

  const deliveryStatus = profileData?.delivery_status || (profileData?.status === 'ACTIVE' && profileData?.membership_type ? 'PROCESSING' : 'NOT_ORDERED');

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-serif uppercase text-white gold-text">मेरे आर्डर एवं स्वागत किट</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">
            श्री राम नाम लेखन सामग्री एवं पुस्तिका डिलीवरी ट्रैकिंग
          </p>
        </div>
      </div>

      {/* Main Order Card */}
      {deliveryStatus === 'NOT_ORDERED' ? (
        <div className="premium-card p-10 text-center space-y-6 border border-white/10 bg-white/[0.02]">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Package size={32} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">कोई सक्रिय किट आर्डर नहीं है</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              राम नाम लेखन पुस्तिका और सनातनी लेखन किट प्राप्त करने के लिए कृपया पहले अपनी सदस्यता योजना चुनें और सक्रिय करें।
            </p>
          </div>
          <Link 
            href="/dashboard/devotee/membership"
            className="inline-flex items-center gap-3 px-8 py-4 saffron-btn text-xs font-black uppercase tracking-widest"
          >
            <Award size={16} /> सदस्यता प्लान चुनें
          </Link>
        </div>
      ) : (
        <div className="premium-card p-8 bg-gradient-to-r from-blue-500/10 via-saffron/5 to-transparent border-blue-500/20 relative overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Truck size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">स्वागत किट एवं पुस्तिका आर्डर</h3>
                  <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                    Welcome Kit & Pen
                  </span>
                </div>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">
                  आर्डर आईडी: RN-KIT-{profileData?.membership_id?.replace(/[^a-zA-Z0-9]/g, '') || '001'}
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
            <div className={`p-5 rounded-2xl border transition-all ${
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

            <div className={`p-5 rounded-2xl border transition-all ${
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
                {profileData?.kit_tracking_id && (
                  <span className="block font-mono text-white/80 font-bold mt-0.5">TRK: {profileData.kit_tracking_id}</span>
                )}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              deliveryStatus === 'DELIVERED' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Package size={16} />
                <span className="text-xs font-black uppercase tracking-wider">3. घर पर डिलीवरी</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                {profileData?.address || 'पंजीकृत डाक पते पर वितरण'}
              </p>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-[10px] font-black text-saffron uppercase tracking-widest flex items-center gap-2">
              <MapPin size={13} /> डिलीवरी पता (Dispatch Address)
            </span>
            <p className="text-xs text-white/80 font-medium">
              {profileData?.address || 'डाक पता उपलब्ध नहीं है। कृपया प्रोफ़ाइल में पता अपडेट करें।'}
            </p>
          </div>
        </div>
      )}

      {/* Membership Requests History Table */}
      {membershipRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">सदस्यता एवं पेमेंट अनुरोध इतिहास</h3>
          <div className="premium-card p-6 border border-white/10 divide-y divide-white/5 space-y-4">
            {membershipRequests.map((req) => (
              <div key={req.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{req.plan_name}</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">UTR / Txn ID: {req.utr_number || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-saffron">₹{req.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    req.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {req.status === 'APPROVED' ? 'स्वीकृत (Approved)' : req.status === 'REJECTED' ? 'अस्वीकृत' : 'सत्यापन प्रक्रियाधीन (Pending)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
