"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Building2, 
  Box, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  History,
  BookOpen,
  Award,
  Download,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAdminStats, getMemberBookletHistory } from '@/services/dataService';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<'ADMIN' | 'DEVOTEE'>('ADMIN'); // Default to ADMIN for now
  const [stats, setStats] = useState({
    totalBhakt: 0,
    totalBranches: 0,
    activeBranches: 0,
    totalBooks: 0,
    totalPens: 0,
    totalDonations: '₹0'
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For testing, let's assume a member ID if it's a devotee
  const mockMemberId = 'OD/17/0001'; 

  useEffect(() => {
    const loadData = async () => {
      if (userRole === 'ADMIN') {
        const realStats = await getAdminStats();
        if (realStats) {
          setStats(prev => ({
            ...prev,
            totalBhakt: realStats.totalBhakt,
            totalBranches: realStats.totalBranches,
            activeBranches: realStats.activeBranches,
            totalBooks: realStats.totalBooks
          }));
        }
      } else {
        const historyData = await getMemberBookletHistory(mockMemberId);
        setHistory(historyData);
      }
      setIsLoading(false);
    };
    loadData();
  }, [userRole]);

  const statCards = [
    { title: 'कुल भक्त', value: stats.totalBhakt, icon: Users, trend: '+12%', color: 'from-orange-500/20 to-transparent' },
    { title: 'कुल शाखाएं', value: stats.totalBranches, icon: Building2, subtitle: `${stats.activeBranches} सक्रिय`, color: 'from-blue-500/20 to-transparent' },
    { title: 'कुल बुकलेट स्टॉक', value: stats.totalBooks, icon: Box, trend: 'भरपूर', color: 'from-green-500/20 to-transparent' },
    { title: 'कुल दान संग्रह', value: stats.totalDonations, icon: IndianRupee, trend: '+5%', color: 'from-yellow-500/20 to-transparent' },
  ];

  if (userRole === 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="space-y-10 pb-20">
          <div className="flex justify-end">
             <button onClick={() => setUserRole('DEVOTEE')} className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-saffron">Switch to Devotee View (Test)</button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">एडमिन डैशबोर्ड</h2>
              <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">राम नाम बैंक | अयोध्या धाम मुख्यालय</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <Clock size={16} className="text-saffron" />
              <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                आज: {new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={stat.title}
                className={`premium-card p-8 bg-gradient-to-br ${stat.color} hover:border-saffron/30 transition-all cursor-pointer group`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                    <stat.icon size={24} />
                  </div>
                  {stat.trend && (
                    <span className="text-[9px] font-black px-2 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg flex items-center gap-1">
                      <TrendingUp size={10} /> {stat.trend}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-white">{stat.value.toLocaleString()}</h3>
                    {stat.subtitle && <span className="text-[9px] text-white/20 font-bold uppercase">{stat.subtitle}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2"><Clock size={16} /> हालिया गतिविधियां</h3>
              <div className="premium-card p-2">
                {[
                  { type: 'USER', text: 'नया भक्त पंजीकृत: निर्मल स्वाइँ (केंद्रपाड़ा)', time: '2 मिनट पहले', icon: Users, color: 'text-blue-400' },
                  { type: 'STOCK', text: 'स्टॉक क्रेडिट: 500 बुकलेट्स (अयोध्या)', time: '15 मिनट पहले', icon: Box, color: 'text-green-400' },
                  { type: 'BRANCH', text: 'नई शाखा प्रस्तावित: पुरी (OD/26)', time: '1 घंटा पहले', icon: Building2, color: 'text-saffron' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-all rounded-3xl group border-b border-white/5 last:border-0">
                    <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center ${item.color}`}><item.icon size={20} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-saffron transition-colors">{item.text}</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron">सिस्टम एवं रेफरल</h3>
              <div className="premium-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase">डेटाबेस कनेक्शन</span>
                  <span className="text-[9px] font-black text-green-400 uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> सक्रिय</span>
                </div>
                <div className="bg-saffron/10 border border-saffron/20 p-4 rounded-xl flex gap-3">
                   <AlertCircle size={16} className="text-saffron shrink-0" />
                   <p className="text-[9px] font-bold text-saffron/80 leading-relaxed uppercase">12 शाखाओं का स्टॉक कम है।</p>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">टॉप प्रचारक (Referrals)</h4>
                  <div className="space-y-2">
                    {[
                      { code: 'AYO-108', count: 45 },
                      { code: 'VNS-501', count: 32 },
                      { code: 'GKP-202', count: 18 }
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-saffron/30 transition-all">
                        <span className="text-[10px] font-bold text-white/60">{r.code}</span>
                        <span className="text-[10px] font-black text-saffron">{r.count} भक्त</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Devotee View
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <div className="flex justify-end">
           <button onClick={() => setUserRole('ADMIN')} className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-saffron">Switch to Admin View (Test)</button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">मेरा आध्यात्मिक खाता</h2>
            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">भक्त ID: {mockMemberId}</p>
          </div>
        </div>

        {/* Devotee History Table & Certificates Grid */}
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
                          <td className="px-8 py-6 text-[10px] font-bold text-white/60">{new Date(log.created_at).toLocaleDateString('hi-IN')}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${log.transaction_type === 'DEBIT' ? 'bg-red-500/10 text-red-500' : 'bg-green-400/10 text-green-400'}`}>
                              {log.transaction_type === 'DEBIT' ? 'जारी' : 'जमा'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-white">{log.quantity}</td>
                          <td className="px-8 py-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">{log.branches?.name || 'मुख्यालय'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>

           {/* Certificates Side Panel */}
           <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2">
                <Award size={16} /> मेरे प्रमाण पत्र
              </h3>
              <div className="space-y-4">
                 {history.filter(l => l.transaction_type === 'CREDIT').length > 0 ? (
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

                 {history.filter(l => l.transaction_type === 'CREDIT').reduce((acc, curr) => acc + curr.quantity, 0) >= 10 && (
                   <div className="premium-card p-6 border-l-4 border-yellow-500 space-y-4 group hover:bg-yellow-500/5 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><CheckCircle2 size={20} /></div>
                         <button onClick={() => window.print()} className="p-2 text-white/20 hover:text-white transition-all"><Download size={18} /></button>
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white">विशेष साधक सम्मान</h4>
                         <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">10+ पुस्तिकाएं पूर्ण करने पर</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
