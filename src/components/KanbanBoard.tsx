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
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => task.status.id === statusId);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    
    // Создаем ghost element
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-3 opacity-90';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.width = '250px';
    dragImage.innerHTML = `
      <div class="flex items-center space-x-2 mb-2">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <span class="font-medium text-gray-800 text-sm">${task.title}</span>
      </div>
      <div class="text-xs text-gray-500 truncate">${task.description || 'Нет описания'}</div>
    `;
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 125, 30);
    
    // Удаляем ghost element после начала перетаскивания
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(statusId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Проверяем, что мы покидаем колонку, а не дочерний элемент
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedTask.status.id !== newStatusId && onTaskStatusChange) {
      onTaskStatusChange(draggedTask.id, newStatusId);
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleCreateTask = (statusId: string) => {
    if (onCreateTask) {
      onCreateTask(statusId);
    }
  };

  // Sort statuses by orderIndex
  const sortedStatuses = [...statuses].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="flex gap-6 h-full w-full">
      {sortedStatuses.map(status => {
        const columnTasks = getTasksByStatus(status.id);
        const isDragOver = dragOverColumn === status.id;
        const isDraggedTaskFromThisColumn = draggedTask?.status.id === status.id;
        
        return (
          <div 
            key={status.id} 
            className={`
              flex flex-col h-full rounded-lg p-4 transition-all duration-200
              ${isDragOver 
                ? 'bg-blue-50 border-2 border-blue-300 border-dashed shadow-lg scale-[1.02]' 
                : 'bg-gray-50 border border-gray-200'
              }
              ${isDraggedTaskFromThisColumn ? 'opacity-75' : ''}
            `}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, status.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    isDragOver ? 'scale-125 shadow-lg' : ''
                  }`}
                  style={{ backgroundColor: status.color }}
                />
                <Text className={`font-semibold transition-all duration-200 ${
                  isDragOver ? 'text-blue-700 text-base' : 'text-gray-700'
                }`}>
                  {status.name}
                </Text>
              </div>
              <Badge 
                count={columnTasks.length} 
                className={`transition-all duration-200 ${
                  isDragOver ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}
                showZero
              />
            </div>
            
            {/* Drop Zone Indicator */}
            {isDragOver && draggedTask && draggedTask.status.id !== status.id && (
              <div className="mb-3 p-3 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50 flex items-center justify-center">
                <div className="text-blue-600 text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Перетащите сюда</span>
                </div>
              </div>
            )}
            
            {/* Column Content */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
              {/* Add Task Button */}
              <div className="mb-4 pt-2">
                <Button
                    type="dashed"
                    size='large'
                    icon={<PlusOutlined />}
                    onClick={() => handleCreateTask(status.id)}
                    className={`
                  transition-all duration-200
                  ${isDragOver
                        ? 'text-blue-600 border-blue-300 bg-blue-50 hover:text-blue-700 hover:border-blue-400'
                        : 'text-gray-600 hover:text-blue-600 hover:border-blue-300'
                    }
                `}
                >
                  Добавить задачу
                </Button>
              </div>
              {columnTasks.length > 0 ? (
                columnTasks.map((task, index) => {
                  const isDragging = draggedTask?.id === task.id;
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className={`
                        transform transition-all duration-200 cursor-grab
                        ${isDragging 
                          ? 'opacity-40 scale-95 rotate-3 z-10' 
                          : 'hover:-translate-y-1'
                        }
                      `}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      <TaskCard 
                        task={task} 
                        onClick={onTaskClick}
                        className={`
                          transition-all duration-200
                          ${isDragging 
                            ? 'shadow-2xl border-blue-500 border-2' 
                            : 'hover:shadow-lg'
                          }
                        `}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={`
                  flex items-center justify-center h-32 rounded-lg transition-all duration-200
                  ${isDragOver 
                    ? 'bg-blue-100 border-2 border-blue-300 border-dashed' 
                    : 'text-gray-400'
                  }
                `}>
                  {isDragOver ? (
                    <div className="text-blue-600 text-center">
                      <div className="text-2xl mb-2">📥</div>
                      <div className="text-sm font-medium">Отпустите здесь</div>
                    </div>
                  ) : (
                    <Empty 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                      description="Нет задач"
                      className="text-sm"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 