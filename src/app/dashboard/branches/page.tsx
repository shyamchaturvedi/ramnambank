"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MapPin, Plus, MoreVertical, ShieldCheck } from 'lucide-react';

export default function BranchesPage() {
  const branches = [
    { name: 'अयोध्या मुख्य शाखा', head: 'शांति स्वरूप दास', members: '12,500', status: 'मुख्यालय' },
    { name: 'वाराणसी केंद्र', head: 'रमेश चंद्र शास्त्री', members: '8,200', status: 'सक्रिय' },
    { name: 'पुरी शाखा', head: 'जगन मोहन महापात्र', members: '5,400', status: 'सक्रिय' },
    { name: 'हरिद्वार केंद्र', head: 'स्वामी चिन्मयानंद', members: '3,100', status: 'सक्रिय' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div>
            <h2 className="text-3xl font-black font-serif uppercase gold-text">शाखा प्रबंधन (Branches)</h2>
            <p className="text-white/40 text-sm mt-1">पूरे देश में फैली बैंक की शाखाओं का विवरण।</p>
          </div>
          <button className="saffron-btn flex items-center gap-3 text-xs">
            <Plus size={18} />
            नई शाखा जोड़ें
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <div key={i} className="premium-card p-8 group hover:border-saffron/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <button className="text-white/20 hover:text-white">
                   <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{branch.name}</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-white/40 uppercase tracking-widest">शाखा प्रबंधक:</span>
                    <span className="text-white/80">{branch.head}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-white/40 uppercase tracking-widest">कुल सदस्य:</span>
                    <span className="text-white/80">{branch.members}</span>
                 </div>
                 <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                       {branch.status}
                    </div>
                    <button className="text-[10px] font-bold text-saffron uppercase tracking-widest hover:underline">विवरण देखें</button>
                 </div>
              </div>
            </div>
          ))}
          
          <button className="premium-card p-8 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/20 hover:text-saffron hover:border-saffron/30 transition-all min-h-[250px]">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <Plus size={32} />
             </div>
             <span className="text-sm font-bold uppercase tracking-widest">नई शाखा प्रस्तावित करें</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
