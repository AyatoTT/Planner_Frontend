'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { authApi, tokenManager } from '@/lib/api';
import type { LoginRequest } from '@/types';

const { Title, Text, Link } = Typography;

export default function LoginPage() {
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

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(values);
      tokenManager.setToken(response.accessToken);
      router.push('/workspace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2} className="text-gray-900">
            Welcome back
          </Title>
          <Text className="text-gray-600">
            Sign in to your Tax Planner account
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
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-base font-medium"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Link className="text-blue-600 hover:text-blue-800">
              Forgot your password?
            </Link>
          </div>

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
              Don't have an account?{' '}
              <Link onClick={() => router.push('/register')} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 