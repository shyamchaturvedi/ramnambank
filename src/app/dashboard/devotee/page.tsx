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
  Loader2
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
    
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: member } = await supabase
            .from('members')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
            
          if (member) {
            setMemberId(member.membership_id);
            setProfileData(member);
            const historyData = await getMemberBookletHistory(member.id);
            setHistory(historyData);
          } else {
            setProfileData(null);
          }
        }
      } catch (err) {
        console.error('Devotee Dashboard Load Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-saffron animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-saffron/60 animate-pulse">डेटा लोड हो रहा है...</p>
      </div>
    );
  }

  // Hard Lock Logic: If no membership or overdue, show ONLY the lock screen
  if (!profileData?.membership_type || profileData?.is_overdue) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="premium-card p-10 md:p-16 max-w-xl border-red-500/30 space-y-8 animate-zoom-in shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto animate-bounce">
            <Zap size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">सदस्यता अनिवार्य है</h2>
            <p className="text-sm text-white/60 font-bold uppercase leading-relaxed">
              {!profileData?.membership_type 
                ? "पोर्टल की सेवाओं का उपयोग करने के लिए कृपया राम नाम बैंक की सदस्यता लें।" 
                : "आपका वार्षिक रखरखाव शुल्क (₹108) लंबित है। सेवाओं को जारी रखने के लिए भुगतान पूर्ण करें।"}
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/devotee/membership')}
            className="w-full py-5 bg-red-500 text-black font-black uppercase text-xs rounded-2xl shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:scale-105 transition-all"
          >
            {!profileData?.membership_type ? "अभी सदस्यता लें" : "अभी नवीनीकृत करें"}
          </button>
        </div>
      </div>
    );
  }

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
            <div className="text-[10px] font-black uppercase tracking-widest text-saffron px-6 py-3 bg-saffron/10 rounded-full mt-4 flex items-center gap-3 border border-saffron/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 transition-all cursor-default group/tag">
              <Star size={14} className="animate-pulse text-saffron" />
              <span className="gold-text">
                {profileData?.membership_type === 'REGULAR' ? 'साधारण सदस्य' : 
                 profileData?.membership_type === 'LIFE' ? 'आजीवन सदस्य' : 
                 profileData?.membership_type || 'साधारण सदस्य'}
              </span>
              <span className={`w-2 h-2 rounded-full animate-pulse ${profileData?.is_overdue ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'}`}></span>
            </div>
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
