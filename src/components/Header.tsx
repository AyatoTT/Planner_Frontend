'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined
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
      tokenManager.removeToken();
      setIsAuthenticated(false);
      router.push('/');
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => handleNavigation('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => handleNavigation('/settings'),
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
      <AntHeader className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <DashboardOutlined className="text-white text-lg" />
            </div>
            <Text className="text-xl font-bold text-gray-900">Tax Planner</Text>
          </div>

          {/* Custom Navigation */}
          {isAuthenticated && (
              <div className="flex items-center gap-6">
                <button
                    onClick={() => handleNavigation('/')}
                    className={`px-2 py-1 text-sm font-medium rounded-[5px] transition-colors border-0 bg-transparent ${
                        pathname === '/'
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Home
                </button>
                <button
                    onClick={() => handleNavigation('/workspace')}
                    className={`px-2 py-1 text-sm font-medium rounded-[5px] transition-colors border-0 bg-transparent ${
                        pathname === '/workspace'
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Workspace
                </button>
              </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
              <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                  overlayClassName="min-w-[200px]"
              >
                <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Avatar
                      size="small"
                      src={user.avatarUrl}
                      icon={<UserOutlined />}
                      className="bg-blue-600"
                  />
                  <Text className="hidden sm:inline font-medium text-sm">
                    {user.name}
                  </Text>
                </Space>
              </Dropdown>
          ) : (
              !isAuthenticated && (
                  <Space>
                    <Button
                        type="text"
                        onClick={() => handleNavigation('/login')}
                        className="font-medium px-3 py-1 h-auto text-sm"
                    >
                      Sign In
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleNavigation('/register')}
                        className="font-medium px-4 py-1 h-auto text-sm bg-blue-600 hover:bg-blue-700"
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