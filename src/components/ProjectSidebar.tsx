'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Select, Card, Tag, Dropdown, Input, Collapse, Avatar, Tooltip } from 'antd';
import {
  ProjectOutlined,
  AppstoreOutlined,
  PlusOutlined,
  SettingOutlined,
  SearchOutlined,
  FolderOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  TagOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import type { Project, Board } from '@/types';

const { Sider } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

interface ProjectSidebarProps {
  collapsed: boolean;
  sidebarCollapsed: boolean;
  onSidebarCollapse: (collapsed: boolean) => void;
  projects: Project[];
  boards: Board[];
  selectedProject: string;
  selectedBoard: string;
  onProjectChange: (projectId: string) => void;
  onBoardChange: (boardId: string) => void;
  onCreateProject: () => void;
  onEditProject: () => void;
  onCreateBoard: () => void;
  onEditBoard: () => void;
  organizationSelected: boolean;
}

export default function ProjectSidebar({
  collapsed,
  sidebarCollapsed,
  onSidebarCollapse,
  projects,
  boards,
  selectedProject,
  selectedBoard,
  onProjectChange,
  onBoardChange,
  onCreateProject,
  onEditProject,
  onCreateBoard,
  onEditBoard,
  organizationSelected
}: ProjectSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>(['projects', 'boards']);

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const selectedBoardData = boards.find(b => b.id === selectedBoard);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!organizationSelected) {
    return (
      <Sider 
        width={sidebarCollapsed ? 60 : 320}
        className="bg-gray-50 border-r border-gray-200 project-sidebar"
        style={{ 
          marginLeft: collapsed ? 80 : 280,
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 90,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FolderOutlined className="text-4xl mb-2" />
            {!sidebarCollapsed && <p>Выберите организацию</p>}
          </div>
        </div>
      </Sider>
    );
  }

  return (
    <Sider 
      width={sidebarCollapsed ? 60 : 320}
      className="bg-gray-50 border-r border-gray-200 project-sidebar"
      style={{
        marginLeft: collapsed
            ? (sidebarCollapsed ? 80 : 10)
            : (sidebarCollapsed ? 0 : 0),
        height: '100vh',
        left: 0,
        top: 0,
        boxShadow: 'none',
        zIndex: 90,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {!sidebarCollapsed && (
              <h3 className="font-semibold text-gray-800">Проекты и доски</h3>
            )}
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onSidebarCollapse(!sidebarCollapsed)}
              className="hover:bg-gray-100"
              size="small"
            />
          </div>
          
          {/* Search */}
          {!sidebarCollapsed && (
            <Input
              placeholder="Поиск..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
              size="small"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {sidebarCollapsed ? (
            // Collapsed view with icons
            <div className="py-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Projects Icons */}
              <div className="px-2">
                <Tooltip title="Проекты" placement="right">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 cursor-pointer hover:bg-blue-200 transition-colors">
                    <ProjectOutlined className="text-blue-600" />
                  </div>
                </Tooltip>
                
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {filteredProjects.slice(0, 5).map(project => (
                    <Tooltip key={project.id} title={project.name} placement="right">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                          selectedProject === project.id
                            ? 'bg-blue-500 text-white scale-105'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => onProjectChange(project.id)}
                      >
                        <span className="text-xs font-bold">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Tooltip>
                  ))}
                  
                  {filteredProjects.length > 5 && (
                    <Tooltip title={`+${filteredProjects.length - 5} проектов`} placement="right">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-200">
                        +{filteredProjects.length - 5}
                      </div>
                    </Tooltip>
                  )}
                </div>
                
                <Tooltip title="Создать проект" placement="right">
                  <div 
                    className="w-10 h-10 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center mt-2 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={onCreateProject}
                  >
                    <PlusOutlined className="text-blue-500 text-xs" />
                  </div>
                </Tooltip>
              </div>

              {/* Boards Icons */}
              {selectedProject && (
                <div className="px-2 pt-4 border-t border-gray-200">
                  <Tooltip title="Доски" placement="right">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 cursor-pointer hover:bg-green-200 transition-colors">
                      <AppstoreOutlined className="text-green-600" />
                    </div>
                  </Tooltip>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                    {filteredBoards.slice(0, 4).map(board => (
                      <Tooltip key={board.id} title={board.name} placement="right">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            selectedBoard === board.id
                              ? 'bg-green-500 text-white scale-105'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => onBoardChange(board.id)}
                        >
                          <AppstoreOutlined className="text-xs" />
                        </div>
                      </Tooltip>
                    ))}
                    
                    {filteredBoards.length > 4 && (
                      <Tooltip title={`+${filteredBoards.length - 4} досок`} placement="right">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-200">
                          +{filteredBoards.length - 4}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  
                  <Tooltip title="Создать доску" placement="right">
                    <div 
                      className="w-10 h-10 bg-green-50 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center mt-2 cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={onCreateBoard}
                    >
                      <PlusOutlined className="text-green-500 text-xs" />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          ) : (
            // Expanded view
            <div className="overflow-x-hidden overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <Collapse 
                activeKey={activeKeys}
                onChange={setActiveKeys}
                ghost
                expandIconPosition="end"
                className="bg-transparent"
              >
                {/* Projects Section */}
                <Panel 
                  header={
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-2">
                        <ProjectOutlined className="text-blue-500" />
                        <span className="font-medium">Проекты</span>
                        <Tag color="blue">{filteredProjects.length}</Tag>
                      </div>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'create',
                              label: 'Создать проект',
                              icon: <PlusOutlined />,
                              onClick: onCreateProject,
                            }
                          ],
                        }}
                        trigger={['click']}
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<PlusOutlined />}
                          className="hover:bg-blue-100"
                        />
                      </Dropdown>
                    </div>
                  }
                  key="projects"
                  className="border-0"
                >
                  <div className="space-y-2 px-4 max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map(project => (
                        <Card
                          key={project.id}
                          size="small"
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedProject === project.id
                              ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                              : 'hover:bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() => onProjectChange(project.id)}
                          bodyStyle={{ padding: '12px' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <div 
                                  className="w-3 h-3 rounded-full bg-blue-500"
                                />
                                <span className="font-medium text-sm truncate">
                                  {project.name}
                                </span>
                              </div>
                              
                              {project.description && (
                                <p className="text-xs text-gray-500 truncate mb-2">
                                  {project.description}
                                </p>
                              )}
                              
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <UserOutlined />
                                  <span>{project.memberCount}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <AppstoreOutlined />
                                  <span>{project.boardCount}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <TagOutlined />
                                  <span>{project.tagCount}</span>
                                </span>
                              </div>
                            </div>
                            
                            {selectedProject === project.id && (
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: 'view',
                                      label: 'Просмотр',
                                      icon: <EyeOutlined />,
                                    },
                                    {
                                      key: 'edit',
                                      label: 'Редактировать',
                                      icon: <EditOutlined />,
                                      onClick: onEditProject,
                                    },
                                    { type: 'divider' as const },
                                    {
                                      key: 'delete',
                                      label: 'Удалить',
                                      icon: <DeleteOutlined />,
                                      danger: true,
                                    },
                                  ],
                                }}
                                trigger={['click']}
                              >
                                <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<MoreOutlined />}
                                  className="ml-2"
                                />
                              </Dropdown>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ProjectOutlined className="text-3xl mb-2" />
                        <p className="text-sm">Нет проектов</p>
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={onCreateProject}
                          className="mt-2"
                        >
                          Создать первый проект
                        </Button>
                      </div>
                    )}
                  </div>
                </Panel>

                {/* Boards Section */}
                {selectedProject && (
                  <Panel 
                    header={
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center space-x-2">
                          <AppstoreOutlined className="text-green-500" />
                          <span className="font-medium">Доски</span>
                          <Tag color="green">{filteredBoards.length}</Tag>
                        </div>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'create',
                                label: 'Создать доску',
                                icon: <PlusOutlined />,
                                onClick: onCreateBoard,
                              }
                            ],
                          }}
                          trigger={['click']}
                        >
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<PlusOutlined />}
                            className="hover:bg-green-100"
                          />
                        </Dropdown>
                      </div>
                    }
                    key="boards"
                    className="border-0"
                  >
                    <div className="space-y-2 px-4 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin">
                      {filteredBoards.length > 0 ? (
                        filteredBoards.map(board => (
                          <Card
                            key={board.id}
                            size="small"
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedBoard === board.id
                                ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                                : 'hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            onClick={() => onBoardChange(board.id)}
                            bodyStyle={{ padding: '12px' }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <AppstoreOutlined className="text-green-500 text-sm" />
                                  <span className="font-medium text-sm truncate">
                                    {board.name}
                                  </span>
                                </div>
                                
                                {board.description && (
                                  <p className="text-xs text-gray-500 truncate">
                                    {board.description}
                                  </p>
                                )}
                              </div>
                              
                              {selectedBoard === board.id && (
                                <Dropdown
                                  menu={{
                                    items: [
                                      {
                                        key: 'edit',
                                        label: 'Редактировать',
                                        icon: <EditOutlined />,
                                        onClick: onEditBoard,
                                      },
                                      { type: 'divider' as const },
                                      {
                                        key: 'delete',
                                        label: 'Удалить',
                                        icon: <DeleteOutlined />,
                                        danger: true,
                                      },
                                    ],
                                  }}
                                  trigger={['click']}
                                >
                                  <Button 
                                    type="text" 
                                    size="small" 
                                    icon={<MoreOutlined />}
                                    className="ml-2"
                                  />
                                </Dropdown>
                              )}
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <AppstoreOutlined className="text-3xl mb-2" />
                          <p className="text-sm">Нет досок</p>
                          <Button 
                            type="link" 
                            size="small" 
                            onClick={onCreateBoard}
                            className="mt-2"
                          >
                            Создать первую доску
                          </Button>
                        </div>
                      )}
                    </div>
                  </Panel>
                )}
              </Collapse>
            </div>
          )}
        </div>

        {/* Selected Project/Board Info */}
        {!sidebarCollapsed && selectedProjectData && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Активный проект</div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium text-sm truncate">{selectedProjectData.name}</span>
            </div>
            
            {selectedBoardData && (
              <>
                <div className="text-xs text-gray-500 mb-1 mt-3">Активная доска</div>
                <div className="flex items-center space-x-2">
                  <AppstoreOutlined className="text-green-500 text-sm" />
                  <span className="font-medium text-sm truncate">{selectedBoardData.name}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Sider>
  );
} 