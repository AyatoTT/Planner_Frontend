import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    Cookies.remove(TOKEN_KEY);
  },
};

// Organizations API
export const organizationsApi = {
  getAll: async () => {
    const response = await api.get('/organizations');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post('/organizations', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/organizations/${id}`);
  },

  getMembers: async (organizationId: string) => {
    const response = await api.get(`/organizations/${organizationId}/members`);
    return response.data;
  },

  inviteMember: async (organizationId: string, email: string, role: string) => {
    const response = await api.post(`/organizations/${organizationId}/members`, {
      email,
      role,
    });
    return response.data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; organizationId: string }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },

  getBoards: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/boards`);
    return response.data;
  },

  getTags: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/tags`);
    return response.data;
  },

  createTag: async (projectId: string, data: { name: string; color?: string }) => {
    const response = await api.post(`/projects/${projectId}/tags`, data);
    return response.data;
  },
};

// Boards API
export const boardsApi = {
  getById: async (id: string) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  create: async (data: { name: string; projectId: string; viewType?: string }) => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; viewType?: string }) => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/boards/${id}`);
  },

  getTasks: async (boardId: string, filters?: any) => {
    const response = await api.get(`/boards/${boardId}/tasks`, { params: filters });
    return response.data;
  },

  getStatuses: async (boardId: string) => {
    const response = await api.get(`/boards/${boardId}/statuses`);
    return response.data;
  },

  createStatus: async (boardId: string, data: { name: string; color?: string; orderIndex: number; isFinal?: boolean }) => {
    const response = await api.post(`/boards/${boardId}/statuses`, data);
    return response.data;
  },

  updateStatus: async (boardId: string, statusId: string, data: { name?: string; color?: string; orderIndex?: number; isFinal?: boolean }) => {
    const response = await api.put(`/boards/${boardId}/statuses/${statusId}`, data);
    return response.data;
  },

  deleteStatus: async (boardId: string, statusId: string) => {
    await api.delete(`/boards/${boardId}/statuses/${statusId}`);
  },

  reorderStatuses: async (boardId: string, statusOrders: Array<{ statusId: string; orderIndex: number }>) => {
    const response = await api.patch(`/boards/${boardId}/statuses/reorder`, { statusOrders });
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    boardId: string;
    statusId: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
    tagIds?: string[];
  }) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
    statusId?: string;
    tagIds?: string[];
  }) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },

  updateStatus: async (id: string, statusId: string, orderIndex?: number) => {
    const response = await api.patch(`/tasks/${id}/status`, { statusId, orderIndex });
    return response.data;
  },

  getComments: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  createComment: async (taskId: string, content: string) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  getChecklists: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/checklists`);
    return response.data;
  },

  createChecklist: async (taskId: string, title: string) => {
    const response = await api.post(`/tasks/${taskId}/checklists`, { title });
    return response.data;
  },

  updateChecklist: async (taskId: string, checklistId: string, data: { title?: string; isCompleted?: boolean }) => {
    const response = await api.put(`/tasks/${taskId}/checklists/${checklistId}`, data);
    return response.data;
  },

  deleteChecklist: async (taskId: string, checklistId: string) => {
    await api.delete(`/tasks/${taskId}/checklists/${checklistId}`);
  },
};

// Token management
export const tokenManager = {
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
  },
};

export { api };
export default api; 