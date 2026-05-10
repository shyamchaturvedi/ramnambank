"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/RoleContext';
import { Loader2 } from 'lucide-react';

export default function DashboardRoot() {
  const router = useRouter();
  const { role, isLoading } = useRole();

  useEffect(() => {
    if (!isLoading) {
      console.log('DashboardRoot: Redirecting for role:', role);
      switch(role) {
        case 'ADMIN':
          router.replace('/dashboard/admin');
          break;
        case 'BRANCH_MANAGER':
          router.replace('/dashboard/branch/details');
          break;
        case 'VOLUNTEER':
          router.replace('/dashboard/volunteer/verify');
          break;
        case 'DEVOTEE':
        default:
          router.replace('/dashboard/devotee');
          break;
      }
    }
  }, [role, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sacred-bg">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-saffron animate-spin mx-auto" />
        <h2 className="text-xl font-black text-white gold-text uppercase tracking-widest">पैनल लोड हो रहा है...</h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Redirecting to your dashboard</p>
      </div>
    </div>
  );
}
