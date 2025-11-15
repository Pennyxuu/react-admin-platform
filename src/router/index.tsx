/**
 * 路由配置入口
 */

import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { routes } from './routes';
import { transformRoutes } from './utils';

/**
 * 全局加载组件
 */
const GlobalLoading = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Spin size="large" tip="加载中..." />
  </div>
);

/**
 * 创建路由实例
 */
const router = createBrowserRouter(transformRoutes(routes));

/**
 * 路由组件
 */
export const Router = () => {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
export { routes } from './routes';
export type { RouteConfig, RouteMeta } from './types';

