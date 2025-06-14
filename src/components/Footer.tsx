'use client';

import { Layout, Typography, Space, Divider } from 'antd';
import { 
  GithubOutlined, 
  TwitterOutlined, 
  LinkedinOutlined,
  MailOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export default function Footer() {
  return (
    <AntFooter className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Text className="text-xl font-bold text-white mb-4 block">
              Tax Planner
            </Text>
            <Text className="text-gray-400 mb-6 block">
              Modern task management for modern teams. Organize your projects, 
              collaborate with your team, and boost productivity with our 
              intuitive platform.
            </Text>
            <Space size="large">
              <GithubOutlined className="text-xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <TwitterOutlined className="text-xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <LinkedinOutlined className="text-xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <MailOutlined className="text-xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </Space>
          </div>

          {/* Product Links */}
          <div>
            <Text className="text-white font-semibold mb-4 block">Product</Text>
            <div className="flex flex-col space-y-2">
              <Link className="text-gray-400 hover:text-white transition-colors">Features</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">Integrations</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">API</Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <Text className="text-white font-semibold mb-4 block">Company</Text>
            <div className="flex flex-col space-y-2">
              <Link className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">Careers</Link>
              <Link className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <Divider className="border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">
            © 2024 Tax Planner. All rights reserved.
          </Text>
          <Space className="mt-4 md:mt-0">
            <Link className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  );
} 