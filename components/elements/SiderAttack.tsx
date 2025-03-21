import { usePathname, useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { removeTokenCookie } from "@/shared/utils/cookies";
import { useAuth } from "@/shared/lib/auth";
import { menuItems } from "./menuItem";

const logoutStyle: React.CSSProperties = {
  borderTop: '1px solid #444444',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 12
};

const SidebarAttack = () => {
  const router = useRouter();
  const { user } = useAuth();
  const handleLogout = () => {
    removeTokenCookie()
    router.push("/login");
  };

  const filteredMenuItems = user?.isAdmin
    ? menuItems
    : menuItems.filter((item) =>
      ["attack", "attack_manager"].includes(item.path)
    );

  return (
    <div className="menu">
      <div className="flex h-screen flex-col items-center">
        <nav className="w-full flex flex-col items-center py-4 space-y-4">
          <MenuItem 
            icon={<FaHome />}
            path='/'
            title='Home'
          />  
          {filteredMenuItems.map((menu, index) => (
            <MenuItem
              key={index}
              icon={menu.icon}
              title={menu.title}
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
  title: string;
}

const MenuItem = ({ icon, path, title }: MenuItemProps) => {
  const pathname = usePathname();
  return (
    <a href={path}className={`
      w-12 h-12 text-xl rounded-full flex items-center justify-center 
      hover:bg-[#31ff00] hover:text-black transition-all group
      ${pathname === path 
        ? 'bg-primary text-black' 
        : 'bg-[#ffffff1a] text-white'}
    `}>
      {icon}  
      <span className="absolute left-[calc(100%+10px)] text-black text-sm px-3 font-semibold py-1 whitespace-nowrap opacity-0 bg-primary group-hover:opacity-100 transition-opacity pointer-events-none">
        {title}
      </span>
    </a>
  );
};

export default SidebarAttack;
