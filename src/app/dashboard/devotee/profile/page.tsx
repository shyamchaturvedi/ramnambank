"use client";

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Edit3, Shield, Calendar } from 'lucide-react';
import DigitalIDCard from '@/components/DigitalIDCard';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: member, error } = await supabase
            .from('members')
            .select('*, branches(name)')
            .eq('email', session.user.email)
            .maybeSingle();
            
          if (member) {
            setUserData({
              name: member.full_name,
              role: member.role || 'DEVOTEE',
              id: member.membership_id,
              branch: member.branches?.name || member.branch_code || 'मुख्य कार्यालय',
              email: member.email,
              mobile: member.mobile_number,
              address: `${member.block || ''}, ${member.district || ''}, ${member.state || ''}`.replace(/^, /, ''),
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-saffron uppercase font-black tracking-widest text-xs animate-pulse">डेटा लोड हो रहा है...</div>;
  }

  if (!userData) {
    return <div className="h-96 flex items-center justify-center text-white/40 uppercase font-black tracking-widest text-xs">प्रोफ़ाइल नहीं मिली</div>;
  }

  // Helper for initials
  const initials = userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'RB';

  return (
    <div className="space-y-12 pb-20">
        <div className="flex justify-between items-end">
           <div className="flex items-center gap-10">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-saffron/20 sacred-glow">
                 <div className="absolute inset-0 bg-gradient-to-br from-saffron to-sacred-red opacity-10"></div>
                 <div className="w-full h-full flex items-center justify-center text-4xl font-black text-saffron bg-white/5">
                    {initials}
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black font-serif gold-text">{userData.name}</h2>
                    <span className="px-3 py-1 bg-sacred-red/20 text-sacred-red text-[8px] font-black rounded-full uppercase tracking-widest border border-sacred-red/20">{userData.role}</span>
                 </div>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">सदस्यता आईडी: {userData.id}</p>
              </div>
           </div>
           <button className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all">
              <Edit3 size={16} /> प्रोफाइल एडिट करें
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <div className="premium-card p-10 space-y-10">
                 <h3 className="text-xl font-bold uppercase tracking-widest border-b border-white/5 pb-6">व्यक्तिगत जानकारी</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: 'ईमेल पता', val: userData.email, icon: Mail },
                      { label: 'संपर्क सूत्र', val: userData.mobile, icon: Calendar },
                      { label: 'निवास स्थान', val: userData.address, icon: MapPin },
                      { label: 'मुख्य शाखा', val: userData.branch, icon: Shield },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6">
                         <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-saffron shrink-0">
                            <item.icon size={20} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-white/80">{item.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="premium-card p-10 bg-saffron/5 border border-saffron/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                 <h3 className="text-xl font-bold uppercase tracking-widest mb-8">आध्यात्मिक प्रगति</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span>अगला लक्ष्य (10 लाख नाम)</span>
                       <span className="text-saffron">75% पूर्ण</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                       <div className="h-full bg-saffron rounded-full sacred-glow w-[75%] transition-all duration-1000"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 flex flex-col items-center">
              <DigitalIDCard user={userData} />

              <div className="premium-card p-8 bg-sacred-red/5 border border-sacred-red/20 space-y-4 w-full">
                 <p className="text-[10px] font-black text-sacred-red uppercase tracking-widest">महत्वपूर्ण सूचना</p>
                 <p className="text-xs text-white/60 leading-loose">
                    कृपया अपनी पुस्तिका जमा करने की तारीख (15 जून) याद रखें।
                 </p>
              </div>
           </div>
        </div>
      </div>
  );
}
