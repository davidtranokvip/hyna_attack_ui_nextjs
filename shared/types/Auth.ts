import { ReactNode } from 'react';

export interface UserInfo {
  nameAccount: string;
  isAdmin: boolean;
  id?: number;
  email?: string;
}

export interface AuthContextType {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (route: string) => boolean;
  logout: () => void;
}

export interface DecodedToken {
  id: number;
  email: string;
  nameAccount: string;
  isAdmin: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}