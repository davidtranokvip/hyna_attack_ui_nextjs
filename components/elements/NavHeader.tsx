import Link from "next/link";
import { HiMenuAlt2 } from "react-icons/hi";

const headerStyle: React.CSSProperties = {
    color: '#fff',
    height: 84,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    borderBottom: '1px solid #444444',
    display: 'flex'
};

interface NavHeaderProps {
  isMobile?: boolean;
  toggleSidebar?: () => void;
}

const NavHeader = ({ isMobile, toggleSidebar }: NavHeaderProps) => {
  return (
    <div style={headerStyle} className="relative">
      {isMobile && toggleSidebar ? (
        <div className="flex items-center justify-between w-full px-4">
          <button 
            onClick={toggleSidebar}
            className="text-white text-2xl focus:outline-none mr-3"
          >
            <HiMenuAlt2 />
          </button>
        </div>
      ) : (
        <Link href="/" className="text-2xl font-extrabold text-primary hover:text-primary">HYNA</Link>
      )}
    </div>
  );
};
  
  export default NavHeader;
  