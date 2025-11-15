/**
 * 权限控制组件
 * 
 * 核心思想：有权限就显示子组件，没权限就隐藏
 * 
 * 使用示例：
 * ```tsx
 * // 单个权限
 * <Permission permission="user:add">
 *   <Button>添加用户</Button>
 * </Permission>
 * 
 * // 多个权限（满足任一即可）
 * <Permission permission={['user:add', 'user:create']}>
 *   <Button>添加用户</Button>
 * </Permission>
 * 
 * // 角色控制
 * <Permission role="admin">
 *   <Button>管理员功能</Button>
 * </Permission>
 * 
 * // 同时检查权限和角色
 * <Permission permission="user:delete" role="admin">
 *   <Button danger>删除用户</Button>
 * </Permission>
 * ```
 */

import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionProps {
  /** 子组件 */
  children: ReactNode;
  /** 需要的权限（字符串或字符串数组） */
  permission?: string | string[];
  /** 需要的角色（字符串或字符串数组） */
  role?: string | string[];
  /** 
   * 逻辑类型
   * - 'OR': 满足任一权限/角色即可（默认）
   * - 'AND': 必须同时满足所有权限/角色
   */
  logic?: 'OR' | 'AND';
  /**
   * 没有权限时显示的内容（可选）
   * 默认不显示任何内容
   */
  fallback?: ReactNode;
}

/**
 * 权限控制组件
 */
export const Permission: React.FC<PermissionProps> = ({
  children,
  permission,
  role,
  logic = 'OR',
  fallback = null,
}) => {
  const { hasPermission, hasRole, hasAllPermissions, hasAllRoles } = usePermission();

  // 检查权限
  let hasPermissionCheck = true;
  if (permission) {
    if (logic === 'AND' && Array.isArray(permission)) {
      hasPermissionCheck = hasAllPermissions(permission);
    } else {
      hasPermissionCheck = hasPermission(permission);
    }
  }

  // 检查角色
  let hasRoleCheck = true;
  if (role) {
    if (logic === 'AND' && Array.isArray(role)) {
      hasRoleCheck = hasAllRoles(role);
    } else {
      hasRoleCheck = hasRole(role);
    }
  }

  // 如果同时指定了权限和角色，需要都满足
  const hasAccess = hasPermissionCheck && hasRoleCheck;

  // 有权限就显示子组件，没权限就显示 fallback（默认为 null）
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default Permission;

