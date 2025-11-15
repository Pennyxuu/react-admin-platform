/**
 * 路由工具函数
 * 用于生成 React Router 路由配置
 */

import { Navigate, RouteObject } from 'react-router-dom';
import { AuthGuard } from './guard';
import type { RouteConfig } from './types';

/**
 * 将自定义路由配置转换为 React Router 路由对象
 * @param routes 自定义路由配置
 * @returns React Router 路由对象数组
 */
export const transformRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    const { path, component: Component, redirect, meta, children, index } = route;

    // 处理重定向
    if (redirect) {
      return {
        path,
        element: <Navigate to={redirect} replace />,
      };
    }

    // 处理索引路由
    if (index && Component) {
      return {
        index: true,
        element: (
          <AuthGuard
            requiresAuth={meta?.requiresAuth}
            roles={meta?.roles}
            permissions={meta?.permissions}
          >
            <Component />
          </AuthGuard>
        ),
      };
    }

    // 处理普通路由
    const routeObject: RouteObject = {
      path,
    };

    // 添加组件
    if (Component) {
      routeObject.element = (
        <AuthGuard
          requiresAuth={meta?.requiresAuth}
          roles={meta?.roles}
          permissions={meta?.permissions}
        >
          <Component />
        </AuthGuard>
      );
    }

    // 递归处理子路由
    if (children && children.length > 0) {
      routeObject.children = transformRoutes(children);
    }

    return routeObject;
  });
};

/**
 * 从路由配置中提取菜单数据
 * @param routes 路由配置
 * @returns 菜单数据
 */
export const getMenusFromRoutes = (routes: RouteConfig[]): any[] => {
  const menus: any[] = [];

  routes.forEach((route) => {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
      return;
    }

    const menu: any = {
      path: route.path,
      title: route.meta?.title,
      icon: route.meta?.icon,
    };

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      const childMenus = getMenusFromRoutes(route.children);
      if (childMenus.length > 0) {
        menu.children = childMenus;
      }
    }

    menus.push(menu);
  });

  return menus;
};

