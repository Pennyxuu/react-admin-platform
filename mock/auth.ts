/**
 * 认证相关 Mock API
 * 
 * 设计模式：单例模式
 * - Mock 数据在内存中只有一份
 * - 模拟真实的后端 API
 */

import type { MockMethod } from 'vite-plugin-mock';

/**
 * Mock 用户数据（单例）
 */
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['*'],
  },
  {
    id: '2',
    username: 'user',
    password: '123456',
    nickname: '普通用户',
    email: 'user@example.com',
    phone: '13800138001',
    roles: ['user'],
    permissions: ['read'],
  },
];

/**
 * 生成 Token（简单模拟）
 */
const generateToken = (username: string) => {
  return `mock_token_${username}_${Date.now()}`;
};

/**
 * Mock API 配置
 */
export default [
  /**
   * 登录接口
   * POST /api/auth/login
   */
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body;

      // 查找用户
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null,
        };
      }

      // 生成 Token
      const token = generateToken(username);

      return {
        code: 200,
        message: '登录成功',
        data: {
          token,
          userInfo: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            permissions: user.permissions,
          },
        },
      };
    },
  },

  /**
   * 获取用户信息
   * GET /api/auth/user-info
   */
  {
    url: '/api/auth/user-info',
    method: 'get',
    response: ({ headers }: any) => {
      const token = headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return {
          code: 401,
          message: '未登录',
          data: null,
        };
      }

      // 从 token 中解析用户名（简单模拟）
      const username = token.split('_')[2];
      const user = mockUsers.find((u) => u.username === username);

      if (!user) {
        return {
          code: 401,
          message: 'Token 无效',
          data: null,
        };
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          phone: user.phone,
          roles: user.roles,
          permissions: user.permissions,
        },
      };
    },
  },

  /**
   * 退出登录
   * POST /api/auth/logout
   */
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '退出成功',
        data: null,
      };
    },
  },

  /**
   * 获取用户菜单
   * GET /api/auth/menus
   */
  {
    url: '/api/auth/menus',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: [
          {
            id: '1',
            name: 'dashboard',
            path: '/dashboard',
            title: '仪表盘',
            icon: 'DashboardOutlined',
          },
          {
            id: '2',
            name: 'user',
            path: '/user',
            title: '用户管理',
            icon: 'UserOutlined',
            children: [
              {
                id: '2-1',
                name: 'user-list',
                path: '/user/list',
                title: '用户列表',
              },
            ],
          },
        ],
      };
    },
  },
] as MockMethod[];

