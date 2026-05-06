"use client";

import React, { useState } from 'react';
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
  IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mock role - In real app, this comes from your Auth Context
  const userRole = 'ADMIN'; 

  const menuGroups = {
    ADMIN: [
      { name: 'ओवरव्यू', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'यूजर मैनेजमेंट', icon: Users, href: '/dashboard/users' },
      { name: 'दान प्रबंधन', icon: IndianRupee, href: '/dashboard/donations' },
      { name: 'संग्रह एवं सत्यापन', icon: CheckCircle2, href: '/dashboard/verify' },
      { name: 'शाखा इन्वेंटरी', icon: Box, href: '/dashboard/inventory' },
      { name: 'आध्यात्मिक लेजर', icon: FileSearch, href: '/dashboard/ledger' },
      { name: 'मास्टर सेटिंग्स', icon: Settings, href: '/dashboard/settings' },
    ],
    BRANCH_MANAGER: [
      { name: 'शाखा डैशबोर्ड', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'मेरे भक्त', icon: Users, href: '/dashboard/devotees' },
      { name: 'स्टॉक प्रबंधन', icon: Box, href: '/dashboard/inventory' },
    ],
    VOLUNTEER: [
      { name: 'एंट्री पैनल', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'बुकलेट वेरिफिकेशन', icon: CheckCircle2, href: '/dashboard/verify' },
    ],
    DEVOTEE: [
      { name: 'मेरा संचय', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'मेरा प्रोफाइल', icon: User, href: '/dashboard/profile' },
    ]
  };

  const navItems = menuGroups[userRole as keyof typeof menuGroups] || menuGroups.DEVOTEE;

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
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className={`fixed left-0 top-0 h-screen bg-[#0A0A0A] border-r border-white/5 z-[70] transition-all duration-500 ${isMobileMenuOpen ? 'w-[280px] translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
             <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-saffron/20 sacred-glow">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
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
             <Link href="/login" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all w-full">
                <LogOut size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">लॉगआउट</span>
             </Link>
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
        <header className="h-24 glass-nav flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="p-2 text-white/40 hover:text-white lg:hidden"
            >
              <Menu size={24} />
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
            <button className="relative p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-saffron rounded-full border-2 border-black"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">अयोध्या मुख्यालय</p>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1 text-saffron">सुपर एडमिन</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-saffron font-bold border border-white/10 sacred-glow shadow-inner">
                AA
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
           <div className="max-w-7xl mx-auto h-full">
              {children}
           </div>
        </div>
      </motion.main>
    </div>
  );
}
