'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Card, Row, Col, Typography, Button, Space, Statistic } from 'antd';
import { 
  PlusOutlined, 
  ProjectOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { tokenManager } from '@/lib/api';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenManager.getToken();
    if (token) {
      setIsAuthenticated(true);

    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <Layout className="min-h-screen">
        <Content className="flex items-center justify-center">
          <div className="loading-spinner" />
        </Content>
      </Layout>
    );
  }


  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title level={1} className="text-5xl font-bold text-gray-900 mb-6">
              Tax Planner
            </Title>
            <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Modern task management platform with intuitive UI/UX inspired by Notion and Apple.
              Organize your projects, collaborate with your team, and boost productivity.
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                onClick={() => router.push('/register')}
                className="h-12 px-8 text-lg font-medium"
              >
                Get Started Free
              </Button>
              <Button 
                size="large" 
                onClick={() => router.push('/login')}
                className="h-12 px-8 text-lg font-medium"
              >
                Sign In
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Title level={2} className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your tasks
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you and your team stay organized and productive.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mb-16">
            <Col xs={24} md={8}>
              <Card className="h-full text-center border-0 shadow-lg">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <ProjectOutlined className="text-2xl text-blue-600" />
                  </div>
                </div>
                <Title level={4} className="mb-4">Project Management</Title>
                <Paragraph className="text-gray-600">
                  Organize your work into projects and boards. Switch between Kanban and List views 
                  to match your workflow preferences.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="h-full text-center border-0 shadow-lg">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <TeamOutlined className="text-2xl text-green-600" />
                  </div>
                </div>
                <Title level={4} className="mb-4">Team Collaboration</Title>
                <Paragraph className="text-gray-600">
                  Invite team members, assign tasks, and collaborate in real-time. 
                  Role-based permissions keep your projects secure.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="h-full text-center border-0 shadow-lg">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircleOutlined className="text-2xl text-purple-600" />
                  </div>
                </div>
                <Title level={4} className="mb-4">Smart Task Management</Title>
                <Paragraph className="text-gray-600">
                  Custom statuses, priorities, tags, and due dates. 
                  Drag-and-drop interface makes managing tasks effortless.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {/* Stats Section */}
          <div className="bg-gray-50 rounded-2xl p-12">
            <Row gutter={[32, 32]} className="text-center">
              <Col xs={24} sm={6}>
                <Statistic 
                  title="Active Users" 
                  value={1250} 
                  className="text-lg font-semibold"
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic 
                  title="Projects Created" 
                  value={5840} 
                  className="text-lg font-semibold"
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic 
                  title="Tasks Completed" 
                  value={28500} 
                  className="text-lg font-semibold"
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic 
                  title="Team Members" 
                  value={890} 
                  className="text-lg font-semibold"
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Title level={2} className="text-3xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8">
            Join thousands of teams who trust Tax Planner to manage their projects and tasks.
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => router.push('/register')}
            className="h-12 px-8 text-lg font-medium bg-white text-blue-600 border-white hover:bg-gray-50"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </>
  );
} 