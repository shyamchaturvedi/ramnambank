"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Award, 
  Package, 
  CheckCircle2, 
  IndianRupee,
  Clock,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReportsPage() {
  const [filterPeriod, setFilterPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('TODAY');
  const [stats, setStats] = useState({
    passesToday: 0,
    totalOrders: 0,
    fulfilledOrders: 0,
    pendingOrders: 0,
    totalMoneyCollected: 0,
    todayMoneyCollected: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');

      const reqSnap = await getDocs(collection(db, 'membership_requests'));
      const allOrders: any[] = await Promise.all(
        reqSnap.docs.map(async (d) => {
          const reqData = d.data() as any;
          let memberInfo: any = {};
          try {
            if (reqData.user_id) {
              const memSnap = await getDoc(doc(db, 'members', reqData.user_id));
              if (memSnap.exists()) memberInfo = memSnap.data();
            }
          } catch (e) {}

          return {
            id: d.id,
            ...reqData,
            members: memberInfo
          };
        })
      );

      const donSnap = await getDocs(collection(db, 'donations'));
      const allDonations: any[] = donSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

      // Calculate Dates
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const todayOrders = allOrders.filter((o: any) => o.created_at?.startsWith(todayStr));
      const todayApproved = todayOrders.filter((o: any) => o.status === 'APPROVED');
      const allApproved = allOrders.filter((o: any) => o.status === 'APPROVED');

      const totalRevenue = allApproved.reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0) +
                           allDonations.filter((d: any) => d.status === 'APPROVED').reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);

      const todayRevenue = todayApproved.reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0);

      setStats({
        passesToday: todayApproved.length,
        totalOrders: allOrders.length,
        fulfilledOrders: allApproved.length,
        pendingOrders: allOrders.filter((o: any) => o.status === 'PENDING').length,
        totalMoneyCollected: totalRevenue,
        todayMoneyCollected: todayRevenue
      });

      setRecentOrders(allOrders);
    } catch (err) {
      console.error('Report Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [filterPeriod]);

  const handleExportCSV = () => {
    const headers = ["Order ID,Devotee Name,Mobile,Plan,Amount,Status,Date\n"];
    const rows = recentOrders.map(o => 
      `"${o.id}","${o.members?.full_name || ''}","${o.members?.mobile_number || ''}","${o.plan_name || ''}","${o.amount}","${o.status}","${new Date(o.created_at).toLocaleDateString()}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `RamNamBank_DailyReport_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black uppercase tracking-widest">
            <BarChart3 size={13} />
            <span>लाइव व्यापार एवं वितरण अंतर्दृष्टि</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-serif gold-text uppercase tracking-tight">
            दैनिक रिपोर्ट एवं व्यापार विश्लेषण
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Real-time Passes, Orders, Fulfillment & Revenue Insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()} 
            className="px-5 py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all hover:border-white/20 active:scale-95"
          >
            <Printer size={16} /> प्रिंट रिपोर्ट
          </button>
          <button 
            onClick={handleExportCSV}
            className="saffron-btn px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_25px_rgba(255,153,51,0.2)] active:scale-95"
          >
            <Download size={16} /> CSV एक्सपोर्ट
          </button>
        </div>
      </div>

      {/* 4 Key Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric 1: Daily Passes Created */}
          <div className="premium-card p-6 bg-gradient-to-br from-amber-500/15 to-transparent border-l-4 border-amber-500 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">आज के पास</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">आज बने सदस्यता पास</p>
              <h3 className="text-3xl font-black text-white">{stats.passesToday}</h3>
              <p className="text-[9px] text-green-400 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> {stats.fulfilledOrders} कुल सक्रिय पास
              </p>
            </div>
          </div>

          {/* Metric 2: Total Orders Received */}
          <div className="premium-card p-6 bg-gradient-to-br from-blue-500/15 to-transparent border-l-4 border-blue-500 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                <Package size={24} />
              </div>
              <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">आर्डर इनफ्लो</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">कुल प्राप्त आर्डर</p>
              <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
              <p className="text-[9px] text-amber-400 font-bold mt-1">
                {stats.pendingOrders} आर्डर वेरिफिकेशन हेतु लंबित
              </p>
            </div>
          </div>

          {/* Metric 3: Orders Fulfilled */}
          <div className="premium-card p-6 bg-gradient-to-br from-green-500/15 to-transparent border-l-4 border-green-500 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">फुलफिलमेंट</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">सफल / पूर्ण आर्डर (Fulfilled)</p>
              <h3 className="text-3xl font-black text-white">{stats.fulfilledOrders}</h3>
              <p className="text-[9px] text-white/40 font-bold mt-1">
                {stats.totalOrders > 0 ? Math.round((stats.fulfilledOrders / stats.totalOrders) * 100) : 100}% कम्प्लीशन रेट
              </p>
            </div>
          </div>

          {/* Metric 4: Total Money Collected */}
          <div className="premium-card p-6 bg-gradient-to-br from-saffron/20 to-transparent border-l-4 border-saffron space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-saffron/20 text-saffron rounded-2xl flex items-center justify-center">
                <IndianRupee size={24} />
              </div>
              <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-saffron/20 text-saffron rounded-full border border-saffron/30">कुल संकलन</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">कुल एकत्रित राशि</p>
              <h3 className="text-3xl font-black gold-text">₹{stats.totalMoneyCollected.toLocaleString()}</h3>
              <p className="text-[9px] text-saffron/70 font-bold mt-1">
                आज का संकलन: ₹{stats.todayMoneyCollected.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Orders & Passes Fulfillment Log */}
        <div className="premium-card overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-widest gold-text">दैनिक आर्डर एवं पास वितरण विवरण</h3>
              <p className="text-[9px] text-white/40 font-bold uppercase">Comprehensive log of daily membership and passes activity</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">लाइव डेटा सिंक</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">भक्त का नाम / आईडी</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">शाखा / स्थान</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">प्लान विवरण</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">जमा राशि</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">आर्डर स्थिति</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">तारीख</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-white/20 uppercase font-black tracking-widest text-[10px]">
                      कोई आर्डर रिकॉर्ड उपलब्ध नहीं है
                    </td>
                  </tr>
                ) : recentOrders.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{row.members?.full_name || 'भक्त'}</p>
                      <p className="text-[9px] font-mono text-saffron/60">{row.members?.membership_id || row.user_id?.substring(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      <p className="text-xs">{row.members?.block || 'केंद्र'}</p>
                      <p className="text-[8px] text-white/30 uppercase">{row.members?.district || 'ओड़िशा'}</p>
                    </td>
                    <td className="px-6 py-4 text-white/80 font-bold">
                      {row.plan_name}
                    </td>
                    <td className="px-6 py-4 font-black gold-text text-sm">
                      ₹{row.amount}/-
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        row.status === 'APPROVED' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {row.status === 'APPROVED' ? 'पूर्ण (Fulfilled)' : 'लंबित (Pending)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40 font-mono text-[10px]">
                      {new Date(row.created_at).toLocaleDateString('hi-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
