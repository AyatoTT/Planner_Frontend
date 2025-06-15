
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  memberCount: number;
  projectCount: number;
  userRole: OrganizationRole;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  user: User;
  role: OrganizationRole;
  joinedAt: string;
  invitedBy?: User;
}

export enum OrganizationRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',  
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  colorTheme?: string;
  organization: OrganizationSummary;
  memberCount: number;
  boardCount: number;
  tagCount: number;
  userRole: OrganizationRole;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  colorTheme?: string;
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
}

// Board types
export interface Board {
  id: string;
  name: string;
  description?: string;
  viewType: BoardViewType;
  project: ProjectSummary;
  statuses: TaskStatus[];
  createdAt: string;
  updatedAt: string;
}

export enum BoardViewType {
  LIST = 'LIST',
  KANBAN = 'KANBAN'
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  orderIndex: number;
  isCompleted: boolean;
  completedAt?: string;
  status: TaskStatus;
  creator: User;
  assignee?: User;
  tags: Tag[];
  checklistCount: number;
  completedChecklistCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string;
  isCompleted: boolean;
  status: TaskStatus;
  assignee?: User;
  tagCount: number;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
  orderIndex: number;
  isFinal: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Checklist {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  orderIndex: number;
  completedBy?: User;
}

export interface TaskComment {
  id: string;
  content: string;
  isEdited: boolean;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Form types
export interface CreateProjectRequest {
  name: string;
  description?: string;
  colorTheme?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  tagIds?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  tagIds?: string[];
  statusId?: string;
  orderIndex?: number;
}

// UI types
export interface MenuItem {
  key: string;
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItem[];
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface AppSettings {
  theme: Theme;
  notifications: boolean;
  compactMode: boolean;
} 