/**
 * 用户列表页面
 *
 * 设计原则应用：
 * 1. 单一职责原则（SRP）：
 *    - 组件只负责 UI 渲染
 *    - 业务逻辑抽离到 useUserList Hook
 *    - 表格配置抽离到 columns.tsx
 *
 * 2. 开放封闭原则（OCP）：
 *    - 通过 props 和 Hook 扩展功能
 *    - 不修改现有代码
 *
 * 3. 依赖倒置原则（DIP）：
 *    - 依赖抽象（Hook 接口），不依赖具体实现
 */

import { Table, Button, Space, Input, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useUserList } from '@/hooks/useUserList';
import { getUserListColumns } from './columns';

/**
 * 用户列表组件
 *
 * 职责：
 * - UI 渲染
 * - 用户交互
 */
const UserList: React.FC = () => {
  // ========== 使用自定义 Hook ==========

  /**
   * 设计模式：观察者模式
   * - Hook 内部管理状态
   * - 组件订阅状态变化
   * - 状态变化时自动重新渲染
   */
  const {
    loading,
    dataSource,
    searchText,
    setSearchText,
    fetchUserList,
    handleDelete,
    handleEdit,
  } = useUserList();

  // ========== 表格配置 ==========
  
  // ========== 表格列配置 ==========

  /**
   * 设计模式：工厂模式
   * - 使用工厂函数创建列配置
   * - 传入回调函数，实现依赖注入
   */
  const columns = getUserListColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // ========== 渲染页面 ==========

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作按钮 */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 顶部操作栏 */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              {/* 搜索框 */}
              <Input
                placeholder="搜索用户名、昵称、邮箱"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={fetchUserList}
                style={{ width: 300 }}
                allowClear
              />
              <Button type="primary" onClick={fetchUserList}>
                搜索
              </Button>
            </Space>

            {/* 新增按钮 */}
            <Button type="primary" icon={<PlusOutlined />}>
              新增用户
            </Button>
          </div>

          {/* 表格 */}
          <Table
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{
              total: dataSource.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default UserList;

