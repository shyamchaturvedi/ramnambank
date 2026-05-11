"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  BookOpen, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Award,
  Box,
  CheckCircle2,
  User,
  FileSearch,
  IndianRupee,
  Upload,
  Building2,
  Share2,
  Calendar,
  Zap,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/RoleContext';

export default function DashboardLayout({
  children,
  userRole = 'DEVOTEE',
}: {
  children: React.ReactNode;
  userRole?: 'ADMIN' | 'DEVOTEE' | 'BRANCH_MANAGER' | 'VOLUNTEER';
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { role: internalUserRole } = useRole();

  const [profileData, setProfileData] = useState<any>(null);
  const [pendingRequest, setPendingRequest] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // 1. Mounted Check & User Data Fetch
  useEffect(() => {
    setMounted(true);
    const fetchUserAndNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email) {
        console.log("SESSION FOUND:", session.user.email);
        const { data: member, error: memberError } = await supabase
          .from('members')
          .select('*')
          .ilike('email', session.user.email.trim())
          .maybeSingle();
        
        if (memberError) console.error("MEMBER FETCH ERROR:", memberError);
        console.log("MEMBER FOUND:", member);
        
        if (member) {
          setUserName(member.full_name);
          setProfileData(member);

          // Check for pending membership request
          const { data: pendingReq } = await supabase
            .from('membership_requests')
            .select('*')
            .eq('user_id', member.id)
            .eq('status', 'PENDING')
            .maybeSingle();
          
          if (pendingReq) setPendingRequest(pendingReq);
          
          // Initial Fetch for Notifications
          const { data: notifs } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', member.id)
            .order('created_at', { ascending: false });
          
          if (notifs) setNotifications(notifs);

          // Real-time Subscription
          const channel = supabase
            .channel(`notifications_${member.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
               if (payload.new.user_id === member.id) {
                  setNotifications(prev => [payload.new, ...prev]);
               }
            })
            .subscribe();

          setIsLoadingProfile(false);
          return () => supabase.removeChannel(channel);
        } else {
          console.warn("NO MEMBER RECORD FOUND FOR EMAIL:", session.user.email);
          setIsLoadingProfile(false);
        }
      }
    };
    fetchUserAndNotifications();
  }, []);

  const isDevoteeBlocked = 
    pathname.startsWith('/dashboard/devotee') && 
    pathname !== '/dashboard/devotee/membership' &&
    internalUserRole !== 'ADMIN' &&
    (!['SPECIAL_LIFE', 'LIFE', 'BANK_LIFE'].includes(profileData?.membership_type?.trim()?.toUpperCase() || ''));

  console.log("DEBUG - Membership Type:", profileData?.membership_type, "isBlocked:", isDevoteeBlocked);

  const menuGroups = {
    ADMIN: [
      { name: 'ओवरव्यू', icon: LayoutDashboard, href: '/dashboard/admin' },
      { name: 'यूजर मैनेजमेंट', icon: Users, href: '/dashboard/admin/users' },
      { name: 'सदस्यता रिक्वेस्ट', icon: Award, href: '/dashboard/admin/membership-requests' },
      { name: 'रेफरल ट्री', icon: Share2, href: '/dashboard/admin/referrals' },
      { name: 'शाखा प्रबंधन', icon: Building2, href: '/dashboard/admin/branches' },
      { name: 'बल्क अपलोड', icon: Upload, href: '/dashboard/admin/bulk-upload' },
      { name: 'दान प्रबंधन', icon: IndianRupee, href: '/dashboard/admin/donations' },
      { name: 'संग्रह एवं सत्यापन', icon: CheckCircle2, href: '/dashboard/volunteer/verify' },
      { name: 'ग्लोबल स्टॉक कंट्रोल', icon: Box, href: '/dashboard/admin/inventory' },
      { name: 'मास्टर सेटिंग्स', icon: Settings, href: '/dashboard/admin/settings' },
    ],
    BRANCH_MANAGER: [
      { name: 'शाखा डैशबोर्ड', icon: LayoutDashboard, href: '/dashboard/branch/details' },
      { name: 'मेरे भक्त', icon: Users, href: '/dashboard/admin/users' },
      { name: 'मेरी शाखा', icon: Building2, href: '/dashboard/branch/details' },
      { name: 'मेरी शाखा का स्टॉक', icon: Box, href: '/dashboard/branch/inventory' },
    ],
    VOLUNTEER: [
      { name: 'एंट्री पैनल', icon: LayoutDashboard, href: '/dashboard/volunteer/verify' },
      { name: 'बुकलेट वेरिफिकेशन', icon: CheckCircle2, href: '/dashboard/volunteer/verify' },
    ],
    DEVOTEE: [
      { name: 'मेरा संचय', icon: LayoutDashboard, href: '/dashboard/devotee' },
      { name: 'मेरा प्रोफाइल', icon: User, href: '/dashboard/devotee/profile' },
      { name: 'सदस्यता', icon: Award, href: '/dashboard/devotee/membership' },
      { name: 'मेरा लेजर', icon: FileSearch, href: '/dashboard/devotee/ledger' },
    ]
  };

  const navItems = menuGroups[internalUserRole as keyof typeof menuGroups] || menuGroups.DEVOTEE;

  // 2. Route Protection
  useEffect(() => {
    if (mounted && internalUserRole) {
      const path = pathname;
      if (path.startsWith('/dashboard/admin') && internalUserRole !== 'ADMIN') router.replace('/dashboard');
      if (path.startsWith('/dashboard/branch') && !['ADMIN', 'BRANCH_MANAGER'].includes(internalUserRole)) router.replace('/dashboard');
      if (path.startsWith('/dashboard/volunteer') && !['ADMIN', 'BRANCH_MANAGER', 'VOLUNTEER'].includes(internalUserRole)) router.replace('/dashboard');
    }
  }, [mounted, internalUserRole, pathname, router]);

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        animate={{ 
          x: isMobileMenuOpen ? 0 : (mounted && typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : '-100%'),
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen bg-[#0A0A0A] border-r border-white/5 z-[100] w-72 transition-shadow ${isMobileMenuOpen ? 'shadow-[0_0_50px_rgba(0,0,0,0.8)]' : ''}`}
      >
        <div className="p-8 h-full flex flex-col relative">
          {/* Close button for mobile */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/20 hover:text-saffron lg:hidden"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-12">
             <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-saffron/20 sacred-glow">
                <Image src="/logo.png" alt="Logo" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover scale-125" priority />
             </div>
             <h1 className="text-lg font-bold font-serif gold-text tracking-widest uppercase">राम नाम बैंक</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item, i) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={item.name}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${pathname === item.href ? 'bg-saffron/10 text-saffron' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon size={20} className={pathname === item.href ? 'text-saffron' : 'group-hover:text-saffron transition-colors'} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5">
             <button 
               onClick={async () => {
                 await supabase.auth.signOut();
                 router.push('/login');
               }} 
               className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all w-full text-left"
             >
                <LogOut size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">लॉगआउट</span>
             </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 lg:ml-72 min-h-screen relative flex flex-col overflow-hidden"
      >
        {/* Glow Background Layer */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {/* Top Navigation Bar */}
        <header className="h-24 glass-nav flex items-center justify-between px-8 shrink-0 relative z-[90]">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                setMobileMenuOpen(!isMobileMenuOpen); 
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-saffron lg:hidden hover:bg-saffron/10 transition-all relative z-[100] flex items-center justify-center active:scale-95"
            >
              <Menu size={28} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="खोजें..." 
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-saffron/50 w-80 text-[10px] text-white uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
              >
                <Bell size={20} />
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-saffron rounded-full border-2 border-black"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-6 w-96 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] sacred-glow"
                  >
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                       <div className="flex items-center gap-3">
                          <Bell size={14} className="text-saffron" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">सूचनाएं (Notifications)</span>
                       </div>
                       {notifications.length > 0 && (
                          <button className="text-[9px] font-black text-saffron uppercase tracking-widest hover:text-white transition-colors">सभी देखें</button>
                       )}
                    </div>
                    
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-20 px-10 text-center space-y-4">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                              <Bell size={24} />
                           </div>
                           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">कोई नई सूचना नहीं</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {notifications.map((n, i) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className={`p-6 hover:bg-white/[0.03] transition-all cursor-pointer relative group ${!n.is_read ? 'bg-saffron/[0.03]' : ''}`}
                            >
                              {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-saffron shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>}
                              <div className="flex justify-between items-start gap-4">
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-white group-hover:text-saffron transition-colors">{n.title}</p>
                                    <p className="text-[10px] text-white/40 leading-relaxed font-medium">{n.message}</p>
                                    <p className="text-[8px] text-white/20 mt-3 font-bold uppercase tracking-widest flex items-center gap-2">
                                       <Calendar size={10} /> {new Date(n.created_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long' })}
                                    </p>
                                 </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{userName || (internalUserRole === 'ADMIN' ? 'एडमिन' : 'श्री राम भक्त')}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1 text-saffron">{internalUserRole}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-saffron font-bold border border-white/10 sacred-glow shadow-inner">
                {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : (internalUserRole === 'ADMIN' ? 'AA' : 'RB')}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
           <div className="max-w-7xl mx-auto h-full relative">
              {isLoadingProfile ? (
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                  <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-saffron/40">प्रोफाइल लोड हो रहा है...</p>
                </div>
              ) : isDevoteeBlocked ? (
                <div className="flex items-center justify-center min-h-[70vh]">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card p-10 md:p-16 max-w-xl border-red-500/30 space-y-8 text-center bg-red-500/[0.02]"
                  >
                    <div className={`w-24 h-24 ${pendingRequest ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'} rounded-full flex items-center justify-center mx-auto ${!pendingRequest && 'animate-bounce'}`}>
                      {pendingRequest ? <Clock size={48} /> : <Zap size={48} />}
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-white uppercase tracking-widest">
                        {pendingRequest ? "वेरिफिकेशन लंबित है" : "सदस्यता अनिवार्य है"}
                      </h2>
                      <p className="text-sm text-white/60 font-bold uppercase leading-relaxed">
                        {pendingRequest 
                          ? `आपका भुगतान (UTR: ${pendingRequest.transaction_id}) वेरिफिकेशन के लिए एडमिन के पास है। कृपया धैर्य रखें।`
                          : !profileData?.membership_type 
                            ? "पोर्टल की सेवाओं का उपयोग करने के लिए कृपया राम नाम बैंक की सदस्यता लें।" 
                            : "आपका वार्षिक रखरखाव शुल्क (₹108) लंबित है। सेवाओं को जारी रखने के लिए भुगतान पूर्ण करें।"}
                      </p>
                    </div>
                    {!pendingRequest && (
                      <button 
                        onClick={() => router.push('/dashboard/devotee/membership')}
                        className="w-full py-5 bg-red-500 text-black font-black uppercase text-xs rounded-2xl shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:scale-105 transition-all"
                      >
                        {!profileData?.membership_type ? "अभी सदस्यता लें" : "अभी नवीनीकृत करें"}
                      </button>
                    )}
                    {pendingRequest && (
                      <div className="pt-4">
                        <div className="inline-block px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          STATUS: AWAITING ADMIN APPROVAL
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              ) : (
                children
              )}
           </div>
        </div>
      </motion.main>
    </div>
  );
}
