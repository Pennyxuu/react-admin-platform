/**
 * 基础布局
 * 包含顶部导航、侧边栏和主内容区
 */

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useUserStore, useAppStore } from '@/store';
import './index.css';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useUserStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  /**
   * 侧边栏菜单项
   */
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/user/list',
      icon: <UserOutlined />,
      label: '用户管理',
      onClick: () => navigate('/user/list'),
    },
    // 更多菜单项可以在这里添加
  ];

  /**
   * 用户下拉菜单
   */
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout className="basic-layout">
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className="basic-layout-sider"
      >
        <div className="logo">
          <h1>{sidebarCollapsed ? 'RA' : 'React Admin'}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航 */}
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="basic-layout-header"
        >
          <div className="header-left">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>

          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} src={userInfo?.avatar} />
                <span className="username">{userInfo?.nickname || userInfo?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

