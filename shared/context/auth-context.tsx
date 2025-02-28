'use client';

import { getPermissionsByUser } from "@/api/permissions";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  nameAccount: string;
  isAdmin: boolean;
}

interface UserInfo {
  nameAccount: string;
  isAdmin: boolean;
  permissionRoutes: string[];
}

interface AuthContextType {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  checkPermission: (route: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setUserInfo(null);
        return;
      }
      
      try {
        const decoded: DecodedToken = jwtDecode(token);
        
        // Check if we have cached permissions
        let permissionRoutes: string[] = [];
        const cachedPermissions = localStorage.getItem('permission');
        
        if (cachedPermissions) {
          permissionRoutes = JSON.parse(cachedPermissions);
        } else if (!decoded.isAdmin) {
          // Only fetch permissions if not admin
          const permissionData = await getPermissionsByUser();
          permissionRoutes = permissionData.data.map((permission: any) => permission.route);
          localStorage.setItem('permission', JSON.stringify(permissionRoutes));
        }
        
        setUserInfo({
          nameAccount: decoded.nameAccount,
          isAdmin: decoded.isAdmin,
          permissionRoutes
        });
        
        setIsAuthenticated(true);
        
        // Store in localStorage too for persistence
        localStorage.setItem("user_info", JSON.stringify({
          nameAccount: decoded.nameAccount,
          isAdmin: decoded.isAdmin
        }));
        
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    };
    
    initializeAuth();
  }, []);
  
  const checkPermission = (route: string): boolean => {
    if (!userInfo) return false;
    if (userInfo.isAdmin) return true;
    
    const publicPaths = ['', 'login', 'dashboard'];
    if (publicPaths.includes(route)) return true;
    
    return userInfo.permissionRoutes.includes(route);
  };
  
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("permission");
    setIsAuthenticated(false);
    setUserInfo(null);
  };
  
  const value = {
    userInfo,
    isAuthenticated,
    checkPermission,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};