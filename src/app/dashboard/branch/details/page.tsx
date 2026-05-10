"use client";

import React, { useState, useEffect } from 'react';

import { Building2, Save, MapPin, Phone, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getBranches } from '@/services/dataService';
import { supabase } from '@/lib/supabase';

export default function MyBranchEdit() {
  const [branchData, setBranchData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    const loadBranch = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: member } = await supabase
            .from('members')
            .select('branch_code')
            .eq('email', session.user.email)
            .maybeSingle();

          if (member?.branch_code) {
            const branches = await getBranches();
            const myBranch = branches.find(b => b.code === member.branch_code);
            setBranchData(myBranch);
          }
        }
      } catch (err) {
        console.error('Error loading branch:', err);
      }
    };
    loadBranch();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate Supabase Update
    setTimeout(() => {
      setIsSaving(false);
      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);
    }, 1500);
  };

  if (!branchData) return <div className="text-white/20 p-20 text-center uppercase font-black tracking-widest">शाखा का विवरण लोड हो रहा है...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black font-serif uppercase gold-text text-white">मेरी शाखा का प्रबंधन</h2>
            <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">शाखा कोड: {branchData.code}</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="saffron-btn flex items-center gap-3 px-8"
          >
            {isSaving ? <span className="animate-pulse">सेव हो रहा है...</span> : <><Save size={18} /> अपडेट करें</>}
          </button>
        </div>

        {status === 'SUCCESS' && (
          <div className="p-4 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center gap-3 text-green-400 animate-fade-in">
            <CheckCircle2 size={20} />
            <p className="text-xs font-bold uppercase tracking-widest">शाखा का विवरण सफलतापूर्वक अपडेट कर दिया गया है।</p>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-8">
          {/* General Info */}
          <section className="premium-card p-10 space-y-8">
            <div className="flex items-center gap-3 text-saffron">
              <Building2 size={20} />
              <h3 className="font-bold tracking-widest uppercase text-[10px]">शाखा विवरण (Branch Info)</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">शाखा का नाम (Branch Name)</label>
                <input 
                  type="text" 
                  value={branchData.name}
                  onChange={(e) => setBranchData({...branchData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">संपर्क नंबर (Phone)</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                    <input 
                      type="tel" 
                      value={branchData.phone}
                      onChange={(e) => setBranchData({...branchData, phone: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">शहर / जिला (City)</label>
                  <div className="relative group">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                    <input 
                      readOnly
                      type="text" 
                      value={branchData.city}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white/20 text-sm font-bold" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">पूरा पता (Full Address)</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-5 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                  <textarea 
                    rows={4}
                    value={branchData.address}
                    onChange={(e) => setBranchData({...branchData, address: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Guidelines */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-4">
             <AlertCircle size={20} className="text-white/20 shrink-0" />
             <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed tracking-wider">
               सूचना: शाखा का नाम और संपर्क विवरण वेबसाइट के "शाखाएं" (Branches) पेज पर सार्वजनिक रूप से दिखाई देंगे। कृपया सुनिश्चित करें कि जानकारी सही है।
             </p>
          </div>
        </form>
      </div>
  );
}
