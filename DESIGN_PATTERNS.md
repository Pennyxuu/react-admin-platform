# 设计原则和设计模式应用文档

> 本文档记录项目中应用的设计原则和设计模式，方便面试时讲解

---

## 📋 目录

1. [SOLID 原则](#solid-原则)
2. [创建型模式](#创建型模式)
3. [结构型模式](#结构型模式)
4. [行为型模式](#行为型模式)
5. [React 特有模式](#react-特有模式)

---

## 🎯 SOLID 原则

### 1. 单一职责原则（Single Responsibility Principle）

**定义：** 一个类或模块应该只有一个引起它变化的原因。

**应用场景：**

#### ✅ 用户列表模块拆分

**问题：** 原始的 `UserList` 组件职责过多
```typescript
// ❌ 违反 SRP：一个组件做了太多事情
const UserList = () => {
  // 1. 数据获取
  const fetchUserList = async () => { ... }
  
  // 2. 状态管理
  const [loading, setLoading] = useState(false);
  
  // 3. 业务逻辑
  const handleDelete = async (id: string) => { ... }
  
  // 4. UI 渲染
  return <Table ... />
}
```

**解决方案：** 拆分职责
```typescript
// ✅ 符合 SRP：职责分离

// 1. 业务逻辑 Hook（src/hooks/useUserList.ts）
export const useUserList = () => {
  // 只负责数据管理和业务逻辑
  const [loading, setLoading] = useState(false);
  const fetchUserList = async () => { ... }
  return { loading, dataSource, fetchUserList };
}

// 2. 表格配置（src/views/user/list/columns.tsx）
export const getUserListColumns = (params) => {
  // 只负责表格列配置
  return [ ... ];
}

// 3. UI 组件（src/views/user/list/index.tsx）
const UserList = () => {
  // 只负责 UI 渲染
  const { loading, dataSource } = useUserList();
  const columns = getUserListColumns({ ... });
  return <Table ... />
}
```

**优点：**
- ✅ 逻辑复用：Hook 可以在多个组件中使用
- ✅ 易于测试：可以单独测试业务逻辑
- ✅ 易于维护：修改表格配置不影响业务逻辑

**文件位置：**
- `src/hooks/useUserList.ts` - 业务逻辑
- `src/views/user/list/columns.tsx` - 表格配置
- `src/views/user/list/index.tsx` - UI 组件

---

### 2. 开放封闭原则（Open/Closed Principle）

**定义：** 软件实体应该对扩展开放，对修改封闭。

**应用场景：**

#### ✅ 表格列配置的扩展

```typescript
// ✅ 符合 OCP：通过参数扩展功能，不修改原有代码

// 基础版本
export const getUserListColumns = (params: GetColumnsParams) => {
  return [ ... ];
}

// 扩展版本：只读模式（不修改原有函数）
export const getUserListColumnsReadonly = () => {
  return [ ... ];
}

// 扩展版本：管理员模式（添加更多操作）
export const getUserListColumnsAdmin = (params: GetColumnsParams) => {
  const baseColumns = getUserListColumns(params);
  return [
    ...baseColumns,
    { title: '高级操作', ... }  // 扩展新列
  ];
}
```

**文件位置：**
- `src/views/user/list/columns.tsx`

---

### 3. 里氏替换原则（Liskov Substitution Principle）

**定义：** 子类对象应该能够替换父类对象，而不影响程序的正确性。

**应用场景：**

#### ✅ API 适配器

```typescript
// TODO: 后续实现
// 不同的 API 实现可以互相替换
```

---

### 4. 接口隔离原则（Interface Segregation Principle）

**定义：** 客户端不应该依赖它不需要的接口。

**应用场景：**

#### ✅ Hook 返回值类型定义

```typescript
// ✅ 符合 ISP：只暴露必要的接口

interface UseUserListReturn {
  // 只暴露组件需要的属性和方法
  loading: boolean;
  dataSource: User[];
  fetchUserList: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  // 不暴露内部实现细节
}
```

**文件位置：**
- `src/hooks/useUserList.ts`

---

### 5. 依赖倒置原则（Dependency Inversion Principle）

**定义：** 高层模块不应该依赖低层模块，两者都应该依赖抽象。

**应用场景：**

#### ✅ 表格列配置的回调函数

```typescript
// ✅ 符合 DIP：依赖抽象（回调函数），不依赖具体实现

// 抽象接口
interface GetColumnsParams {
  onEdit: (user: User) => void;    // 抽象的编辑操作
  onDelete: (id: string) => void;  // 抽象的删除操作
}

// 列配置依赖抽象
export const getUserListColumns = (params: GetColumnsParams) => {
  const { onEdit, onDelete } = params;
  return [
    {
      render: (_, record) => (
        <Button onClick={() => onEdit(record)}>编辑</Button>
      ),
    },
  ];
}

// 具体实现由调用者提供
const columns = getUserListColumns({
  onEdit: (user) => { /* 具体的编辑逻辑 */ },
  onDelete: (id) => { /* 具体的删除逻辑 */ },
});
```

**文件位置：**
- `src/views/user/list/columns.tsx`

---

## 🏭 创建型模式

### 1. 工厂模式（Factory Pattern）

**定义：** 定义一个创建对象的接口，让子类决定实例化哪个类。

**应用场景：**

#### ✅ 表格列配置工厂

```typescript
// 工厂函数：根据参数创建不同的列配置
export const getUserListColumns = (params: GetColumnsParams) => {
  return [ ... ];
}

// 使用
const columns = getUserListColumns({ onEdit, onDelete });
```

**文件位置：**
- `src/views/user/list/columns.tsx`

---

（未完待续...）

