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
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            let userDoc = await getDoc(doc(db, 'members', currentUser.uid));
            let data: any = userDoc.exists() ? userDoc.data() : null;

            if (!data && currentUser.email) {
              const q = query(collection(db, 'members'), where('email', '==', currentUser.email));
              const snap = await getDocs(q);
              if (!snap.empty) {
                data = snap.docs[0].data();
              }
            }

            if (!data && currentUser.email?.endsWith('@ramnam.bank')) {
              const mobile = currentUser.email.replace('@ramnam.bank', '');
              const q = query(collection(db, 'members'), where('mobile_number', '==', mobile));
              const snap = await getDocs(q);
              if (!snap.empty) {
                data = snap.docs[0].data();
              }
            }

            if (data && data.role) {
              setRole(data.role.toUpperCase() as Role);
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
