/**
 * 登录页面
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authApi } from '@/api';
import { useUserStore } from '@/store';
import type { LoginParams } from '@/api/types';
import './index.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setToken, setUserInfo } = useUserStore();

  /**
   * 处理登录提交
   */
  const handleSubmit = async (values: LoginParams) => {
    try {
      setLoading(true);
      
      // 调用登录 API
      const response = await authApi.login(values);
      
      // 保存 token 和用户信息
      setToken(response.token);
      setUserInfo(response.userInfo);
      
      message.success('登录成功！');
      
      // 跳转到之前的页面或首页
      const from = (location.state as any)?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <h1>React Admin Platform</h1>
          <p>企业级后台管理系统</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少4个字符' },
            ]}
          >
            <Input
              // prefix 属性：在输入框前面添加一个前缀图标
              // <UserOutlined /> 是 Ant Design 的用户图标组件
              // 作用：提升用户体验，让用户一眼看出这是用户名输入框
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <p>提示：这是一个演示项目</p>
          <p>默认账号：admin / 123456</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;

