/*
 * @Author: xhp 837792102@qq.com
 * @Date: 2025-11-13 04:34:24
 * @LastEditors: xhp 837792102@qq.com
 * @LastEditTime: 2025-11-13 05:46:48
 * @FilePath: /react-admin-platform/src/api/types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * API 类型定义
 * 定义所有 API 请求和响应的类型
 */

/**
 * 通用 API 响应结构
 */
/**
 * 通用 API 响应结构
 * @template T - 响应数据的类型，默认为 any
 * @property code - 响应状态码
 * @property data - 响应数据，类型由泛型参数 T 决定
 * @property message - 响应消息
 * @property success - 是否成功的标志，可选
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success?: boolean;
}



/**
 * 分页请求参数
 */
export interface PageParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应数据
 * 
 * 这是一个泛型接口，用于定义分页查询的响应数据结构
 * 
 * @template T - 列表项的类型，通过泛型参数指定
 * 
 * 使用示例：
 * ```typescript
 * // 用户列表的分页数据
 * const userPageData: PageResult<UserInfo> = {
 *   list: [{ id: 1, username: 'admin' }],
 *   total: 100,
 *   page: 1,
 *   pageSize: 10
 * }
 * 
 * // 订单列表的分页数据
 * const orderPageData: PageResult<Order> = {
 *   list: [{ id: 1, orderNo: 'xxx' }],
 *   total: 50,
 *   page: 1,
 *   pageSize: 20
 * }
 * ```
 * 
 * @property list - 当前页的数据列表，类型由泛型 T 决定
 * @property total - 数据总条数，用于计算总页数
 * @property page - 当前页码
 * @property pageSize - 每页显示的条数
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
  /**
   * token 过期时间（秒）
   * 表示 token 在多少秒后过期，可选字段
   * 例如：7200 表示 2 小时后过期
   */
  expiresIn?: number;
}

/**
 * 菜单项
 */
export interface MenuItem {
  id: number | string;
  name: string;
  path: string;
  icon?: string;
  component?: string;
  parentId?: number | string;
  orderNum?: number;
  hidden?: boolean;
  children?: MenuItem[];
}

