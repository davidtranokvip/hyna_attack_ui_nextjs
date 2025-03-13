"use client";

import { Layout } from "antd";
import HeaderAttack from "@/components/elements/HeaderAttack";
import SidebarAttack from "@/components/elements/SiderAttack";
import NavHeader from "@/components/elements/NavHeader";
import { useAuth } from "@/shared/lib/auth";
import LoadingPage from "@/components/elements/LoadingPage";
import { useEffect, useState } from "react";
const { Header, Content, Sider } = Layout;

const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    height: '100vh',
    padding: 10,
    backgroundColor: 'black',
    maxWidth: '100%',
};

const layoutContent = {
    backgroundColor: 'black',
}
const headerStyle: React.CSSProperties = {
    color: '#fff',
    height: 84,
    borderBottom: '1px solid #444444',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    paddingInline: 48,
    lineHeight: '84px',
    backgroundColor: '#2c2c2c',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
};

const contentStyle: React.CSSProperties = {
    minHeight: 120,
    overflow: 'hidden',
    lineHeight: '120px',
    borderRadius: 30,
    backgroundColor: '#202020',
    border: '1px solid #444444'
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    marginRight: 10,
    color: '#fff',
    backgroundColor: 'black',
};

const centerStyle: React.CSSProperties = {
    overflowY: 'auto',
    maxHeight: '100vh',
    height: '100%'
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoading } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1280);
      setCollapsed(window.innerWidth <= 1280);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  console.log(isMobile);

  return (
    <Layout style={layoutStyle}>
      <Sider 
        width={collapsed ? "0%" : isMobile ? "20%" : "4%"} 
        style={{
          ...siderStyle,
          position: isMobile ? 'fixed' : 'relative',
          zIndex: 999,
          height: '100%',
          left: collapsed && isMobile ? '-20%' : '0',
        }}
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : "4%"}
      >
        <NavHeader isMobile={isMobile} />
        <SidebarAttack />
      </Sider>
      <Layout style={layoutContent}>
        <Layout style={contentStyle}>
          <Header style={headerStyle}>
            {isMobile && (
              <div className="flex items-center" style={{ position: 'absolute', left: '20px' }}>
                <NavHeader isMobile={isMobile} toggleSidebar={toggleSidebar} />
              </div>
            )}
            <HeaderAttack />
          </Header>
          <Content className='bg-fe' style={centerStyle}>
            {children}
          </Content>
        </Layout>
      </Layout>
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 z-40"
          onClick={toggleSidebar}
          style={{ zIndex: 998 }}
        />
      )}
    </Layout>
  );
}
