/**
 * Axios 请求封装
 * 统一配置请求拦截器、响应拦截器和错误处理
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import type { ApiResponse } from '../types';

/**
 * 创建 Axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 在请求发送前添加 token 等信息
 */
instance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      // 添加 Authorization 头
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 如果后端返回的数据结构包含 code 字段
    if (data.code !== undefined) {
      // 成功的状态码（通常是 200 或 0）
      if (data.code === 200 || data.code === 0) {
        return data.data;
      }
      
      // 处理业务错误
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    // 如果后端直接返回数据，不包含 code 字段
    return data;
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          message.error('登录已过期，请重新登录');
          // 跳转到登录页
          window.location.href = '/login';
          break;
          
        case 403:
          message.error('没有权限访问该资源');
          break;
          
        case 404:
          message.error('请求的资源不存在');
          break;
          
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
          
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message.error('网络错误，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

/**
 * 封装请求方法
 */
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.patch(url, data, config);
  },
};

export default request;

