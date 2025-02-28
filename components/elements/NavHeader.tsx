import Link from "next/link";

const headerStyle: React.CSSProperties = {
    color: '#fff',
    height: 95,
    paddingTop: 10,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    borderBottom: '1px solid #444444',
    display: 'flex'
};

const NavHeader = () => {
    return (
      <div style={headerStyle}>
        <Link href="/" className="text-2xl font-extrabold text-primary hover:text-primary">HYNA</Link>
      </div>
    );
  };
  
  export default NavHeader;
  