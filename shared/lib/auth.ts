'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTokenFromCookie, removeTokenCookie } from '../utils/cookies';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface IUserData extends JwtPayload {
  nameAccount: string;
  isAdmin: boolean;
  exp?: number;
  thread: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<IUserData>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp < currentTime : true;
  } catch (error) {
    console.error("Token validation error:", error);
    return true;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserData | null>(null);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const validateAuth = () => {
      const currentToken = getTokenFromCookie();
      
      if (!currentToken || isTokenExpired(currentToken)) {
        if (currentToken) {
          removeTokenCookie();
        }
        setToken(null);
        setUser(null);
        if (!isLoginPage) {
          router.replace('/login');
          return;
        }
      } 
      else {
        try {
          const decoded = jwtDecode<IUserData>(currentToken);
          setToken(currentToken);
          setUser({
            nameAccount: decoded.nameAccount,
            isAdmin: decoded.isAdmin,
            thread: decoded.thread,
          });
          if (isLoginPage) {
            router.replace('/');
            return;
          }
        } catch (error) {
          removeTokenCookie();
          setToken(null);
          setUser(null);
          
          if (!isLoginPage) {
            router.replace('/login');
            return;
          }
        }
      }
      setIsLoading(false);
    };

    validateAuth();
  }, [pathname]);

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const currentToken = getTokenFromCookie();
      if (currentToken && isTokenExpired(currentToken)) {
        removeTokenCookie();
        setToken(null);
        setUser(null);
        if (!isLoginPage) {
          router.replace('/login');
        }
      }
    }, 60000);
    return () => clearInterval(checkTokenInterval);
  }, [router, isLoginPage]);

  return { token, isLoading, user };
};