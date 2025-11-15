# 权限系统实现任务清单

## 📋 任务总览

本项目将实现三种权限模型：

1. **RBAC** - 后台整体权限系统（基于角色）
2. **ACL** - 协作表单权限控制（访问控制列表）
3. **ABAC** - 特定模块权限控制（基于属性）

---

## 1️⃣ 协作表单的 ACL 权限控制

### 目标
实现类似 Google Docs 的权限分享功能，每个表单可以设置不同用户的访问权限。

### 子任务

#### ✅ 1.1 设计协作表单的 ACL 数据结构
```typescript
// 表单的 ACL 数据结构
interface FormACL {
  formId: string;
  ownerId: string;
  acl: {
    [userId: string]: 'owner' | 'editor' | 'viewer';
  };
}

// 示例
const formACL = {
  formId: 'form_123',
  ownerId: 'user_1',
  acl: {
    'user_1': 'owner',    // 张三：所有者
    'user_2': 'editor',   // 李四：编辑者
    'user_3': 'viewer'    // 王五：查看者
  }
}
```

#### ✅ 1.2 实现表单权限检查 Hook (useFormPermission)
```typescript
// src/hooks/useFormPermission.ts
const { canView, canEdit, canDelete, canShare } = useFormPermission(formId);
```

#### ✅ 1.3 实现表单分享/权限管理界面
- 创建分享弹窗组件
- 支持添加/删除协作者
- 支持设置权限级别（所有者/编辑者/查看者）

#### ✅ 1.4 在表单页面应用 ACL 权限控制
- 表单列表页：根据权限显示操作按钮
- 表单详情页：根据权限控制编辑/删除/分享功能

---

## 2️⃣ 后台整体的 RBAC 权限系统

### 目标
基于角色的访问控制，用户通过角色获得权限。

### 已完成
- ✅ `usePermission` Hook
- ✅ `Permission` 组件
- ✅ 路由守卫

### 子任务

#### ✅ 2.1 在各页面应用 RBAC 权限控制
在以下页面应用权限控制：
- 用户管理页面
- 角色管理页面
- 系统设置页面
- Dashboard 页面

```tsx
// 示例
<Permission permission="user:add">
  <Button>添加用户</Button>
</Permission>
```

#### ✅ 2.2 创建角色管理页面
功能：
- 角色列表展示
- 创建/编辑/删除角色
- 为角色分配权限（树形选择器）

#### ✅ 2.3 创建权限管理页面
功能：
- 展示所有可用权限
- 权限分组（用户管理、角色管理、系统设置等）
- 权限搜索

---

## 3️⃣ 特定模块的 ABAC 权限控制

### 目标
为某个特定模块（如财务模块、人事模块）实现基于属性的访问控制。

### 子任务

#### ✅ 3.1 设计 ABAC 属性数据结构
```typescript
// 用户属性
interface UserAttributes {
  department: string;  // 部门
  level: string;       // 职级
  location: string;    // 地点
}

// 资源属性
interface ResourceAttributes {
  type: string;        // 资源类型
  department: string;  // 所属部门
  sensitivity: string; // 敏感级别
}

// 环境属性
interface EnvironmentAttributes {
  time: Date;          // 时间
  ip: string;          // IP地址
  device: string;      // 设备类型
}
```

#### ✅ 3.2 实现 ABAC 权限检查引擎
```typescript
// src/hooks/useAbacPermission.ts
const { checkAccess } = useAbacPermission();

// 检查权限
const canAccess = checkAccess({
  user: { department: 'HR', level: 'manager' },
  resource: { type: 'salary', department: 'HR' },
  environment: { time: new Date(), ip: '192.168.1.1' }
});
```

#### ✅ 3.3 在特定模块应用 ABAC 权限
选择一个模块（如财务模块）应用 ABAC 权限控制：
- 根据部门、职级判断访问权限
- 根据时间限制访问（如只能在工作日访问）
- 根据地点限制访问（如只能在公司内网访问）

---

## 📊 权限模型对比

| 权限模型 | 应用场景 | 复杂度 | 灵活性 |
|---------|---------|--------|--------|
| **RBAC** | 后台整体 | ⭐ 简单 | ⭐⭐ 中等 |
| **ACL** | 协作表单 | ⭐⭐ 中等 | ⭐⭐⭐ 灵活 |
| **ABAC** | 特定模块 | ⭐⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ 非常灵活 |

---

## 🎯 实现顺序建议

### 第一阶段：RBAC（最简单）
1. 在现有页面应用 `usePermission` 和 `Permission` 组件
2. 创建角色管理页面
3. 创建权限管理页面

### 第二阶段：ACL（中等难度）
1. 设计 ACL 数据结构
2. 实现 `useFormPermission` Hook
3. 创建分享弹窗
4. 在表单页面应用

### 第三阶段：ABAC（最复杂）
1. 设计属性数据结构
2. 实现 `useAbacPermission` Hook
3. 选择一个模块应用

---

## 📚 参考文档

- `PERMISSION_GUIDE.md` - 权限系统使用指南
- `PERMISSION_SIMPLE_EXPLANATION.md` - 超简单解释（强烈推荐）
- `src/components/Permission/example.tsx` - 使用示例

---

## 💡 提示

- 先从 RBAC 开始，因为基础代码已经写好了
- ACL 的核心是"每个资源有自己的访问列表"
- ABAC 的核心是"根据属性判断权限"
- 不要一次性实现所有功能，一步一步来！

加油！💪

