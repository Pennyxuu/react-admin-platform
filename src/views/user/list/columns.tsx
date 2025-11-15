/**
 * 用户列表表格列配置
 * 
 * 设计原则：单一职责原则（SRP）
 * - 这个文件只负责表格列的配置
 * - 不包含数据获取和业务逻辑
 * 
 * 优点：
 * 1. 配置集中：所有列配置在一个地方
 * 2. 易于维护：修改列配置不影响其他代码
 * 3. 可复用：可以在其他地方使用相同的列配置
 */

import { Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '@/hooks/useUserList';

/**
 * 列配置参数
 */
interface GetColumnsParams {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

/**
 * 获取表格列配置
 * 
 * 设计模式：工厂模式
 * - 根据参数动态创建列配置
 * - 支持自定义操作回调
 * 
 * @param params 配置参数
 * @returns 表格列配置
 */
export const getUserListColumns = (params: GetColumnsParams): ColumnsType<User> => {
  const { onEdit, onDelete } = params;

  return [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      /**
       * 设计原则：开放封闭原则（OCP）
       * - 支持自定义渲染，但不修改原有逻辑
       */
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      /**
       * 设计模式：策略模式
       * - 根据不同的状态值，使用不同的渲染策略
       */
      render: (status: string) => {
        // 状态渲染策略映射
        const statusMap: Record<string, { text: string; color: string }> = {
          active: { text: '正常', color: 'green' },
          inactive: { text: '禁用', color: 'red' },
        };

        const config = statusMap[status] || { text: '未知', color: 'gray' };
        
        return <span style={{ color: config.color }}>{config.text}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      /**
       * 设计原则：依赖倒置原则（DIP）
       * - 依赖抽象（回调函数），不依赖具体实现
       * - 调用者传入具体的操作逻辑
       */
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
};

/**
 * 扩展示例：可以创建不同的列配置工厂
 * 
 * 设计模式：工厂模式的扩展
 */

/**
 * 简化版列配置（只读模式）
 */
export const getUserListColumnsReadonly = (): ColumnsType<User> => {
  return [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === 'active' ? '正常' : '禁用'),
    },
  ];
};

