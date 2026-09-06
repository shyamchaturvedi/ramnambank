"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Building2, 
  Box, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAdminStats, getRecentActivities, getTopReferrals } from '@/services/dataService';
import { useRole } from '@/components/RoleContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const [stats, setStats] = useState({
    totalBhakt: 0,
    totalBranches: 0,
    activeBranches: 0,
    totalBooks: 0,
    totalDonations: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [topReferrals, setTopReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        const [realStats, recentActs, referrals] = await Promise.all([
          getAdminStats(),
          getRecentActivities(),
          getTopReferrals()
        ]);

        if (realStats) {
          setStats({
            totalBhakt: realStats.totalBhakt,
            totalBranches: realStats.totalBranches,
            activeBranches: realStats.activeBranches,
            totalBooks: realStats.totalBooks,
            totalDonations: realStats.totalDonations
          });
        }
        setActivities(recentActs);
        setTopReferrals(referrals.slice(0, 5));
      } catch (err) {
        console.error('Admin Dashboard Load Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [role, router]);

  const statCards = [
    { 
      title: 'कुल भक्त', 
      value: stats.totalBhakt, 
      icon: Users, 
      trend: '+12%', 
      color: 'from-orange-500/20 to-transparent',
      link: '/dashboard/admin/users',
      hint: 'भक्त प्रबंधन'
    },
    { 
      title: 'कुल शाखाएं', 
      value: stats.totalBranches, 
      icon: Building2, 
      subtitle: `${stats.activeBranches} सक्रिय`, 
      color: 'from-blue-500/20 to-transparent',
      link: '/dashboard/admin/branches',
      hint: 'शाखा सूची'
    },
    { 
      title: 'कुल बुकलेट स्टॉक', 
      value: stats.totalBooks, 
      icon: Box, 
      trend: 'भरपूर', 
      color: 'from-green-500/20 to-transparent',
      link: '/dashboard/admin/inventory',
      hint: 'इन्वेंट्री'
    },
    { 
      title: 'कुल दान संग्रह', 
      value: stats.totalDonations, 
      icon: IndianRupee, 
      trend: '+5%', 
      color: 'from-yellow-500/20 to-transparent',
      link: '/dashboard/admin/donations',
      hint: 'दान व रसीदें'
    },
  ];

  return (
    <div className="space-y-10 pb-20">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black font-serif uppercase text-white gold-text">एडमिन डैशबोर्ड</h2>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">राम नाम बैंक | अयोध्या धाम मुख्यालय</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
          <Clock size={16} className="text-saffron" />
          <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">
            आज: {mounted ? new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '--'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            onClick={() => router.push(stat.link)}
            className={`premium-card p-8 bg-gradient-to-br ${stat.color} hover:border-saffron/50 hover:shadow-lg hover:shadow-saffron/10 transition-all cursor-pointer group relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-saffron group-hover:scale-110 group-hover:bg-saffron/20 transition-all">
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-2">
                {stat.trend && (
                  <span className="text-[9px] font-black px-2 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg flex items-center gap-1">
                    <TrendingUp size={10} /> {stat.trend}
                  </span>
                )}
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-saffron group-hover:bg-saffron/10 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors">{stat.title}</p>
                <span className="text-[8px] font-black uppercase text-saffron opacity-0 group-hover:opacity-100 transition-opacity">{stat.hint} &rarr;</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-white group-hover:text-saffron transition-colors">{stat.value.toLocaleString()}</h3>
                {stat.subtitle && <span className="text-[9px] text-white/20 font-bold uppercase">{stat.subtitle}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2"><Clock size={16} /> हालिया गतिविधियां</h3>
            <button 
              onClick={() => router.push('/dashboard/admin/users')}
              className="text-[10px] font-bold text-white/40 hover:text-saffron transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              सभी देखें <ChevronRight size={12} />
            </button>
          </div>
          <div className="premium-card p-2">
            {activities.length === 0 ? (
               <div className="py-20 text-center text-white/20 uppercase font-black tracking-widest text-[10px]">कोई हालिया गतिविधि नहीं</div>
            ) : activities.map((item, i) => (
              <div 
                key={i} 
                onClick={() => {
                  if (item.type === 'USER') {
                    router.push('/dashboard/admin/users');
                  } else {
                    router.push('/dashboard/admin/inventory');
                  }
                }}
                className="flex items-center gap-6 p-6 hover:bg-white/[0.04] transition-all rounded-3xl group border-b border-white/5 last:border-0 cursor-pointer"
              >
                <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                   {item.type === 'USER' ? <Users size={20} /> : <Box size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white group-hover:text-saffron transition-colors">{item.text}</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">{mounted ? new Date(item.time).toLocaleString('hi-IN') : '--'}</p>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-saffron group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron">सिस्टम एवं रेफरल</h3>
            <button 
              onClick={() => router.push('/dashboard/admin/referrals')}
              className="text-[10px] font-bold text-white/40 hover:text-saffron transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              प्रचारक सूची <ChevronRight size={12} />
            </button>
          </div>
          <div className="premium-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase">डेटाबेस कनेक्शन</span>
              <span className="text-[9px] font-black text-green-400 uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> सक्रिय</span>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">टॉप प्रचारक (Referrals)</h4>
              </div>
              <div className="space-y-2">
                {topReferrals.length === 0 ? (
                   <p className="text-[9px] text-white/20 uppercase">डेटा उपलब्ध नहीं</p>
                ) : topReferrals.map((r, i) => (
                  <div 
                    key={i} 
                    onClick={() => router.push('/dashboard/admin/referrals')}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-saffron/30 hover:bg-white/[0.08] transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-white/60 group-hover:text-white">{r.code}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-saffron">{r.count} भक्त</span>
                      <ChevronRight size={12} className="text-white/20 group-hover:text-saffron group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
