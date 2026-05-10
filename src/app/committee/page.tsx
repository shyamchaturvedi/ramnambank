"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  ChevronLeft, 
  Award, 
  ShieldCheck, 
  Globe,
  MapPin,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const trustBodies = [
  { 
    title: 'Governing Body', 
    desc: 'संस्थान के मुख्य नीति-निर्धारक और संरक्षक मंडल।',
    icon: Award 
  },
  { 
    title: 'Executive Body', 
    desc: 'दैनिक कार्यों और प्रबंधन की जिम्मेदारी संभालने वाली कार्यकारिणी समिति।',
    icon: ShieldCheck 
  },
  { 
    title: 'Special Adviser Body', 
    desc: 'आध्यात्मिक और तकनीकी विकास हेतु विशेषज्ञ सलाहकार मंडल।',
    icon: Users 
  }
];

import { getCommitteeMembers } from '@/services/dataService';

export default function CommitteePage() {
  const [kendraparaCommittee, setKendraparaCommittee] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      // Fetching committee for Kendrapara branch (OD/17)
      // In a real scenario, we'd use the UUID of the Kendrapara branch
      const data = await getCommitteeMembers(); 
      setKendraparaCommittee(data);
      setLoading(false);
    };
    loadData();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white selection:bg-saffron selection:text-black flex flex-col">
      <nav className="p-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all">
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">मुख्य पृष्ठ</span>
        </Link>
        <h1 className="text-xl font-bold font-serif gold-text uppercase tracking-widest">ट्रस्ट एवं समितियां</h1>
        <div className="w-20"></div>
      </nav>

      <main className="flex-1 py-20 px-6 max-w-7xl mx-auto w-full space-y-32">
        {/* Trust Structure */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black font-serif gold-text uppercase">ट्रस्ट संरचना</h2>
             <p className="text-white/40 text-sm tracking-[0.2em] font-bold uppercase">विश्वव्यापी प्रबंधन समिति</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBodies.map((body, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-10 space-y-6 text-center group hover:border-saffron/30 transition-all"
              >
                <div className="w-20 h-20 rounded-3xl bg-saffron/10 flex items-center justify-center text-saffron mx-auto group-hover:bg-saffron group-hover:text-black transition-all">
                  <body.icon size={32} />
                </div>
                <h3 className="text-2xl font-black gold-text uppercase">{body.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed uppercase tracking-widest font-bold">{body.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em] pt-8">
             सम्पूर्ण भारत के प्रबुद्ध नागरिक इस समिति का हिस्सा हैं
          </div>
        </section>

        {/* Kendrapara Branch Committee */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-[10px] font-black tracking-widest uppercase mb-4">
                <MapPin size={14} /> Branch ID: OD/17
             </div>
             <h2 className="text-3xl md:text-5xl font-black font-serif gold-text uppercase">केंद्रपाड़ा जिला समिति</h2>
             <p className="text-white/40 text-sm tracking-[0.2em] font-bold uppercase">Kendrapara District Committee Members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kendraparaCommittee.length === 0 ? (
               <div className="col-span-full py-20 text-center text-white/20 uppercase font-black tracking-widest text-[10px]">समिति विवरण उपलब्ध नहीं है</div>
            ) : kendraparaCommittee.map((member, i) => (
              <div key={i} className="premium-card p-8 space-y-4 border-l-2 border-saffron/30">
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-wider">{member.full_name}</h4>
                   <p className="text-[9px] text-saffron font-bold uppercase tracking-widest mt-1">{member.post}</p>
                </div>
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono">
                   <Phone size={12} /> {member.mobile_no}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Vision */}
        <section className="premium-card p-16 text-center space-y-10 border-t-4 border-saffron overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           <Globe className="mx-auto text-saffron/20" size={120} />
           <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black font-serif gold-text uppercase">देशव्यापी संकल्प</h2>
              <p className="text-white/60 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
                 हमारा लक्ष्य भारत के सभी <span className="text-white font-bold tracking-widest">28 राज्यों</span> और <span className="text-white font-bold tracking-widest">8 केंद्र शासित प्रदेशों</span> के हर जिले और ब्लॉक तक राम नाम संचय की अलख जगाना है।
              </p>
              <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div className="space-y-2">
                    <p className="text-3xl font-black gold-text font-mono">28</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">States</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-3xl font-black gold-text font-mono">08</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">UTs</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-3xl font-black gold-text font-mono">750+</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Districts</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-3xl font-black gold-text font-mono">6000+</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Blocks</p>
                 </div>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
