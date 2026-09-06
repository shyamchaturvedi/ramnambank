"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type Role = 'ADMIN' | 'DEVOTEE' | 'BRANCH_MANAGER' | 'VOLUNTEER';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoading: boolean;
  user: any;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('DEVOTEE');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          
          // Check Firestore doc for accurate role
          try {
            const userDoc = await getDoc(doc(db, 'members', currentUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              if (data.role) {
                setRole(data.role.toUpperCase() as Role);
              } else {
                setRole('DEVOTEE');
              }
            } else {
              setRole('DEVOTEE');
            }
          } catch (e) {
            setRole('DEVOTEE');
          }
        } else {
          setUser(null);
          setRole('DEVOTEE');
        }
      } catch (err) {
        console.error('Firebase Auth State Error:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading, user }}>
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
