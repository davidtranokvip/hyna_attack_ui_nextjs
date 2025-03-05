"use client";

// import { useEffect, useState } from "react";
import { Layout } from "antd";
import HeaderAttack from "@/components/elements/HeaderAttack";
import SidebarAttack from "@/components/elements/SiderAttack";
import NavHeader from "@/components/elements/NavHeader";
// import { useAuth } from "@/shared/context/auth-context";
// import { useRouter } from "next/router";
// import AuthGuard from "@/shared/hooks/AuthGuard";

const { Header, Content, Sider } = Layout;

const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    height: '100vh',
    backgroundColor: 'black',
    maxWidth: '100%',
};

const layoutContent = {
    backgroundColor: 'black',
    padding: 10,
    paddingLeft: 0,
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

  return (
      <Layout style={layoutStyle}>
          <Sider width="5%" style={siderStyle}>
            <NavHeader />
            <SidebarAttack />
          </Sider>
          <Layout style={layoutContent}>
              <Layout style={contentStyle}>
                  <Header style={headerStyle}><HeaderAttack /></Header>
                  <Content className='bg-fe' style={centerStyle}>{children}</Content>
              </Layout>
        </Layout>
      </Layout>
  );
}
