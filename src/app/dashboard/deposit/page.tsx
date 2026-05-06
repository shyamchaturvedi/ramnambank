"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { History, Plus, Search, Filter, Download } from 'lucide-react';

export default function DepositPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black font-serif uppercase gold-text text-white">महाधन संचय (Deposits)</h2>
            <p className="text-white/40 text-sm mt-1">भक्तों द्वारा जमा किए गए राम नाम का लेखा-जोखा।</p>
          </div>
          <button className="saffron-btn flex items-center gap-3 text-xs">
            <Plus size={18} />
            नया संचय दर्ज करें
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input type="text" placeholder="भक्त का नाम या ID खोजें..." className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white text-sm" />
          </div>
          <div className="relative">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
             <select className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-saffron/50 text-white appearance-none text-sm">
                <option className="bg-black">सभी शाखाएं</option>
             </select>
          </div>
          <button className="px-6 py-4 rounded-xl border border-white/10 text-white/60 font-bold text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3">
             <Download size={18} /> रिपोर्ट डाउनलोड
          </button>
        </div>

        {/* Deposit Table */}
        <div className="premium-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">दिनांक</th>
                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">भक्त का नाम</th>
                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">शाखा</th>
                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">संख्या</th>
                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">स्थिति</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {[
                { date: '06 मई 2026', name: 'राहुल शर्मा', branch: 'अयोध्या मुख्य', count: '1,00,000', status: 'सत्यापित' },
                { date: '05 मई 2026', name: 'अमित कुमार', branch: 'वाराणसी केंद्र', count: '50,000', status: 'लंबित' },
                { date: '04 मई 2026', name: 'प्रिया सिंह', branch: 'अयोध्या मुख्य', count: '1,50,000', status: 'सत्यापित' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-medium">{row.date}</td>
                  <td className="p-6">
                    <p className="font-bold">{row.name}</p>
                    <p className="text-[10px] text-white/30 uppercase">RN-2026-{1024 + i}</p>
                  </td>
                  <td className="p-6 text-white/60">{row.branch}</td>
                  <td className="p-6 font-bold text-saffron">{row.count}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.status === 'सत्यापित' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
