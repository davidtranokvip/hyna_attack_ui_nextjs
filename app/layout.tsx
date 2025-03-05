import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../node_modules/augmented-ui/augmented-ui.min.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { AuthProvider } from "@/shared/context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HYNA TOOL DDOS",
  description: "HYNA TOOL DDOS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b',
                colorLink: '#1890ff',
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#f5222d',
              },
              components: {
                Table: {
                  headerBg: '#2c2c2c',
                  colorTextHeading: '#00ff00',
                  headerBorderRadius: 5,
                  borderColor: 'transparent',
                },
                Card: {
                  headerBg: '#2c2c2c',
                  colorTextHeading: 'rgb(0, 255, 0)',
                  colorBgContainer: '#2c2c2c',
                  colorBorderSecondary: '#444444',
                  borderRadiusLG: 5,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  paddingLG: 24,
                },
                Input: {
                  colorBgContainer: '#202020',
                  colorPrimaryHover: '#444444',
                  colorText: 'rgb(0, 255, 0)',       
                  colorBorder: '#444444',        
                  borderRadius: 5,             
                  colorTextPlaceholder: '#888888', 
                  activeBorderColor: '#444444',   
                  hoverBorderColor: '#444444',    
                },
                Select: {
                  colorBgContainer: '#202020',
                  colorPrimaryHover: '#444444',
                  colorText: 'rgb(0, 255, 0)',       
                  colorBorder: '#444444',        
                  borderRadius: 5,             
                  colorTextPlaceholder: '#888888', 
                  activeBorderColor: '#444444',   
                  hoverBorderColor: '#444444',    
                },
                Modal: {
                  contentBg: '#2c2c2c',  
                  headerBg: 'transparent',  
                  titleColor: 'rgb(0, 255, 0)',  
                  borderRadiusLG: 5,                  
                  fontSizeHeading5: 24,
                  paddingContentHorizontalLG: 24,  
                  paddingMD: 16, 
                  colorBgMask: 'rgba(0, 0, 0, 0.3)',  
                  boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08)', 
                  colorIcon: '#999999',  
                  colorIconHover: '#666666', 
                }
              }
            }}
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
