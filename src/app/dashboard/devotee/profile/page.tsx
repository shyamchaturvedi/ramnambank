"use client";

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Edit3, Shield, Calendar, X } from 'lucide-react';
import DigitalIDCard from '@/components/DigitalIDCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
   const [userData, setUserData] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [totalNames, setTotalNames] = useState(0);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);
   const [formData, setFormData] = useState({
      name: '',
      mobile: '',
      address: ''
   });

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
               console.log('Fetching profile for:', session.user.email);
               const { data: member, error } = await supabase
                  .from('members')
                  .select('*')
                  .ilike('email', session.user.email || '')
                  .maybeSingle();

               if (error) console.error('Supabase error:', error);

               if (member) {
                  console.log('Member found:', member.full_name);
                  setUserData({
                     id: member.id,
                     membership_id: member.membership_id,
                     name: member.full_name,
                     role: member.role || 'DEVOTEE',
                     branch: member.branches?.name || member.branch_code || 'मुख्य कार्यालय',
                     email: member.email,
                     mobile: member.mobile_number,
                     address: `${member.district || ''}, ${member.state || ''}`.replace(/^, /, ''),
                  });
                  setFormData({
                     name: member.full_name,
                     mobile: member.mobile_number || '',
                     address: `${member.district || ''}, ${member.state || ''}`.replace(/^, /, '')
                  });

                  // Fetch Total Spiritual Wealth (Dynamic Progress)
                  const { data: submissions } = await supabase
                    .from('booklet_submissions')
                    .select('quantity')
                    .eq('user_id', member.id);
                  
                  if (submissions) {
                    const total = submissions.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
                    setTotalNames(total);
                  }
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

   const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('members')
        .update({
          full_name: formData.name,
          mobile_number: formData.mobile,
          district: formData.address.split(',')[0]?.trim() || '',
          state: formData.address.split(',')[1]?.trim() || ''
        })
        .eq('email', session.user.email);

      if (!error) {
        setUserData({ ...userData, name: formData.name, mobile: formData.mobile, address: formData.address });
        setIsEditModalOpen(false);
        alert('प्रोफ़ाइल अपडेट हो गई!');
      } else {
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

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
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all"
            >
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
                        <span className="text-saffron">{Math.min(100, Math.floor((totalNames / 1000000) * 100))}% पूर्ण</span>
                     </div>
                     <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div 
                          className="h-full bg-saffron rounded-full sacred-glow transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.floor((totalNames / 1000000) * 100))}%` }}
                        ></div>
                     </div>
                     <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">
                        कुल संचय: {totalNames.toLocaleString()} / 1,000,000
                     </p>
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

         {/* Edit Profile Modal */}
         {isEditModalOpen && (
           <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
             <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden animate-zoom-in">
               <div className="p-10 space-y-8">
                 <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black font-serif uppercase gold-text">प्रोफाइल अपडेट करें</h3>
                   <button onClick={() => setIsEditModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                     <X size={24} />
                   </button>
                 </div>

                 <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">पूरा नाम</label>
                     <input 
                       required 
                       type="text" 
                       value={formData.name} 
                       onChange={e => setFormData({...formData, name: e.target.value})} 
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">मोबाइल नंबर</label>
                     <input 
                       required 
                       type="tel" 
                       value={formData.mobile} 
                       onChange={e => setFormData({...formData, mobile: e.target.value})} 
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">पता (शहर, राज्य)</label>
                     <input 
                       required 
                       placeholder="उदा: मथुरा, उत्तर प्रदेश"
                       type="text" 
                       value={formData.address} 
                       onChange={e => setFormData({...formData, address: e.target.value})} 
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                     />
                   </div>

                   <div className="pt-4">
                     <button 
                       type="submit" 
                       disabled={isUpdating}
                       className="w-full saffron-btn py-5 flex items-center justify-center gap-3 font-black text-xs"
                     >
                       {isUpdating ? 'अपडेट हो रहा है...' : 'बदलाव सुरक्षित करें'}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}
      </div>
   );
}
