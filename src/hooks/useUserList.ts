/**
 * 用户列表 Hook
 * 
 * 设计原则：单一职责原则（SRP）
 * - 这个 Hook 只负责用户列表的数据管理和业务逻辑
 * - 不包含 UI 渲染逻辑
 * 
 * 优点：
 * 1. 逻辑复用：可以在多个组件中使用
 * 2. 易于测试：可以单独测试业务逻辑
 * 3. 职责清晰：数据管理和 UI 分离
 */

import { useState, useEffect } from 'react';
import { message } from 'antd';

/**
 * 用户数据类型
 */
export interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createTime: string;
}

/**
 * Hook 返回值类型
 */
interface UseUserListReturn {
  loading: boolean;
  dataSource: User[];
  searchText: string;
  setSearchText: (text: string) => void;
  fetchUserList: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (user: User) => void;
}

/**
 * 用户列表 Hook
 * 
 * 使用示例：
 * ```typescript
 * const { loading, dataSource, fetchUserList } = useUserList();
 * ```
 */
export const useUserList = (): UseUserListReturn => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');

  /**
   * 获取用户列表
   */
  const fetchUserList = async () => {
    try {
      setLoading(true);
      
      // TODO: 后续接入真实 API
      // const response = await userApi.getUserList({ keyword: searchText });
      
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据
      const mockData: User[] = [
        {
          id: '1',
          username: 'admin',
          nickname: '管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active',
          createTime: '2024-01-01 10:00:00',
        },
        {
          id: '2',
          username: 'user1',
          nickname: '用户1',
          email: 'user1@example.com',
          phone: '13800138001',
          status: 'active',
          createTime: '2024-01-02 10:00:00',
        },
        {
          id: '3',
          username: 'user2',
          nickname: '用户2',
          email: 'user2@example.com',
          phone: '13800138002',
          status: 'inactive',
          createTime: '2024-01-03 10:00:00',
        },
      ];
      
      // 如果有搜索关键词，过滤数据
      const filteredData = searchText
        ? mockData.filter(user => 
            user.username.includes(searchText) ||
            user.nickname.includes(searchText) ||
            user.email.includes(searchText)
          )
        : mockData;
      
      setDataSource(filteredData);
      message.success('加载成功');
    } catch (error: any) {
      message.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除用户
   */
  const handleDelete = async (id: string) => {
    try {
      // TODO: 调用删除 API
      // await userApi.deleteUser(id);
      
      message.success('删除成功');
      await fetchUserList(); // 重新加载列表
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  /**
   * 编辑用户
   */
  const handleEdit = (user: User) => {
    message.info(`编辑用户：${user.username}`);
    // TODO: 打开编辑弹窗
  };

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    loading,
    dataSource,
    searchText,
    setSearchText,
    fetchUserList,
    handleDelete,
    handleEdit,
  };
};

