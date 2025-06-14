'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Select, Input, Spin, message, Card, Empty, Dropdown } from 'antd';
import { 
  ProjectOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Project, Board, Task, TaskStatus, TaskPriority, Organization } from '@/types';
import { projectsApi, boardsApi, tasksApi, organizationsApi } from '@/lib/api';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import OrganizationModal from '@/components/OrganizationModal';
import ProjectModal from '@/components/ProjectModal';
import BoardModal from '@/components/BoardModal';

const { Sider, Content } = Layout;
const { Option } = Select;

export default function WorkspacePage() {
  const router = useRouter();
  
  // State
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  
  // Selected items
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  
  // UI state
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // Modal states
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isOrganizationModalVisible, setIsOrganizationModalVisible] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isBoardModalVisible, setIsBoardModalVisible] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // Load initial data
  useEffect(() => {
    loadOrganizations();
  }, []);

  // Load projects when organization changes
  useEffect(() => {
    if (selectedOrganization) {
      loadProjects();
    } else {
      setProjects([]);
      setSelectedProject('');
    }
  }, [selectedOrganization]);

  // Load boards when project changes
  useEffect(() => {
    if (selectedProject) {
      loadBoards(selectedProject);
    } else {
      setBoards([]);
      setSelectedBoard('');
    }
  }, [selectedProject]);

  // Load tasks and statuses when board changes
  useEffect(() => {
    if (selectedProject && selectedBoard) {
      loadTasks(selectedProject, selectedBoard);
      loadStatuses(selectedBoard);
    } else {
      setTasks([]);
      setStatuses([]);
    }
  }, [selectedProject, selectedBoard]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationsApi.getAll();
      setOrganizations(response.data || response);
      
      // Auto-select first organization if available
      if (response.data?.length > 0 || response.length > 0) {
        const orgsList = response.data || response;
        setSelectedOrganization(orgsList[0].id);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
      message.error('Не удалось загрузить организации');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      // Filter projects by selected organization
      const allProjects = response.data || response;
      const filteredProjects = selectedOrganization 
        ? allProjects.filter((p: Project) => p.organization.id === selectedOrganization)
        : allProjects;
      setProjects(filteredProjects);
      
      // Auto-select first project if available
      if (filteredProjects.length > 0) {
        setSelectedProject(filteredProjects[0].id);
      } else {
        setSelectedProject('');
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      message.error('Не удалось загрузить проекты');
    } finally {
      setLoading(false);
    }
  };

  const loadBoards = async (projectId: string) => {
    try {
      const response = await projectsApi.getBoards(projectId);
      setBoards(response.data || response);
      
      // Auto-select first board if available
      if (response.data?.length > 0 || response.length > 0) {
        const boardsList = response.data || response;
        setSelectedBoard(boardsList[0].id);
      } else {
        setSelectedBoard('');
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
      message.error('Не удалось загрузить доски');
    }
  };

  const loadTasks = async (projectId: string, boardId: string) => {
    try {
      const response = await boardsApi.getTasks(boardId);
      setTasks(response.data || response);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      message.error('Не удалось загрузить задачи');
    }
  };

  const loadStatuses = async (boardId: string) => {
    try {
      const response = await boardsApi.getStatuses(boardId);
      setStatuses(response.data || response);
    } catch (error) {
      console.error('Failed to load statuses:', error);
      message.error('Не удалось загрузить статусы');
    }
  };

  const handleCreateTask = async (taskData: any) => {
    if (!selectedBoard) {
      message.error('Выберите доску для создания задачи');
      return;
    }

    try {
      await tasksApi.create({
        ...taskData,
        boardId: selectedBoard,
        statusId: statuses[0]?.id || '', // Default to first status
      });
      
      message.success('Задача создана');
      setIsTaskModalVisible(false);
      
      // Reload tasks
      if (selectedProject && selectedBoard) {
        loadTasks(selectedProject, selectedBoard);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      message.error('Не удалось создать задачу');
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      await tasksApi.update(taskId, taskData);
      message.success('Задача обновлена');
      setIsTaskModalVisible(false);
      setEditingTask(null);
      
      // Reload tasks
      if (selectedProject && selectedBoard) {
        loadTasks(selectedProject, selectedBoard);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      message.error('Не удалось обновить задачу');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      message.success('Задача удалена');
      
      // Reload tasks
      if (selectedProject && selectedBoard) {
        loadTasks(selectedProject, selectedBoard);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      message.error('Не удалось удалить задачу');
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatusId: string) => {
    try {
      await tasksApi.updateStatus(taskId, newStatusId);
      
      // Reload tasks
      if (selectedProject && selectedBoard) {
        loadTasks(selectedProject, selectedBoard);
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      message.error('Не удалось обновить статус задачи');
    }
  };

  // Organization management
  const handleCreateOrganization = async (data: { name: string; description?: string }) => {
    try {
      await organizationsApi.create(data);
      message.success('Организация создана');
      setIsOrganizationModalVisible(false);
      loadOrganizations();
    } catch (error) {
      console.error('Failed to create organization:', error);
      message.error('Не удалось создать организацию');
    }
  };

  const handleUpdateOrganization = async (data: { name: string; description?: string }) => {
    if (!editingOrganization) return;
    
    try {
      await organizationsApi.update(editingOrganization.id, data);
      message.success('Организация обновлена');
      setIsOrganizationModalVisible(false);
      setEditingOrganization(null);
      loadOrganizations();
    } catch (error) {
      console.error('Failed to update organization:', error);
      message.error('Не удалось обновить организацию');
    }
  };

  const handleDeleteOrganization = async () => {
    if (!editingOrganization) return;
    
    try {
      await organizationsApi.delete(editingOrganization.id);
      message.success('Организация удалена');
      setIsOrganizationModalVisible(false);
      setEditingOrganization(null);
      loadOrganizations();
    } catch (error) {
      console.error('Failed to delete organization:', error);
      message.error('Не удалось удалить организацию');
    }
  };

  // Project management
  const handleCreateProject = async (data: { name: string; description?: string; organizationId: string }) => {
    try {
      await projectsApi.create(data);
      message.success('Проект создан');
      setIsProjectModalVisible(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      message.error('Не удалось создать проект');
    }
  };

  const handleUpdateProject = async (data: { name: string; description?: string; organizationId: string }) => {
    if (!editingProject) return;
    
    try {
      await projectsApi.update(editingProject.id, data);
      message.success('Проект обновлен');
      setIsProjectModalVisible(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      message.error('Не удалось обновить проект');
    }
  };

  const handleDeleteProject = async () => {
    if (!editingProject) return;
    
    try {
      await projectsApi.delete(editingProject.id);
      message.success('Проект удален');
      setIsProjectModalVisible(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      message.error('Не удалось удалить проект');
    }
  };

  // Board management
  const handleCreateBoard = async (data: { name: string; viewType?: string }) => {
    if (!selectedProject) return;
    
    try {
      await boardsApi.create({
        ...data,
        projectId: selectedProject,
      });
      message.success('Доска создана');
      setIsBoardModalVisible(false);
      loadBoards(selectedProject);
    } catch (error) {
      console.error('Failed to create board:', error);
      message.error('Не удалось создать доску');
    }
  };

  const handleUpdateBoard = async (data: { name: string; viewType?: string }) => {
    if (!editingBoard) return;
    
    try {
      await boardsApi.update(editingBoard.id, data);
      message.success('Доска обновлена');
      setIsBoardModalVisible(false);
      setEditingBoard(null);
      if (selectedProject) {
        loadBoards(selectedProject);
      }
    } catch (error) {
      console.error('Failed to update board:', error);
      message.error('Не удалось обновить доску');
    }
  };

  const handleDeleteBoard = async () => {
    if (!editingBoard) return;
    
    try {
      await boardsApi.delete(editingBoard.id);
      message.success('Доска удалена');
      setIsBoardModalVisible(false);
      setEditingBoard(null);
      if (selectedProject) {
        loadBoards(selectedProject);
      }
    } catch (error) {
      console.error('Failed to delete board:', error);
      message.error('Не удалось удалить доску');
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status.id === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const selectedBoardData = boards.find(b => b.id === selectedBoard);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        className="bg-white border-r border-gray-200"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-semibold text-gray-800 ${collapsed ? 'hidden' : 'block'}`}>
              Рабочее пространство
            </h2>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          {!collapsed && (
            <>
              {/* Organization Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Организация</span>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'create',
                          label: 'Создать организацию',
                          icon: <PlusOutlined />,
                          onClick: () => setIsOrganizationModalVisible(true),
                        },
                        {
                          key: 'edit',
                          label: 'Редактировать',
                          icon: <SettingOutlined />,
                          disabled: !selectedOrganization,
                          onClick: () => {
                            const org = organizations.find(o => o.id === selectedOrganization);
                            if (org) {
                              setEditingOrganization(org);
                              setIsOrganizationModalVisible(true);
                            }
                          },
                        },
                      ],
                    }}
                    trigger={['click']}
                  >
                    <Button type="text" size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
                <Select
                  value={selectedOrganization}
                  onChange={setSelectedOrganization}
                  placeholder="Выберите организацию"
                  className="w-full"
                  size="large"
                >
                  {organizations.map(org => (
                    <Option key={org.id} value={org.id}>
                      <div className="flex items-center">
                        <TeamOutlined className="mr-2" />
                        {org.name}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Project Selector */}
              {selectedOrganization && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Проект</span>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'create',
                            label: 'Создать проект',
                            icon: <PlusOutlined />,
                            onClick: () => setIsProjectModalVisible(true),
                          },
                          {
                            key: 'edit',
                            label: 'Редактировать',
                            icon: <SettingOutlined />,
                            disabled: !selectedProject,
                            onClick: () => {
                              const project = projects.find(p => p.id === selectedProject);
                              if (project) {
                                setEditingProject(project);
                                setIsProjectModalVisible(true);
                              }
                            },
                          },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                  <Select
                    value={selectedProject}
                    onChange={setSelectedProject}
                    placeholder="Выберите проект"
                    className="w-full"
                    size="large"
                  >
                    {projects.map(project => (
                      <Option key={project.id} value={project.id}>
                        <div className="flex items-center">
                          <ProjectOutlined className="mr-2" />
                          {project.name}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Board Selector */}
              {selectedProject && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Доска</span>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'create',
                            label: 'Создать доску',
                            icon: <PlusOutlined />,
                            onClick: () => setIsBoardModalVisible(true),
                          },
                          {
                            key: 'edit',
                            label: 'Редактировать',
                            icon: <SettingOutlined />,
                            disabled: !selectedBoard,
                            onClick: () => {
                              const board = boards.find(b => b.id === selectedBoard);
                              if (board) {
                                setEditingBoard(board);
                                setIsBoardModalVisible(true);
                              }
                            },
                          },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                  <Select
                    value={selectedBoard}
                    onChange={setSelectedBoard}
                    placeholder="Выберите доску"
                    className="w-full"
                    size="large"
                  >
                    {boards.map(board => (
                      <Option key={board.id} value={board.id}>
                        {board.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              {selectedProjectData && (
                <Card size="small" className="mb-4">
                  <div className="text-sm text-gray-600">
                    <div>Участники: {selectedProjectData.memberCount}</div>
                    <div>Доски: {selectedProjectData.boardCount}</div>
                    <div>Теги: {selectedProjectData.tagCount}</div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </Sider>

      <Layout>
        <Content className="p-6">
          {!selectedProject || !selectedBoard ? (
            <div className="flex items-center justify-center h-96">
              <Empty
                description={
                  !selectedOrganization 
                    ? "Выберите организацию для начала работы"
                    : !selectedProject 
                    ? "Создайте или выберите проект"
                    : "Создайте или выберите доску для работы с задачами"
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedBoardData?.name || 'Доска'}
                  </h1>
                  <p className="text-gray-600">
                    {selectedProjectData?.name} • {filteredTasks.length} задач
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Поиск задач..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />

                  <Select
                    value={filterStatus}
                    onChange={setFilterStatus}
                    placeholder="Статус"
                    className="w-32"
                  >
                    <Option value="all">Все</Option>
                    {statuses.map(status => (
                      <Option key={status.id} value={status.id}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={filterPriority}
                    onChange={setFilterPriority}
                    placeholder="Приоритет"
                    className="w-32"
                  >
                    <Option value="all">Все</Option>
                    <Option value="LOW">Низкий</Option>
                    <Option value="MEDIUM">Средний</Option>
                    <Option value="HIGH">Высокий</Option>
                    <Option value="CRITICAL">Критический</Option>
                  </Select>

                  <Button.Group>
                    <Button
                      type={viewMode === 'kanban' ? 'primary' : 'default'}
                      icon={<AppstoreOutlined />}
                      onClick={() => setViewMode('kanban')}
                    />
                    <Button
                      type={viewMode === 'list' ? 'primary' : 'default'}
                      icon={<UnorderedListOutlined />}
                      onClick={() => setViewMode('list')}
                    />
                  </Button.Group>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsTaskModalVisible(true)}
                  >
                    Создать задачу
                  </Button>
                </div>
              </div>

              {/* Content */}
              {viewMode === 'kanban' ? (
                <KanbanBoard
                  tasks={filteredTasks}
                  statuses={statuses}
                  onTaskClick={(task) => {
                    setEditingTask(task);
                    setIsTaskModalVisible(true);
                  }}
                  onTaskStatusChange={handleTaskStatusChange}
                />
              ) : (
                <div className="bg-white rounded-lg shadow">
                  {/* List view implementation */}
                  <div className="p-4">
                    <p className="text-gray-500">Список задач (в разработке)</p>
                  </div>
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>

      {/* Task Modal */}
      <TaskModal
        visible={isTaskModalVisible}
        task={editingTask}
        statuses={statuses}
        onSubmit={editingTask ? 
          (data) => handleUpdateTask(editingTask.id, data) : 
          handleCreateTask
        }
        onCancel={() => {
          setIsTaskModalVisible(false);
          setEditingTask(null);
        }}
        onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : undefined}
      />

      {/* Organization Modal */}
      <OrganizationModal
        visible={isOrganizationModalVisible}
        organization={editingOrganization}
        onSubmit={editingOrganization ? handleUpdateOrganization : handleCreateOrganization}
        onCancel={() => {
          setIsOrganizationModalVisible(false);
          setEditingOrganization(null);
        }}
        onDelete={editingOrganization ? handleDeleteOrganization : undefined}
      />

      {/* Project Modal */}
      <ProjectModal
        visible={isProjectModalVisible}
        project={editingProject}
        organizations={organizations}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        onCancel={() => {
          setIsProjectModalVisible(false);
          setEditingProject(null);
        }}
        onDelete={editingProject ? handleDeleteProject : undefined}
      />

      {/* Board Modal */}
      <BoardModal
        visible={isBoardModalVisible}
        board={editingBoard}
        projectId={selectedProject}
        onSubmit={editingBoard ? handleUpdateBoard : handleCreateBoard}
        onCancel={() => {
          setIsBoardModalVisible(false);
          setEditingBoard(null);
        }}
        onDelete={editingBoard ? handleDeleteBoard : undefined}
      />
    </Layout>
  );
} 