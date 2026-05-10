"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Share2, Users, Search, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReferralTreePage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        // Fetch all members who were referred
        const { data, error } = await supabase
          .from('members')
          .select('full_name, membership_id, referral_code, created_at, state, district')
          .not('referral_code', 'is', null)
          .order('created_at', { ascending: false });

        if (data) {
          // Now fetch the details of the referrers
          // The referral_code in the 'members' table is the membership_id (minus slashes) of the person who referred them
          // We need to match this.
          
          const formatted = await Promise.all(data.map(async (member) => {
            // Find who this referral code belongs to
            // Note: Our current logic stores the referral code as the membership_id without slashes
            const cleanCode = member.referral_code;
            
            // This is a bit slow for many records, but okay for now
            // In a better schema, we would have a 'referred_by_id' UUID column
            const { data: referrer } = await supabase
              .from('members')
              .select('full_name, membership_id')
              .ilike('membership_id', `%${cleanCode.split('').join('%')}%`) // Fuzzy match to handle slashes
              .maybeSingle();

            return {
              ...member,
              referrer_name: referrer?.full_name || 'अज्ञात (Unknown)',
              referrer_id: referrer?.membership_id || cleanCode
            };
          }));

          setReferrals(formatted);
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const filteredReferrals = referrals.filter(r => 
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.membership_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black font-serif uppercase text-white gold-text text-shadow-glow">रेफरल ट्री (Referral Tree)</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">किसने किसको जोड़ा - विस्तृत विवरण</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="भक्त या प्रचारक खोजें..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm"
          />
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">नया भक्त (New Devotee)</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">प्रचारक (Referred By)</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">स्थान (Location)</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">दिनांक (Date)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">डेटा लोड हो रहा है...</td></tr>
              ) : filteredReferrals.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई रेफरल रिकॉर्ड नहीं मिला</td></tr>
              ) : filteredReferrals.map((r, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{r.full_name}</p>
                        <p className="text-[9px] text-white/30 uppercase font-mono">{r.membership_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <Share2 size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/80">{r.referrer_name}</p>
                        <p className="text-[8px] text-white/20 uppercase font-mono">{r.referrer_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin size={14} className="text-saffron/40" />
                      <span className="text-[10px] font-bold uppercase">{r.district}, {r.state}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/40">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold uppercase">{new Date(r.created_at).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="premium-card p-8 bg-saffron/5 border-saffron/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-saffron/10 rounded-xl text-saffron"><Share2 size={24} /></div>
               <h3 className="text-sm font-black uppercase tracking-widest text-white">कुल रेफरल</h3>
            </div>
            <p className="text-4xl font-black text-white">{referrals.length}</p>
            <p className="text-[10px] text-white/30 uppercase mt-2">सिस्टम में कुल जोड़े गए भक्त</p>
         </div>
      </div>
    </div>
  );
}

const User = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
