/**
 * 路由配置
 * 定义所有路由
 */

import { lazy } from 'react';
import type { RouteConfig } from '../types';

// 布局组件
const BasicLayout = lazy(() => import('@/layouts/basic'));
const AuthLayout = lazy(() => import('@/layouts/auth'));

// 页面组件（懒加载）
const Login = lazy(() => import('@/views/login'));
const Dashboard = lazy(() => import('@/views/dashboard'));
const UserList = lazy(() => import('@/views/user/list'));
const NotFound = lazy(() => import('@/views/error/404'));
const Forbidden = lazy(() => import('@/views/error/403'));
const ServerError = lazy(() => import('@/views/error/500'));

/**
 * 路由配置表
 */
export const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    component: AuthLayout,
    meta: {
      title: '登录',
      hidden: true,
    },
    children: [
      {
        index: true,
        component: Login,
        meta: {
          title: '登录',
        },
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'DashboardOutlined',
          requiresAuth: true,
        },
      },
      {
        path: 'user/list',
        component: UserList,
        meta: {
          title: '用户管理',
          icon: 'UserOutlined',
          requiresAuth: true,
        },
      },
      // 更多业务路由可以在这里添加
    ],
  },
  // 错误页面
  {
    path: '/403',
    component: Forbidden,
    meta: {
      title: '403 - 无权限',
      hidden: true,
    },
  },
  {
    path: '/500',
    component: ServerError,
    meta: {
      title: '500 - 服务器错误',
      hidden: true,
    },
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      title: '404 - 页面不存在',
      hidden: true,
    },
  },
];

export default routes;

