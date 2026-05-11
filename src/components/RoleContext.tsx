"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Role = 'ADMIN' | 'DEVOTEE' | 'BRANCH_MANAGER' | 'VOLUNTEER';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('DEVOTEE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session Error:', error.message);
          if (error.message.includes('Refresh Token Not Found')) {
            await supabase.auth.signOut();
            window.location.href = '/login';
            return;
          }
        }

        if (session && session.user.email) {
          // 1. Check Metadata
          let userRole = session.user.user_metadata?.role;
          
          // 2. If no metadata, check members table
          if (!userRole) {
            const { data: member } = await supabase
              .from('members')
              .select('role')
              .ilike('email', session.user.email.trim())
              .maybeSingle();
            
            if (member?.role) {
              userRole = member.role;
            }
          }

          if (userRole) {
            setRole(userRole.toUpperCase() as Role);
          }
        } else {
          // No session found, redirect to login
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event);
      if (session) {
        const userRole = session.user.user_metadata?.role;
        if (userRole) {
          setRole(userRole.toUpperCase() as Role);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // If user is signed out or token is invalid, redirect
        window.location.href = '/login';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
