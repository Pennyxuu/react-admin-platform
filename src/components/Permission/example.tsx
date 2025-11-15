/**
 * 权限组件使用示例
 * 
 * 这个文件展示了如何在实际项目中使用权限控制
 */

import { Button, Space, Table } from 'antd';
import { Permission } from './index';
import { usePermission } from '@/hooks/usePermission';

/**
 * 示例1：用户管理页面
 */
export const UserManagementExample = () => {
  const { hasPermission } = usePermission();

  return (
    <div>
      <h2>用户管理</h2>

      {/* 方式1: 使用 Permission 组件 */}
      <Space>
        <Permission permission="user:add">
          <Button type="primary">添加用户</Button>
        </Permission>

        <Permission permission="user:export">
          <Button>导出数据</Button>
        </Permission>

        <Permission permission="user:import">
          <Button>导入数据</Button>
        </Permission>
      </Space>

      {/* 方式2: 使用 usePermission Hook */}
      <Space style={{ marginTop: 16 }}>
        {hasPermission('user:add') && (
          <Button type="primary">添加用户（Hook方式）</Button>
        )}

        {hasPermission('user:batch-delete') && (
          <Button danger>批量删除</Button>
        )}
      </Space>

      {/* 表格操作列 */}
      <Table
        dataSource={[
          { id: 1, name: '张三', role: '管理员' },
          { id: 2, name: '李四', role: '普通用户' },
        ]}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: '姓名', dataIndex: 'name' },
          { title: '角色', dataIndex: 'role' },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                {/* 编辑按钮：需要 user:edit 权限 */}
                <Permission permission="user:edit">
                  <Button type="link" size="small">
                    编辑
                  </Button>
                </Permission>

                {/* 删除按钮：需要 user:delete 权限 */}
                <Permission permission="user:delete">
                  <Button type="link" danger size="small">
                    删除
                  </Button>
                </Permission>

                {/* 重置密码：需要 user:reset-password 权限 */}
                <Permission permission="user:reset-password">
                  <Button type="link" size="small">
                    重置密码
                  </Button>
                </Permission>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

/**
 * 示例2：多个权限（满足任一即可）
 */
export const MultiplePermissionsExample = () => {
  return (
    <div>
      {/* 有 user:add 或 user:create 任一权限即可显示 */}
      <Permission permission={['user:add', 'user:create']}>
        <Button>添加用户</Button>
      </Permission>
    </div>
  );
};

/**
 * 示例3：角色控制
 */
export const RoleControlExample = () => {
  return (
    <div>
      {/* 只有管理员可以看到 */}
      <Permission role="admin">
        <Button danger>危险操作（仅管理员）</Button>
      </Permission>

      {/* 管理员或超级管理员可以看到 */}
      <Permission role={['admin', 'super_admin']}>
        <Button>高级功能</Button>
      </Permission>
    </div>
  );
};

/**
 * 示例4：同时检查权限和角色
 */
export const PermissionAndRoleExample = () => {
  return (
    <div>
      {/* 必须是管理员，且有 user:delete 权限 */}
      <Permission role="admin" permission="user:delete">
        <Button danger>删除用户</Button>
      </Permission>
    </div>
  );
};

/**
 * 示例5：没有权限时显示提示
 */
export const FallbackExample = () => {
  return (
    <div>
      <Permission
        permission="user:add"
        fallback={<Button disabled>添加用户（无权限）</Button>}
      >
        <Button type="primary">添加用户</Button>
      </Permission>
    </div>
  );
};

/**
 * 示例6：复杂的业务场景
 */
export const ComplexExample = () => {
  const { hasPermission, hasRole } = usePermission();

  // 复杂的权限判断逻辑
  const canEdit = hasPermission('user:edit') && hasRole('admin');
  const canDelete = hasPermission(['user:delete', 'user:remove']) || hasRole('super_admin');

  return (
    <div>
      {canEdit && <Button>编辑</Button>}
      {canDelete && <Button danger>删除</Button>}
    </div>
  );
};

