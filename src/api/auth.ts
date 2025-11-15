/**
 * 认证相关 API
 * 包括登录、登出、获取用户信息等
 */

import request from './core/request';
import type { LoginParams, LoginResponse, UserInfo, MenuItem } from './types';

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 用户登录
   * @param params 登录参数（用户名、密码）
   * @returns 登录响应（token、用户信息）
   */
  login: (params: LoginParams) => {
    return request.post<LoginResponse>('/auth/login', params);
  },

  /**
   * 用户登出
   */
  logout: () => {
    return request.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: () => {
    return request.get<UserInfo>('/auth/user');
  },

  /**
   * 获取用户菜单
   */
  getUserMenus: () => {
    return request.get<MenuItem[]>('/auth/menus');
  },

  /**
   * 刷新 token
   */
  refreshToken: () => {
    return request.post<{ token: string }>('/auth/refresh');
  },
};

export default authApi;

