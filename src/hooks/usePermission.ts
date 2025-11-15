/**
 * 权限检查 Hook
 * 
 * 核心思想：就是检查字符串数组里有没有某个字符串
 * 
 * 使用示例：
 * ```tsx
 * const { hasPermission, hasRole } = usePermission();
 * 
 * // 检查单个权限
 * if (hasPermission('user:add')) {
 *   // 显示添加按钮
 * }
 * 
 * // 检查多个权限（满足任一即可）
 * if (hasPermission(['user:add', 'user:create'])) {
 *   // 显示添加按钮
 * }
 * ```
 */

import { useUserStore } from '@/store';

export const usePermission = () => {
  const { userInfo } = useUserStore();

  /**
   * 检查是否有某个权限
   * 
   * 原理：就是检查 userInfo.permissions 数组里有没有这个字符串
   * 
   * @param permission 权限码（字符串或字符串数组）
   * @returns 是否有权限
   * 
   * 示例：
   * hasPermission('user:add')                    // 检查单个权限
   * hasPermission(['user:add', 'user:create'])   // 检查多个权限（满足任一）
   */
  const hasPermission = (permission: string | string[]): boolean => {
    // 如果没有登录或没有权限信息，返回 false
    if (!userInfo?.permissions) {
      return false;
    }

    // 如果传入的是字符串，转成数组
    const permissions = Array.isArray(permission) ? permission : [permission];

    // 检查用户的权限数组里是否包含任一权限
    // some() 方法：只要有一个满足就返回 true
    return permissions.some((perm) => userInfo.permissions?.includes(perm));
  };

  /**
   * 检查是否有某个角色
   * 
   * 原理：就是检查 userInfo.roles 数组里有没有这个字符串
   * 
   * @param role 角色名（字符串或字符串数组）
   * @returns 是否有角色
   * 
   * 示例：
   * hasRole('admin')                  // 检查单个角色
   * hasRole(['admin', 'super_admin']) // 检查多个角色（满足任一）
   */
  const hasRole = (role: string | string[]): boolean => {
    // 如果没有登录或没有角色信息，返回 false
    if (!userInfo?.roles) {
      return false;
    }

    // 如果传入的是字符串，转成数组
    const roles = Array.isArray(role) ? role : [role];

    // 检查用户的角色数组里是否包含任一角色
    return roles.some((r) => userInfo.roles?.includes(r));
  };

  /**
   * 检查是否有所有权限（AND 逻辑）
   * 
   * @param permissions 权限码数组
   * @returns 是否拥有所有权限
   * 
   * 示例：
   * hasAllPermissions(['user:add', 'user:edit']) // 必须同时拥有两个权限
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userInfo?.permissions) {
      return false;
    }

    // every() 方法：所有都满足才返回 true
    return permissions.every((perm) => userInfo.permissions?.includes(perm));
  };

  /**
   * 检查是否有所有角色（AND 逻辑）
   * 
   * @param roles 角色名数组
   * @returns 是否拥有所有角色
   */
  const hasAllRoles = (roles: string[]): boolean => {
    if (!userInfo?.roles) {
      return false;
    }

    return roles.every((role) => userInfo.roles?.includes(role));
  };

  return {
    hasPermission,      // 检查权限（OR 逻辑）
    hasRole,           // 检查角色（OR 逻辑）
    hasAllPermissions, // 检查所有权限（AND 逻辑）
    hasAllRoles,       // 检查所有角色（AND 逻辑）
  };
};

export default usePermission;

