/**
 * 路由类型定义
 */

import { ComponentType, LazyExoticComponent } from 'react';

/**
 * 路由元信息
 */
export interface RouteMeta {
  /** 页面标题 */
  title: string;
  /** 是否需要登录 */
  requiresAuth?: boolean;
  /** 需要的角色 */
  roles?: string[];
  /** 需要的权限 */
  permissions?: string[];
  /** 图标 */
  icon?: string;
  /** 是否隐藏（不在菜单中显示） */
  hidden?: boolean;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 排序 */
  orderNum?: number;
}

/**
 * 路由配置
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string;
  /** 路由组件 */
  component?: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  /** 重定向 */
  redirect?: string;
  /** 路由元信息 */
  meta?: RouteMeta;
  /** 子路由 */
  children?: RouteConfig[];
  /** 索引路由 */
  index?: boolean;
}

