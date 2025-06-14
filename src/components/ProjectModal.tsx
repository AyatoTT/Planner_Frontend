'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { Project, Organization } from '@/types';

const { Option } = Select;

interface ProjectModalProps {
  visible: boolean;
  project?: Project | null;
  organizations: Organization[];
  onSubmit: (data: { name: string; description?: string; organizationId: string }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

export default function ProjectModal({
  visible,
  project,
  organizations,
  onSubmit,
  onCancel,
  onDelete,
}: ProjectModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (project) {
        form.setFieldsValue({
          name: project.name,
          description: project.description,
          organizationId: project.organization.id,
        });
      } else {
        form.resetFields();
        // Auto-select first organization if available
        if (organizations.length > 0) {
          form.setFieldsValue({
            organizationId: organizations[0].id,
          });
        }
      }
    }
  }, [visible, project, organizations, form]);

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
    if (!onDelete || !project) return;
    
    try {
      setLoading(true);
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Не удалось удалить проект');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={project ? 'Редактировать проект' : 'Создать проект'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        ...(project && onDelete ? [
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
          {project ? 'Сохранить' : 'Создать'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="organizationId"
          label="Организация"
          rules={[
            { required: true, message: 'Выберите организацию' },
          ]}
        >
          <Select
            placeholder="Выберите организацию"
            disabled={!!project} // Disable when editing
          >
            {organizations.map(org => (
              <Option key={org.id} value={org.id}>
                {org.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Название проекта"
          rules={[
            { required: true, message: 'Введите название проекта' },
            { min: 2, message: 'Название должно содержать минимум 2 символа' },
            { max: 100, message: 'Название не должно превышать 100 символов' },
          ]}
        >
          <Input placeholder="Введите название проекта" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание (необязательно)"
          rules={[
            { max: 500, message: 'Описание не должно превышать 500 символов' },
          ]}
        >
          <Input.TextArea
            placeholder="Введите описание проекта"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 