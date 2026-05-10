"use client";

import React, { useState } from 'react';

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
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUsers, getBranches, updateUser } from '@/services/dataService';
import { useRole } from '@/components/RoleContext';
import { supabase } from '@/lib/supabase';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { role: currentUserRole } = useRole();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsersAndBranches = async () => {
    setIsLoading(true);
    const [userData, branchData] = await Promise.all([
      getUsers(),
      getBranches()
    ]);
    setUsers(userData);
    setBranches(branchData);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchUsersAndBranches();
  }, []);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsUpdating(true);
    const res = await updateUser(selectedUser.id, {
      role: selectedUser.role,
      branch_id: selectedUser.branch_id === 'MAIN' ? null : selectedUser.branch_id
    });
    
    if (res.success) {
      setIsEditModalOpen(false);
      fetchUsersAndBranches();
    } else {
      alert('त्रुटि: ' + res.error);
    }
    setIsUpdating(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस यूजर को हटाना चाहते हैं?')) return;
    
    setIsDeleting(true);
    // In a real app, you would call a deleteUser service
    const { error } = await supabase.from('members').delete().eq('id', id);
    
    if (!error) {
      alert('यूजर सफलतापूर्वक हटा दिया गया।');
      fetchUsersAndBranches();
    } else {
      alert('हटाने में त्रुटि: ' + error.message);
    }
    setIsDeleting(false);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-sacred-red/20 text-sacred-red border-sacred-red/20';
      case 'BRANCH_MANAGER': return 'bg-saffron/20 text-saffron border-saffron/20';
      case 'VOLUNTEER': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      default: return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  return (
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
             { label: 'कुल यूजर', val: users.length, icon: Users, color: 'text-saffron' },
             { label: 'प्रशासक', val: users.filter(u => u.role === 'ADMIN').length, icon: ShieldCheck, color: 'text-sacred-red' },
             { label: 'स्वयंसेवक', val: users.filter(u => u.role === 'VOLUNTEER').length, icon: CheckCircle, color: 'text-blue-500' },
             { label: 'ब्लॉक यूजर', val: users.filter(u => u.status !== 'ACTIVE').length, icon: Ban, color: 'text-red-500' },
           ].map((s, i) => (
             <div key={i} className="premium-card p-6 border-b-2 border-white/5 hover:border-saffron/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                      <s.icon size={20} />
                   </div>
                   <ArrowUpRight size={16} className="text-white/20" />
                </div>
                <h4 className="text-2xl font-black gold-text">{isLoading ? '...' : s.val}</h4>
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
                    {isLoading ? (
                       <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">डेटा लोड हो रहा है...</td></tr>
                    ) : users.length === 0 ? (
                       <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई यूजर नहीं मिला</td></tr>
                    ) : users.map((user) => (
                       <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-saffron border border-white/10">
                                   {user.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                   <p className="font-bold text-sm">{user.full_name}</p>
                                   <p className="text-[10px] text-white/30 lowercase">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                                {user.role?.replace('_', ' ') || 'DEVOTEE'}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs text-white/60 font-bold uppercase tracking-widest">{user.branches?.name || user.branch_code || 'Main'}</p>
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
                                <button 
                                  onClick={() => {
                                    setSelectedUser({...user});
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-saffron hover:bg-saffron/10 transition-all" title="भूमिका/शाखा बदलें"
                                >
                                   <ShieldCheck size={16} />
                                </button>
                                
                                {currentUserRole === 'ADMIN' && (
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isDeleting}
                                    className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all" title="यूजर हटाएं"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                                )}

                                <button className={`p-2 rounded-lg bg-white/5 transition-all ${user.status === 'ACTIVE' ? 'text-white/40 hover:text-red-500 hover:bg-red-500/10' : 'text-green-500 bg-green-500/10'}`} title={user.status === 'ACTIVE' ? 'ब्लॉक करें' : 'अनब्लॉक करें'}>
                                   {user.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Edit Role/Branch Modal */}
        {isEditModalOpen && selectedUser && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden sacred-glow"
               >
                  <div className="p-10 space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black font-serif gold-text uppercase">भूमिका और शाखा अलॉट करें</h3>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{selectedUser.full_name} के लिए अनुमति बदलें</p>
                     </div>

                     <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">भूमिका (Role)</label>
                           <select 
                             value={selectedUser.role}
                             onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-saffron/50 transition-all"
                           >
                              <option value="DEVOTEE" className="bg-black">भक्त (DEVOTEE)</option>
                              <option value="BRANCH_MANAGER" className="bg-black">शाखा प्रबंधक (BRANCH MANAGER)</option>
                              <option value="VOLUNTEER" className="bg-black">स्वयंसेवक (VOLUNTEER)</option>
                              <option value="ADMIN" className="bg-black">प्रशासक (ADMIN)</option>
                           </select>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">शाखा (Branch) आवंटन</label>
                           <select 
                             value={selectedUser.branch_id || 'MAIN'}
                             onChange={(e) => setSelectedUser({...selectedUser, branch_id: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-saffron/50 transition-all"
                           >
                              <option value="MAIN" className="bg-black">मुख्य कार्यालय (Main HQ)</option>
                              {branches.map(b => (
                                 <option key={b.id} value={b.id} className="bg-black">{b.name}</option>
                              ))}
                           </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                           <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/40">रद्द करें</button>
                           <button type="submit" disabled={isUpdating} className="flex-[2] saffron-btn py-4 text-[10px] flex items-center justify-center gap-2">
                              {isUpdating ? 'अपडेट हो रहा है...' : 'सेटिंग्स सुरक्षित करें'}
                           </button>
                        </div>
                     </form>
                  </div>
               </motion.div>
            </div>
         )}
      </div>
  );
}
