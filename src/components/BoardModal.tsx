'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { Board, BoardViewType } from '@/types';

const { Option } = Select;

interface BoardModalProps {
  visible: boolean;
  board?: Board | null;
  projectId: string;
  onSubmit: (data: { name: string; viewType?: string }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

export default function BoardModal({
  visible,
  board,
  projectId,
  onSubmit,
  onCancel,
  onDelete,
}: BoardModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (board) {
        form.setFieldsValue({
          name: board.name,
          viewType: board.viewType,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          viewType: BoardViewType.KANBAN, // Default to Kanban
        });
      }
    }
  }, [visible, board, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit({
        ...values,
        projectId,
      });
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !board) return;
    
    try {
      setLoading(true);
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Не удалось удалить доску');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={board ? 'Редактировать доску' : 'Создать доску'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        ...(board && onDelete ? [
          <Button
            key="delete"
            danger
            onClick={handleDelete}
            loading={loading}
          >
            Удалить
          </Button>
        ] : []),
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {board ? 'Сохранить' : 'Создать'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Название доски"
          rules={[
            { required: true, message: 'Введите название доски' },
            { min: 2, message: 'Название должно содержать минимум 2 символа' },
            { max: 100, message: 'Название не должно превышать 100 символов' },
          ]}
        >
          <Input placeholder="Введите название доски" />
        </Form.Item>

        <Form.Item
          name="viewType"
          label="Тип отображения"
          rules={[
            { required: true, message: 'Выберите тип отображения' },
          ]}
        >
          <Select placeholder="Выберите тип отображения">
            <Option value={BoardViewType.KANBAN}>Канбан</Option>
            <Option value={BoardViewType.LIST}>Список</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
} 