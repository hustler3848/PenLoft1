"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AppSkeleton } from './layout/app-skeleton';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a slightly longer delay to make skeleton more visible
    const unsubscribe = onAuthStateChanged(auth, (user) => {
       setTimeout(() => {
        setUser(user);
        setLoading(false);
      }, 500); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <AppSkeleton /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);