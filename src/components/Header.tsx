'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  DashboardOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { tokenManager, authApi } from '@/lib/api';
import type { User } from '@/types';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = tokenManager.getToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      tokenManager.removeToken();
      setIsAuthenticated(false);
      if (onLogout) onLogout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local token
      tokenManager.removeToken();
      setIsAuthenticated(false);
      router.push('/');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const mainMenuItems = [
    {
      key: '/',
      label: 'Home',
    },
    {
      key: '/workspace',
      label: 'Workspace',
    },
  ];

  const selectedKeys = [pathname];

  return (
    <AntHeader className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <DashboardOutlined className="text-white text-lg" />
          </div>
          <Text className="text-xl font-bold text-gray-900">Tax Planner</Text>
        </div>

        {/* Navigation Menu - Only show if authenticated */}
        {isAuthenticated && (
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={mainMenuItems}
            className="border-none bg-transparent flex-1"
            onClick={({ key }) => router.push(key)}
          />
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {isAuthenticated && user ? (
          // Authenticated User Menu
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Avatar
                size="small"
                src={user.avatarUrl}
                icon={<UserOutlined />}
                className="bg-blue-600"
              />
              <Text className="hidden sm:inline font-medium">{user.name}</Text>
            </Space>
          </Dropdown>
        ) : (
          // Unauthenticated Menu
          !isAuthenticated && (
            <Space>
              <Button
                type="text"
                onClick={() => router.push('/login')}
                className="font-medium"
              >
                Sign In
              </Button>
              <Button
                type="primary"
                onClick={() => router.push('/register')}
                className="font-medium"
              >
                Get Started
              </Button>
            </Space>
          )
        )}
      </div>
    </AntHeader>
  );
} 