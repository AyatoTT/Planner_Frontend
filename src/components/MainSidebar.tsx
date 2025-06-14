'use client';

import React from 'react';
import {Layout, Menu, Button, Dropdown, Avatar, Divider, Card, Badge} from 'antd';
import {
    HomeOutlined,
    TeamOutlined,
    SettingOutlined,
    PlusOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    QuestionCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SwapOutlined,
    CheckOutlined
} from '@ant-design/icons';
import type {Organization} from '@/types';

const {Sider} = Layout;

interface MainSidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    organizations: Organization[];
    selectedOrganization: string;
    onOrganizationChange: (orgId: string) => void;
    onCreateOrganization: () => void;
    onEditOrganization: () => void;
    onLogout: () => void;
    currentUser?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function MainSidebar({
                                        collapsed,
                                        onCollapse,
                                        organizations,
                                        selectedOrganization,
                                        onOrganizationChange,
                                        onCreateOrganization,
                                        onEditOrganization,
                                        onLogout,
                                        currentUser
                                    }: MainSidebarProps) {
    const selectedOrgData = organizations.find(org => org.id === selectedOrganization);

    const organizationItems = [
        ...organizations.map(org => ({
            key: org.id,
            label: (
                <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                        <Avatar
                            size={32}
                            src={org.logoUrl}
                            icon={<TeamOutlined/>}
                            className="bg-gradient-to-br from-blue-500 to-purple-600"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{org.name}</div>
                            <div className="text-xs text-gray-500">{org.memberCount} участников</div>
                        </div>
                    </div>
                    {selectedOrganization === org.id && (
                        <CheckOutlined className="text-blue-500"/>
                    )}
                </div>
            ),
            onClick: () => onOrganizationChange(org.id),
        })),
        {type: 'divider' as const},
        {
            key: 'create',
            label: (
                <div
                    className="flex items-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <PlusOutlined/>
                    <span>Создать организацию</span>
                </div>
            ),
            onClick: onCreateOrganization,
        },
        {
            key: 'settings',
            label: (
                <div
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <SettingOutlined/>
                    <span>Настройки организации</span>
                </div>
            ),
            onClick: onEditOrganization,
            disabled: !selectedOrganization,
        },
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={280}
            className="bg-white border-r border-gray-200 main-sidebar"
            style={{height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100}}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        {!collapsed && (
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">P</span>
                                </div>
                                <span className="font-bold text-gray-800 text-lg">Planner</span>
                            </div>
                        )}
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => onCollapse(!collapsed)}
                            className="hover:bg-gray-100"
                        />
                    </div>

                    {/* User Profile */}
                    <div className="border-t border-gray-200">
                        {!collapsed && currentUser ? (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'profile',
                                            label: 'Профиль',
                                            icon: <UserOutlined/>,
                                        },
                                        {
                                            key: 'settings',
                                            label: 'Настройки',
                                            icon: <SettingOutlined/>,
                                        },
                                        {type: 'divider'},
                                        {
                                            key: 'logout',
                                            label: 'Выйти',
                                            icon: <LogoutOutlined/>,
                                            onClick: onLogout,
                                            danger: true,
                                        },
                                    ],
                                }}
                                trigger={['click']}
                                placement="topRight"
                            >
                                <div
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <Avatar
                                        src={currentUser.avatar}
                                        icon={<UserOutlined/>}
                                        className="bg-blue-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 truncate">
                                            {currentUser.name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <div className="flex justify-center">
                                <Avatar
                                    icon={<UserOutlined/>}
                                    className="bg-blue-500"
                                />
                            </div>
                        )}
                    </div>

                </div>

                {/* Navigation Menu */}
                <div className="flex-1 py-4">
                    <Menu
                        mode="inline"
                        selectedKeys={['workspace']}
                        className="border-0"
                        inlineIndent={collapsed ? 0 : 16}
                    >
                        <Menu.Item
                            key="workspace"
                            icon={<HomeOutlined/>}
                            className="mx-2 rounded-lg"
                        >
                            {!collapsed && 'Рабочее пространство'}
                        </Menu.Item>

                        <Menu.Item
                            key="team"
                            icon={<TeamOutlined/>}
                            className="mx-2 rounded-lg"
                            disabled={!selectedOrganization}
                        >
                            {!collapsed && 'Команда'}
                        </Menu.Item>

                        <Menu.Item
                            key="settings"
                            icon={<SettingOutlined/>}
                            className="mx-2 rounded-lg"
                        >
                            {!collapsed && 'Настройки'}
                        </Menu.Item>
                    </Menu>
                </div>


                {/* Organization Block */}
                {!collapsed && selectedOrgData && (
                    <Dropdown
                        menu={{items: organizationItems}}
                        trigger={['click']}
                        placement="bottomLeft"
                        overlayClassName="organization-dropdown"
                        overlayStyle={{
                            minWidth: '320px',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                    >
                        <Card
                            hoverable
                            style={{ borderRadius: '0', boxShadow: 'none'}}
                            className="cursor-pointer border-dashed border-blue-200 hover:border-blue-400 transition-all duration-200"
                            bodyStyle={{padding: '12px'}}
                        >
                            <div className="flex items-center space-x-3">
                                <Avatar
                                    size={40}
                                    src={selectedOrgData.logoUrl}
                                    icon={<TeamOutlined/>}
                                    className="bg-gradient-to-br from-blue-500 to-purple-600"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800 truncate">
                        {selectedOrgData.name}
                      </span>
                                        <SwapOutlined className="text-gray-400 text-xs"/>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                        <span>{selectedOrgData.memberCount} участников</span>
                                        <span>•</span>
                                        <span>{selectedOrgData.projectCount} проектов</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-gray-100">
                                <div className="flex flex-col items-start gap-1 justify-between text-xs">
                                    <Badge
                                        status="processing"
                                        size='small'
                                        text="Активная организация"
                                        className="text-blue-600"
                                    />
                                    <span className="text-gray-400">Нажмите для смены</span>
                                </div>
                            </div>
                        </Card>
                    </Dropdown>
                )}

                {/* No Organization State */}
                {!collapsed && !selectedOrgData && (
                    <Card
                        className="mb-4 border-dashed border-gray-300 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        styles={{ body: { borderRadius: '0' } }}
                        onClick={onCreateOrganization}
                    >
                        <div className="text-gray-400">
                            <TeamOutlined className="text-2xl mb-2"/>
                            <div className="text-sm">Создайте организацию</div>
                        </div>
                    </Card>
                )}
            </div>
        </Sider>
    );
} 