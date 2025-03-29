"use client";
import { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '@/shared/lib/auth';

const AuthContext = createContext<ReturnType<typeof useAuthHook>>({ 
  token: null, 
  isLoading: true,
  user: {
    id: null,
    nameAccount: '',
    isAdmin: false,
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);