'use client';

import { Card, Tag, Avatar, Typography, Space } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  TagOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { Task, TaskPriority } from '@/types';

const { Text } = Typography;

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  showProject?: boolean;
  className?: string;
}

const priorityColors = {
  LOW: '#6b7280',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626'
};

const priorityIcons = {
  LOW: null,
  MEDIUM: null,
  HIGH: <ExclamationCircleOutlined />,
  CRITICAL: <ExclamationCircleOutlined />
};

export default function TaskCard({ task, onClick, showProject = false, className = '' }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
  
  const handleClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 task-card ${className}`}
      size="small"
      bodyStyle={{ padding: '16px' }}
      onClick={handleClick}
      hoverable
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <Text className="font-medium text-sm leading-5" ellipsis>
            {task.title}
          </Text>
        </div>
        <div className="flex items-center space-x-1">
          <Tag 
            color={priorityColors[task.priority]} 
            icon={priorityIcons[task.priority]}
            className="text-xs font-medium"
          >
            {task.priority}
          </Tag>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <Text className="text-xs text-gray-600 mb-3 block leading-4">
          {task.description.length > 120 
            ? task.description.substring(0, 120) + '...' 
            : task.description}
        </Text>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-3">
          <Space size={[4, 4]} wrap>
            {task.tags.slice(0, 3).map((tag) => (
              <Tag key={tag.id} className="text-xs">
                {tag.name}
              </Tag>
            ))}
            {task.tags.length > 3 && (
              <Tag className="text-xs">
                +{task.tags.length - 3}
              </Tag>
            )}
          </Space>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center text-xs ${
              isOverdue ? 'text-red-500' : 'text-gray-500'
            }`}>
              <ClockCircleOutlined className="mr-1" />
              <span>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {isOverdue && (
                <span className="ml-1 text-red-500 font-medium">
                  Overdue
                </span>
              )}
            </div>
          )}

          {/* Checklist Progress */}
          {task.checklistCount > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircleOutlined className="mr-1" />
              <span>
                {task.completedChecklistCount}/{task.checklistCount}
              </span>
            </div>
          )}

          {/* Comments Count */}
          {task.commentCount > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1">💬</span>
              <span>{task.commentCount}</span>
            </div>
          )}
        </div>

        {/* Assignee */}
        <div className="flex items-center">
          {task.assignee ? (
            <Avatar
              size="small"
              src={task.assignee.avatarUrl}
              className="bg-blue-500"
            >
              {task.assignee.name.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar size="small" icon={<UserOutlined />} className="bg-gray-400" />
          )}
        </div>
      </div>

      {/* Status indicator for completed tasks */}
      {task.isCompleted && (
        <div className="absolute top-2 left-2">
          <CheckCircleOutlined className="text-green-500 text-sm" />
        </div>
      )}
    </Card>
  );
} 