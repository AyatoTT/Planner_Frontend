'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { Organization } from '@/types';

interface OrganizationModalProps {
  visible: boolean;
  organization?: Organization | null;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

export default function OrganizationModal({
  visible,
  organization,
  onSubmit,
  onCancel,
  onDelete,
}: OrganizationModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (organization) {
        form.setFieldsValue({
          name: organization.name,
          description: organization.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, organization, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !organization) return;
    
    try {
      setLoading(true);
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Не удалось удалить организацию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={organization ? 'Редактировать организацию' : 'Создать организацию'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        ...(organization && onDelete ? [
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
          {organization ? 'Сохранить' : 'Создать'}
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
          label="Название организации"
          rules={[
            { required: true, message: 'Введите название организации' },
            { min: 2, message: 'Название должно содержать минимум 2 символа' },
            { max: 100, message: 'Название не должно превышать 100 символов' },
          ]}
        >
          <Input placeholder="Введите название организации" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание (необязательно)"
          rules={[
            { max: 500, message: 'Описание не должно превышать 500 символов' },
          ]}
        >
          <Input.TextArea
            placeholder="Введите описание организации"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 