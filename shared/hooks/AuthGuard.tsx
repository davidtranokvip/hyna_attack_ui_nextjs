// import { usePathname, useRouter } from "next/navigation";
// import React, { useEffect } from "react";
// import { useAuth } from "../context/auth-context";

// interface AuthGuardProps {
//   children: React.ReactNode;
// }

// const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const currentPath = pathname.split('/').pop() || '';
//   const { isAuthenticated, checkPermission } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/login");
//       return;
//     }
    
//     if (!checkPermission(currentPath)) {
//       router.push('/403');
//     }
//   });
  
//   return <>{children}</>;
// };

// export default AuthGuard;