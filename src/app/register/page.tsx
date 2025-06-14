'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { authApi, tokenManager } from '@/lib/api';
import type { RegisterRequest } from '@/types';

const { Title, Text, Link } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    const token = tokenManager.getToken();
    if (token) {
      router.push('/workspace');
    }
  }, [router]);

  const onFinish = async (values: RegisterRequest & { terms: boolean }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { terms, ...registerData } = values;
      const response = await authApi.register(registerData);
      tokenManager.setToken(response.accessToken);
      router.push('/workspace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2} className="text-gray-900">
            Create your account
          </Title>
          <Text className="text-gray-600">
            Start your journey with Tax Planner
          </Text>
        </div>

        <Card className="shadow-lg border-0">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6"
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 2, message: 'Name must be at least 2 characters!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
                }
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
                },
              ]}
              className="mb-4"
            >
              <Checkbox>
                I agree to the{' '}
                <Link className="text-blue-600 hover:text-blue-800">Terms of Service</Link>
                {' '}and{' '}
                <Link className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
              </Checkbox>
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-base font-medium"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text className="text-gray-500 text-sm">Or continue with</Text>
          </Divider>

          <Space direction="vertical" className="w-full" size="middle">
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              className="h-12 text-base font-medium border-gray-300 hover:border-gray-400"
            >
              Continue with Google
            </Button>
            <Button
              icon={<GithubOutlined />}
              block
              size="large"
              className="h-12 text-base font-medium border-gray-300 hover:border-gray-400"
            >
              Continue with GitHub
            </Button>
          </Space>

          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <Text className="text-gray-600">
              Already have an account?{' '}
              <Link onClick={() => router.push('/login')} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 