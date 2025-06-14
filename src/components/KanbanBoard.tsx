'use client';

import { useState } from 'react';
import { Typography, Badge, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '@/types';

const { Text } = Typography;

interface KanbanBoardProps {
  tasks: Task[];
  statuses: TaskStatus[];
  onTaskClick?: (task: Task) => void;
  onCreateTask?: (statusId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatusId: string) => void;
}

export default function KanbanBoard({ 
  tasks, 
  statuses,
  onTaskClick, 
  onCreateTask,
  onTaskStatusChange 
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => task.status.id === statusId);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status.id !== newStatusId && onTaskStatusChange) {
      onTaskStatusChange(draggedTask.id, newStatusId);
    }
    setDraggedTask(null);
  };

  const handleCreateTask = (statusId: string) => {
    if (onCreateTask) {
      onCreateTask(statusId);
    }
  };

  // Sort statuses by orderIndex
  const sortedStatuses = [...statuses].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
      {sortedStatuses.map(status => {
        const columnTasks = getTasksByStatus(status.id);
        
        return (
          <div 
            key={status.id} 
            className="flex flex-col h-full bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <Text className="font-semibold text-gray-700">
                  {status.name}
                </Text>
              </div>
              <Badge 
                count={columnTasks.length} 
                className="bg-gray-200 text-gray-600"
                showZero
              />
            </div>
            
            {/* Column Content */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
              {columnTasks.length > 0 ? (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="transform transition-transform hover:scale-105"
                  >
                    <TaskCard 
                      task={task} 
                      onClick={onTaskClick}
                      className={`
                        ${draggedTask?.id === task.id ? 'opacity-50 scale-95' : ''}
                        hover:shadow-lg transition-all duration-200
                      `}
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="No tasks"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
            
            {/* Add Task Button */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => handleCreateTask(status.id)}
                className="text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                size="small"
              >
                Add Task
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 