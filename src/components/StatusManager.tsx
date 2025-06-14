'use client';

import React, { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Input,
    ColorPicker,
    List,
    Popconfirm,
    message,
    Space,
    Typography,
    Card,
    Tooltip,
    Checkbox
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DragOutlined,
    CheckOutlined,
    CloseOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskStatus } from '@/types';
import { boardsApi } from '@/lib/api';

const { Text } = Typography;

interface StatusManagerProps {
    visible: boolean;
    onCancel: () => void;
    boardId: string;
    statuses: TaskStatus[];
    onStatusesChange: (statuses: TaskStatus[]) => void;
}

interface SortableStatusItemProps {
    status: TaskStatus;
    onEdit: (status: TaskStatus) => void;
    onDelete: (statusId: string) => void;
}

function SortableStatusItem({ status, onEdit, onDelete }: SortableStatusItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: status.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                size="small"
                className={`mb-2 ${isDragging ? 'shadow-lg' : 'shadow-sm'} hover:shadow-md transition-shadow ${
                    status.isFinal ? 'border-green-300 bg-green-50' : ''
                }`}
                bodyStyle={{ padding: '12px' }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                        <div
                            {...listeners}
                            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
                        >
                            <DragOutlined className="text-gray-400" />
                        </div>
                        
                        <div
                            className="w-4 h-4 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: status.color }}
                        />
                        
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <Text strong className={status.isFinal ? 'text-green-700' : ''}>
                                    {status.name}
                                </Text>
                                {status.isFinal && (
                                    <CrownOutlined className="text-green-600" title="Финальный статус" />
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Порядок: {status.orderIndex}
                                {status.isFinal && ' • Финальный статус'}
                            </div>
                        </div>
                    </div>

                    <Space>
                        <Tooltip title="Редактировать">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(status)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                            />
                        </Tooltip>
                        
                        <Popconfirm
                            title="Удалить статус"
                            description="Вы уверены, что хотите удалить этот статус? Это действие невозможно отменить."
                            onConfirm={() => onDelete(status.id)}
                            okText="Удалить"
                            cancelText="Отменить"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete Status">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    className="hover:bg-red-50 hover:text-red-600"
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </div>
            </Card>
        </div>
    );
}

export default function StatusManager({ visible, onCancel, boardId, statuses, onStatusesChange }: StatusManagerProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editingStatus, setEditingStatus] = useState<TaskStatus | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [localStatuses, setLocalStatuses] = useState<TaskStatus[]>(statuses);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update local statuses when props change
    React.useEffect(() => {
        setLocalStatuses(statuses);
    }, [statuses]);

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = localStatuses.findIndex(status => status.id === active.id);
            const newIndex = localStatuses.findIndex(status => status.id === over.id);

            const newStatuses = arrayMove(localStatuses, oldIndex, newIndex);
            
            // Update order indices
            const updatedStatuses = newStatuses.map((status, index) => ({
                ...status,
                orderIndex: index
            }));

            setLocalStatuses(updatedStatuses);

            try {
                const statusOrders = updatedStatuses.map(status => ({
                    statusId: status.id,
                    orderIndex: status.orderIndex
                }));

                await boardsApi.reorderStatuses(boardId, statusOrders);
                onStatusesChange(updatedStatuses);
                message.success('Status order updated successfully');
            } catch (error) {
                console.error('Failed to reorder statuses:', error);
                message.error('Failed to update status order');
                // Revert on error
                setLocalStatuses(statuses);
            }
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            
            if (editingStatus) {
                // Update existing status
                const updatedStatus = await boardsApi.updateStatus(boardId, editingStatus.id, {
                    name: values.name,
                    color: values.color?.toHexString?.() || values.color,
                    isFinal: values.isFinal || false,
                });

                const newStatuses = localStatuses.map(status =>
                    status.id === editingStatus.id ? updatedStatus : status
                );
                setLocalStatuses(newStatuses);
                onStatusesChange(newStatuses);
                message.success('Status updated successfully');
            } else {
                // Create new status
                const newStatus = await boardsApi.createStatus(boardId, {
                    name: values.name,
                    color: values.color?.toHexString?.() || values.color || '#6B7280',
                    orderIndex: localStatuses.length,
                    isFinal: values.isFinal || false
                });

                const newStatuses = [...localStatuses, newStatus];
                setLocalStatuses(newStatuses);
                onStatusesChange(newStatuses);
                message.success('Status created successfully');
            }

            form.resetFields();
            setIsFormVisible(false);
            setEditingStatus(null);
        } catch (error) {
            console.error('Failed to save status:', error);
            message.error('Failed to save status');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (status: TaskStatus) => {
        setEditingStatus(status);
        form.setFieldsValue({
            name: status.name,
            color: status.color,
            isFinal: status.isFinal
        });
        setIsFormVisible(true);
    };

    const handleDelete = async (statusId: string) => {
        try {
            await boardsApi.deleteStatus(boardId, statusId);
            const newStatuses = localStatuses.filter(status => status.id !== statusId);
            setLocalStatuses(newStatuses);
            onStatusesChange(newStatuses);
            message.success('Status deleted successfully');
        } catch (error) {
            console.error('Failed to delete status:', error);
            message.error('Failed to delete status');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsFormVisible(false);
        setEditingStatus(null);
        onCancel();
    };

    const handleAddNew = () => {
        setEditingStatus(null);
        form.resetFields();
        setIsFormVisible(true);
    };

    const handleFormCancel = () => {
        form.resetFields();
        setIsFormVisible(false);
        setEditingStatus(null);
    };

    return (
        <Modal
            title="Управление статусами"
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Отменить
                </Button>
            ]}
            width={600}
            className="status-manager-modal"
        >
            <div className="space-y-4">
                {/* Add New Status Button */}
                <div className="flex justify-between items-center">
                    <Text strong>Статусы ({localStatuses.length})</Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddNew}
                        disabled={isFormVisible}
                    >
                        Добавить статус
                    </Button>
                </div>

                {/* Status Form */}
                {isFormVisible && (
                    <Card className="mb-4">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <div className="flex gap-4">
                                <Form.Item
                                    name="name"
                                    label="Название"
                                    rules={[
                                        { required: true, message: 'Пожалуйста, введите название статуса' },
                                        { max: 100, message: 'Имя не должно быть больше 100 символов' }
                                    ]}
                                    className="flex-1"
                                >
                                    <Input placeholder="Введите название статуса" />
                                </Form.Item>

                                <Form.Item
                                    name="color"
                                    label="Цвет"
                                    initialValue="#6B7280"
                                >
                                    <ColorPicker showText />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="isFinal"
                                valuePropName="checked"
                                initialValue={false}
                            >
                                <Checkbox>
                                    Финальный статус (задачи с этим статусом считаются завершенными)
                                </Checkbox>
                            </Form.Item>

                            {/* Warning about final status */}
                            <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                                <Text>
                                    ⚠️ <strong>Важно:</strong> На доске может быть только один финальный статус. 
                                    При назначении нового финального статуса, предыдущий автоматически перестанет быть финальным.
                                </Text>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button onClick={handleFormCancel}>
                                    Отменить
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={editingStatus ? <CheckOutlined /> : <PlusOutlined />}
                                >
                                    {editingStatus ? 'Обновить' : 'Создать'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {/* Status List */}
                <div className="max-h-96 overflow-y-auto">
                    {localStatuses.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Text>Создайте статус</Text>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localStatuses.map(status => status.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {localStatuses
                                    .sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map(status => (
                                        <SortableStatusItem
                                            key={status.id}
                                            status={status}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                {/* Help Text */}
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <Text>
                        💡 <strong>Подсказка:</strong> Перетаскивайте статусы, чтобы изменить их порядок.
                        Порядок будет отражен в столбцах вашей доски Канбан.
                    </Text>
                </div>
            </div>
        </Modal>
    );
} 