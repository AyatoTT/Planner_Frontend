'use client'

import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, Layout } from 'antd';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { tokenManager } from '@/lib/api';
import type { User } from '@/types';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and load user data
    const token = tokenManager.getToken();
    if (token) {
      // Here you would typically fetch user data from API
      // For now, we'll set a mock user or leave it null
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="loading-spinner" />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0ea5e9',
                borderRadius: 8,
                colorBgContainer: '#ffffff',
                colorText: '#1f2937',
                fontFamily: inter.style.fontFamily,
              },
              components: {
                Layout: {
                  bodyBg: '#f9fafb',
                  headerBg: '#ffffff',
                  siderBg: '#ffffff',
                },
                Menu: {
                  itemBg: 'transparent',
                  itemSelectedBg: '#e0f2fe',
                  itemSelectedColor: '#0369a1',
                },
                Button: {
                  borderRadius: 8,
                },
                Card: {
                  borderRadiusLG: 12,
                },
              },
            }}
          >
            <Layout className="min-h-screen">
              <Header user={user} onLogout={handleLogout} />
              <Layout.Content className="flex-1">
                {children}
              </Layout.Content>
            </Layout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
} 