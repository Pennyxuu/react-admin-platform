/**
 * 路由守卫
 * 用于权限控制和路由拦截
 */

import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';

interface AuthGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
}

/**
 * 认证守卫组件
 * 检查用户是否已登录，以及是否有权限访问
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiresAuth = false,
  roles = [],
  permissions = [],
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userInfo } = useUserStore();

  useEffect(() => {
    // 如果不需要认证，直接放行
    if (!requiresAuth) {
      return;
    }

    // 检查是否已登录
    if (!token) {
      // 未登录，跳转到登录页，并记录当前路径
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    // 检查角色权限
    if (roles.length > 0 && userInfo?.roles) {
      const hasRole = roles.some((role) => userInfo.roles?.includes(role));
      if (!hasRole) {
        // 没有角色权限，跳转到 403 页面
        navigate('/403', { replace: true });
        return;
      }
    }

    // 检查操作权限
    if (permissions.length > 0 && userInfo?.permissions) {
      const hasPermission = permissions.some((permission) =>
        userInfo.permissions?.includes(permission)
      );
      if (!hasPermission) {
        // 没有操作权限，跳转到 403 页面
        navigate('/403', { replace: true });
        return;
      }
    }
  }, [token, userInfo, requiresAuth, roles, permissions, location, navigate]);

  // 如果需要认证但未登录，返回 null（等待跳转）
  if (requiresAuth && !token) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;

