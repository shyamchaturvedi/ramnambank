"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  History, 
  Share2, 
  Award, 
  Download, 
  CheckCircle2
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

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: member } = await supabase
            .from('members')
            .select('id, membership_id')
            .eq('email', session.user.email)
            .maybeSingle();
            
          if (member) {
            setMemberId(member.membership_id);
            const historyData = await getMemberBookletHistory(member.id);
            setHistory(historyData);
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

  return (
    <div className="space-y-10 pb-20">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">मेरा आध्यात्मिक खाता</h2>
            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">भक्त ID: {memberId || '...'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      {isLoading ? (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">डेटा लोड हो रहा है...</td></tr>
                      ) : history.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई इतिहास नहीं</td></tr>
                      ) : history.map((log, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6 text-[10px] font-bold text-white/60">{mounted ? new Date(log.deposited_at).toLocaleDateString('hi-IN') : '--'}</td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-green-400/10 text-green-400">
                              जमा
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-white">{log.ram_nam_count?.toLocaleString()}</td>
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
