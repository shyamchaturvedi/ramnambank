"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  ShieldCheck, 
  Ban, 
  UserPlus, 
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: '1', name: 'साहिल कुमार', role: 'ADMIN', status: 'ACTIVE', email: 'admin@ramnam.in', branch: 'अयोध्या मुख्य' },
    { id: '2', name: 'राहुल शर्मा', role: 'BRANCH_MANAGER', status: 'ACTIVE', email: 'rahul@ramnam.in', branch: 'इंदौर' },
    { id: '3', name: 'अमित सिंह', role: 'VOLUNTEER', status: 'ACTIVE', email: 'amit@ramnam.in', branch: 'वाराणसी' },
    { id: '4', name: 'संदीप वर्मा', role: 'DEVOTEE', status: 'BLOCKED', email: 'sandeep@gmail.com', branch: 'मुंबई' },
  ]);

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-sacred-red/20 text-sacred-red border-sacred-red/20';
      case 'BRANCH_MANAGER': return 'bg-saffron/20 text-saffron border-saffron/20';
      case 'VOLUNTEER': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      default: return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <h2 className="text-3xl font-black font-serif gold-text uppercase">यूजर मैनेजमेंट</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Control roles, permissions and access</p>
           </div>
           <button className="saffron-btn scale-110 flex items-center gap-2">
              <UserPlus size={18} /> नया यूजर जोड़ें
           </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'कुल यूजर', val: '1.2K', icon: Users, color: 'text-saffron' },
             { label: 'प्रशासक', val: '05', icon: ShieldCheck, color: 'text-sacred-red' },
             { label: 'स्वयंसेवक', val: '45', icon: CheckCircle, color: 'text-blue-500' },
             { label: 'ब्लॉक यूजर', val: '12', icon: Ban, color: 'text-red-500' },
           ].map((s, i) => (
             <div key={i} className="premium-card p-6 border-b-2 border-white/5 hover:border-saffron/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                      <s.icon size={20} />
                   </div>
                   <ArrowUpRight size={16} className="text-white/20" />
                </div>
                <h4 className="text-2xl font-black gold-text">{s.val}</h4>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
             </div>
           ))}
        </div>

        {/* User Table */}
        <div className="premium-card overflow-hidden">
           <div className="p-8 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                 <input 
                   type="text" 
                   placeholder="नाम, ईमेल या आईडी से खोजें..." 
                   className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-saffron/50 transition-all"
                 />
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all">
                    <Filter size={16} /> फ़िल्टर
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">यूजर जानकारी</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">भूमिका (Role)</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">शाखा (Branch)</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">स्थिति</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">कार्रवाई</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                       <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-saffron border border-white/10">
                                   {user.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-sm">{user.name}</p>
                                   <p className="text-[10px] text-white/30 lowercase">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                                {user.role.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs text-white/60 font-bold uppercase tracking-widest">{user.branch}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                {user.status === 'ACTIVE' ? (
                                   <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">सक्रिय</span></>
                                ) : (
                                   <><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">ब्लॉक</span></>
                                )}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-saffron hover:bg-saffron/10 transition-all" title="भूमिका बदलें">
                                   <ShieldCheck size={16} />
                                </button>
                                <button className={`p-2 rounded-lg bg-white/5 transition-all ${user.status === 'ACTIVE' ? 'text-white/40 hover:text-red-500 hover:bg-red-500/10' : 'text-green-500 bg-green-500/10'}`} title={user.status === 'ACTIVE' ? 'ब्लॉक करें' : 'अनब्लॉक करें'}>
                                   {user.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                   <MoreVertical size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
