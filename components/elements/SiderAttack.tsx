import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
// import { IoMdSettings } from "react-icons/io";
import { RiSwordFill } from "react-icons/ri";
// import { GiTeamIdea } from "react-icons/gi";
// import { IoLogoBuffer } from "react-icons/io";
import { MdHandyman } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { removeTokenCookie } from "@/shared/utils/cookies";
// import { useAuth } from "@/shared/context/AuthContext";

// interface SidebarProps {  
//   isAdmin: boolean;
//   permissions: string[];
// }

const menuItems = [
  // {
  //   path: 'users',
  //   title: 'Users',
  //   icon: <FaUsers />
  // },
  // {
  //   path: 'permissions',
  //   title: 'PERMISSIONS',
  //   icon: <FaUserTag />
  // },
  // {
  //   path: 'teams',
  //   title: 'TEAMS',
  //   icon: <GiTeamIdea />
  // },
  // {
  //   path: 'attack_log',
  //   title: 'ATTACK LOG',
  //   icon: <IoLogoBuffer />
  // },
  {
    path: 'attack',
    title: 'ATTACK SITE',
    icon: <RiSwordFill />
  },
  {
    path: 'attack_manager',
    title: 'ATTACK MANAGER',
    icon: <MdHandyman />
  },
  // {
  //   path: 'settings',
  //   title: 'SETTING MANAGER',
  //   icon: <IoMdSettings />
  // },
];

const logoutStyle: React.CSSProperties = {
  borderTop: '1px solid #444444',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 12
};

const SidebarAttack = () => {
  const router = useRouter();
  // const { isAdmin, permissions } = useAuth();
  
  // const filteredMenuItems = isAdmin
  //   ? menuItems
  //   : menuItems.filter(item => permissions.includes(item.path));

  const handleLogout = () => {
    removeTokenCookie()
    // localStorage.removeItem("permission");
    // localStorage.removeItem("user_info");
    router.push("/login");
  };

  return (
    <div className="menu">
      <div className="flex h-screen flex-col items-center">
        <nav className="w-full flex flex-col items-center py-4 space-y-4">
          <MenuItem 
            icon={<FaHome />}
            path='/'
          />
          {menuItems.map((menu, index) => (
            <MenuItem
              key={index}
              icon={menu.icon}
              path={`/${menu.path}`}
            />
          ))}
        </nav>
        <div className="switch-btn" style={logoutStyle}>
          <button onClick={handleLogout} className=" w-12 h-12 text-xl rounded-full flex items-center justify-center 
          hover:bg-[#31ff00] hover:text-black transition-all bg-[#ffffff1a] text-white">
            <AiOutlineLogout />
          </button>
        </div>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  path: string;
}

const MenuItem = ({ icon, path }: MenuItemProps) => {
  const pathname = usePathname();
  return (
    <a href={path}className={`
      w-12 h-12 text-xl rounded-full flex items-center justify-center 
      hover:bg-[#31ff00] hover:text-black transition-all
      ${pathname === path 
        ? 'bg-primary text-black' 
        : 'bg-[#ffffff1a] text-white'}
    `}>
      {icon}
    </a>
  );
};

export default SidebarAttack;
