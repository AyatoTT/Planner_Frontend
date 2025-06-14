'use client';

import {useState, useEffect} from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Typography,
    Divider,
    Tag,
    Avatar,
    List,
    Checkbox
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    TagsOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type {Task, TaskPriority, TaskStatus, User} from '@/types';
import dayjs from 'dayjs';

const {TextArea} = Input;
const {Option} = Select;
const {Title, Text} = Typography;

interface TaskModalProps {
    visible: boolean;
    task?: Task | null;
    statuses: TaskStatus[];
    onSubmit: (values: any) => void;
    onCancel: () => void;
    onDelete?: () => void;
    users?: User[];
    loading?: boolean;
}

interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

const priorityOptions = [
    {value: 'LOW', label: 'Низкий', color: '#6b7280'},
    {value: 'MEDIUM', label: 'Средний', color: '#f59e0b'},
    {value: 'HIGH', label: 'Высокий', color: '#ef4444'},
    {value: 'CRITICAL', label: 'Критический', color: '#dc2626'}
];

export default function TaskModal({
                                      visible,
                                      task,
                                      statuses,
                                      onSubmit,
                                      onCancel,
                                      onDelete,
                                      users = [],
                                      loading = false
                                  }: TaskModalProps) {
    const [form] = Form.useForm();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');

    const isEditing = !!task;

    useEffect(() => {
        if (visible) {
            if (task) {
                // Editing existing task
                form.setFieldsValue({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    statusId: task.status.id,
                    assigneeId: task.assignee?.id,
                    dueDate: task.dueDate ? dayjs(task.dueDate) : null,
                    tags: task.tags?.map(tag => tag.name) || []
                });

                // Convert checklist from task data
                setChecklist(Array.from({length: task.checklistCount}, (_, i) => ({
                    id: `checklist-${i}`,
                    text: `Checklist item ${i + 1}`,
                    completed: i < task.completedChecklistCount
                })));
            } else {
                // Creating new task
                form.resetFields();
                form.setFieldsValue({
                    priority: 'MEDIUM',
                    statusId: statuses[0]?.id || ''
                });
                setChecklist([]);
            }
        }
    }, [visible, task, form, statuses]);

    const handleSubmit = (values: any) => {
        const submitData = {
            ...values,
            dueDate: values.dueDate?.toISOString(),
            checklists: checklist.map(item => ({
                text: item.text,
                completed: item.completed
            }))
        };

        onSubmit(submitData);
    };

    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            const newItem: ChecklistItem = {
                id: Date.now().toString(),
                text: newChecklistItem.trim(),
                completed: false
            };
            setChecklist([...checklist, newItem]);
            setNewChecklistItem('');
        }
    };

    const updateChecklistItem = (id: string, completed: boolean) => {
        setChecklist(checklist.map(item =>
            item.id === id ? {...item, completed} : item
        ));
    };

    const removeChecklistItem = (id: string) => {
        setChecklist(checklist.filter(item => item.id !== id));
    };

    const completedCount = checklist.filter(item => item.completed).length;
    const totalCount = checklist.length;

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <span>{isEditing ? 'Редактировать задачу' : 'Создать новую задачу'}</span>
                    {isEditing && task && (
                        <Tag color={priorityOptions.find(p => p.value === task.priority)?.color}>
                            {priorityOptions.find(p => p.value === task.priority)?.label}
                        </Tag>
                    )}
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="task-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-4"
            >
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <Form.Item
                        name="title"
                        label="Название задачи"
                        rules={[{required: true, message: 'Введите название задачи'}]}
                    >
                        <Input
                            placeholder="Введите название задачи"
                            size="large"
                            className="font-medium"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Описание"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Опишите задачу..."
                            className="resize-none"
                        />
                    </Form.Item>
                </div>

                {/* Task Properties */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Form.Item
                        name="priority"
                        label="Приоритет"
                        initialValue="MEDIUM"
                    >
                        <Select size="large">
                            {priorityOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{backgroundColor: option.color}}
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="statusId"
                        label="Статус"
                        rules={[{required: true, message: 'Выберите статус'}]}
                    >
                        <Select size="large" placeholder="Выберите статус">
                            {statuses.map(status => (
                                <Option key={status.id} value={status.id}>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{backgroundColor: status.color}}
                                        />
                                        <span>{status.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dueDate"
                        label="Крайний срок"
                    >
                        <DatePicker
                            className="w-full"
                            size="large"
                            placeholder="Выберите крайний срок"
                        />
                    </Form.Item>

                    <Form.Item
                        name="assigneeId"
                        label="Исполнитель"
                    >
                        <Select
                            placeholder="Выберите исполнителя"
                            size="large"
                            allowClear
                        >
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>
                                    <div className="flex items-center space-x-2">
                                        <Avatar size="small" src={user.avatarUrl}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* Checklist Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <Title level={5} className="mb-0">
                            Чек-лист {totalCount > 0 && (
                            <Text type="secondary" className="font-normal">
                                ({completedCount}/{totalCount} выполнено)
                            </Text>
                        )}
                        </Title>
                    </div>

                    {checklist.length > 0 && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <List
                                dataSource={checklist}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key={item.id}
                                                type="text"
                                                icon={<DeleteOutlined/>}
                                                onClick={() => removeChecklistItem(item.id)}
                                                className="text-red-500 hover:text-red-600"
                                                size="small"
                                            />
                                        ]}
                                        className="px-0"
                                    >
                                        <div className="flex items-center space-x-3 w-full">
                                            <Checkbox
                                                checked={item.completed}
                                                onChange={(e) => updateChecklistItem(item.id, e.target.checked)}
                                            />
                                            <Text
                                                className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}
                                            >
                                                {item.text}
                                            </Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Input
                            placeholder="Добавить элемент чек-листа..."
                            value={newChecklistItem}
                            onChange={(e) => setNewChecklistItem(e.target.value)}
                            onPressEnter={addChecklistItem}
                            className="flex-1"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={addChecklistItem}
                            disabled={!newChecklistItem.trim()}
                        >
                            Добавить
                        </Button>
                    </div>
                </div>

                <Divider/>

                {/* Footer Actions */}
                <div className="flex justify-between">
                    <div>
                        {isEditing && onDelete && (
                            <Button 
                                danger 
                                onClick={onDelete}
                                size="large"
                            >
                                Удалить задачу
                            </Button>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={onCancel} size="large">
                            Отменить
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                        >
                            {isEditing ? 'Обновить' : 'Создать'}
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
} 