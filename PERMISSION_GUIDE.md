# 权限系统使用指南

## 📚 目录

1. [核心概念](#核心概念)
2. [数据流程](#数据流程)
3. [快速开始](#快速开始)
4. [使用示例](#使用示例)
5. [常见问题](#常见问题)

---

## 🎯 核心概念

### 权限系统就是：检查字符串数组里有没有某个字符串

```typescript
// 用户的权限数据（后端返回）
const userInfo = {
  permissions: ['user:add', 'user:edit', 'user:delete']
}

// 检查权限（就是 includes 方法）
userInfo.permissions.includes('user:add')    // true ✅
userInfo.permissions.includes('product:add') // false ❌
```

**就这么简单！** 没有任何复杂的逻辑！

---

## 📊 数据流程

```
1. 用户登录
   ↓
2. 后端返回用户信息 + 权限数组
   {
     token: 'xxx',
     userInfo: {
       id: 1,
       username: 'admin',
       permissions: ['user:add', 'user:edit', 'user:delete']
     }
   }
   ↓
3. 前端存储到 Zustand Store
   useUserStore.setUserInfo(userInfo)
   ↓
4. 在页面中使用
   const { hasPermission } = usePermission()
   hasPermission('user:add') // true
```

---

## 🚀 快速开始

### 1. 后端需要返回的数据格式

```typescript
// 登录接口返回
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": "https://...",
      "roles": ["admin", "editor"],           // 角色数组
      "permissions": [                         // 权限数组
        "user:add",
        "user:edit",
        "user:delete",
        "order:view",
        "order:export"
      ]
    }
  }
}
```

### 2. 前端使用（两种方式）

#### 方式1：使用 `usePermission` Hook

```tsx
import { usePermission } from '@/hooks';
import { Button } from 'antd';

function UserPage() {
  const { hasPermission } = usePermission();

  return (
    <div>
      {/* 有权限就显示，没权限就隐藏 */}
      {hasPermission('user:add') && (
        <Button type="primary">添加用户</Button>
      )}

      {hasPermission('user:delete') && (
        <Button danger>删除用户</Button>
      )}
    </div>
  );
}
```

#### 方式2：使用 `Permission` 组件

```tsx
import { Permission } from '@/components';
import { Button } from 'antd';

function UserPage() {
  return (
    <div>
      {/* 有权限就显示，没权限就隐藏 */}
      <Permission permission="user:add">
        <Button type="primary">添加用户</Button>
      </Permission>

      <Permission permission="user:delete">
        <Button danger>删除用户</Button>
      </Permission>
    </div>
  );
}
```

---

## 💡 使用示例

### 示例1：单个权限

```tsx
<Permission permission="user:add">
  <Button>添加用户</Button>
</Permission>
```

### 示例2：多个权限（满足任一即可）

```tsx
<Permission permission={['user:add', 'user:create']}>
  <Button>添加用户</Button>
</Permission>
```

### 示例3：角色控制

```tsx
<Permission role="admin">
  <Button>管理员功能</Button>
</Permission>
```

### 示例4：表格操作列

```tsx
<Table
  columns={[
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Permission permission="user:edit">
            <Button type="link">编辑</Button>
          </Permission>

          <Permission permission="user:delete">
            <Button type="link" danger>删除</Button>
          </Permission>
        </Space>
      ),
    },
  ]}
/>
```

---

## ❓ 常见问题

### Q1: 权限码怎么定义？

**A:** 推荐使用 `模块:操作` 的格式：

```
user:add        // 用户-添加
user:edit       // 用户-编辑
user:delete     // 用户-删除
user:view       // 用户-查看
order:export    // 订单-导出
product:import  // 产品-导入
```

### Q2: 前端需要做权限验证吗？

**A:** 需要！但前端权限只是**UI控制**，真正的权限验证在**后端**。

- ✅ 前端：控制按钮显示/隐藏（提升用户体验）
- ✅ 后端：验证接口权限（真正的安全保障）

### Q3: 如何测试不同权限？

**A:** 修改 Mock 数据中的 permissions 数组：

```typescript
// 测试管理员权限
const adminUser = {
  permissions: ['user:add', 'user:edit', 'user:delete', 'user:view']
}

// 测试普通用户权限
const normalUser = {
  permissions: ['user:view'] // 只能查看
}
```

### Q4: 权限数据存在哪里？

**A:** 存在 Zustand Store 中，会自动持久化到 localStorage：

```typescript
const { userInfo } = useUserStore();
console.log(userInfo.permissions); // ['user:add', 'user:edit', ...]
```

---

## 🎨 完整示例

查看 `src/components/Permission/example.tsx` 文件，里面有完整的使用示例。

---

## 📝 总结

权限系统的核心就是：

1. **后端返回权限数组**：`['user:add', 'user:edit']`
2. **前端存储到 Store**：`useUserStore.setUserInfo(userInfo)`
3. **使用时检查数组**：`permissions.includes('user:add')`

**就这么简单！** 不要想得太复杂！

