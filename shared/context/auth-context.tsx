"use client";
import { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '@/shared/lib/auth';

const AuthContext = createContext<ReturnType<typeof useAuthHook>>({ 
  token: null, 
  isLoading: true,
  user: {
    nameAccount: '',
    isAdmin: false,
    thread: 0
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);