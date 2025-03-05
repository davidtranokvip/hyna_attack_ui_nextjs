'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTokenFromCookie, removeTokenCookie} from '../utils/cookies';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface IUserData extends JwtPayload{
  nameAccount: string;
  isAdmin: boolean;
  exp?: number;
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
  const [token, setToken] = useState<string | null>(getTokenFromCookie());
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserData | null>(null);
  useEffect(() => {
    const checkAuth = () => {
      const currentToken = getTokenFromCookie();
        const isLoginPage = pathname === '/login';

        if (currentToken) {
          setToken(currentToken);

          if (isTokenExpired(currentToken)) {
            removeTokenCookie();
            setToken(null);
              if (!isLoginPage) {
                router.replace('/login');
                return;
              }
            }
          if (isLoginPage) {
            router.replace('/');
            return;
          }
          const decoded = jwtDecode<IUserData>(currentToken); 
          setUser({
            nameAccount: decoded.nameAccount,
            isAdmin: decoded.isAdmin,
          });
        } else if (!isLoginPage) {
          router.replace('/login');
          return;
        }
        setIsLoading(false);
      };
    checkAuth();
  }, [router, pathname]);

  return { token, isLoading, user };
};
