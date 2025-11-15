# Zustand 中间件完全指南

## 📖 目录

- [什么是中间件？](#什么是中间件)
- [中间件的工作原理](#中间件的工作原理)
- [常见中间件示例](#常见中间件示例)
- [如何自己写中间件](#如何自己写中间件)
- [中间件组合使用](#中间件组合使用)
- [最佳实践](#最佳实践)

---

## 什么是中间件？

**中间件（Middleware）** 就像是一个"加工厂"或"拦截器"，它在数据流动的过程中，对数据进行额外的处理。

### 📦 形象比喻

想象你在网购：
1. **你下单** → 这是原始操作
2. **快递公司包装** → 这是中间件1（包装服务）
3. **快递公司运输** → 这是中间件2（物流服务）
4. **商品到达** → 最终结果

中间件就是在"下单"和"收货"之间的那些**额外处理步骤**。

---

## 中间件的工作原理

### 🔄 执行流程

```
用户操作 → 中间件拦截 → 执行额外逻辑 → 更新状态
   ↓           ↓              ↓            ↓
setTheme  →  persist   →  保存到本地  →  更新 theme
```

### 没有中间件 vs 使用中间件

#### ❌ 没有中间件的情况：
```typescript
// 普通的 Zustand Store
const useStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
}));

// 问题：刷新页面后，theme 会重置为 'light'
```

#### ✅ 使用 persist 中间件后：
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme })
    }),
    { name: 'app-storage' }
  )
);

// ✅ 自动保存到 localStorage
// ✅ 刷新页面后自动恢复状态
```

### 具体步骤：
1. **你调用** `setTheme('dark')`
2. **persist 中间件拦截**，先保存到 `localStorage`
3. **然后更新** Zustand 状态
4. **页面刷新时**，persist 自动从 `localStorage` 恢复数据

---

## 常见中间件示例

### 1️⃣ 持久化中间件 (persist)

**作用**：自动保存状态到 localStorage/sessionStorage

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    {
      name: 'my-storage', // localStorage 的 key
      partialize: (state) => ({ count: state.count }), // 选择需要持久化的字段
    }
  )
);
```

**适用场景**：
- 用户配置（主题、语言）
- 购物车数据
- 表单草稿

---

### 2️⃣ 开发工具中间件 (devtools)

**作用**：在 Redux DevTools 中查看状态变化

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    { name: 'CounterStore' } // DevTools 中显示的名称
  )
);
```

**适用场景**：
- 开发调试
- 状态追踪
- 时间旅行调试

---

### 3️⃣ 日志中间件 (Logger)

**作用**：记录每次状态变化

```typescript
// src/store/middleware/logger.ts
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    console.log(`🔄 [${name || 'Store'}] 状态更新前:`, get());
    set(...args);
    console.log(`✅ [${name || 'Store'}] 状态更新后:`, get());
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as Logger;
```

**使用示例**：
```typescript
import { create } from 'zustand';
import { logger } from './middleware/logger';

const useStore = create(
  logger(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    'CounterStore'
  )
);

// 调用 increment() 时，控制台会输出：
// 🔄 [CounterStore] 状态更新前: { count: 0, increment: [Function] }
// ✅ [CounterStore] 状态更新后: { count: 1, increment: [Function] }
```

**适用场景**：
- 开发调试
- 追踪状态变化
- 问题排查

---

### 4️⃣ 错误处理中间件

**作用**：捕获状态更新时的错误，防止应用崩溃

```typescript
// src/store/middleware/errorHandler.ts
import { StateCreator } from 'zustand';
import { message } from 'antd';

export const errorHandler = <T>(
  f: StateCreator<T, [], []>,
  onError?: (error: Error) => void
) => (set: any, get: any, store: any) => {
  const errorHandledSet = (partial: any, replace?: boolean) => {
    try {
      set(partial, replace);
    } catch (error) {
      console.error('❌ 状态更新失败:', error);
      message.error('操作失败，请稍后重试');

      // 自定义错误处理
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return f(errorHandledSet, get, store);
};
```

**使用示例**：
```typescript
const useStore = create(
  errorHandler(
    (set) => ({
      data: null,
      fetchData: async () => {
        const result = await api.getData();
        set({ data: result }); // 如果出错会被捕获
      },
    }),
    (error) => {
      // 发送错误到监控系统
      console.error('发送到 Sentry:', error);
    }
  )
);
```

**适用场景**：
- 生产环境错误监控
- 异步操作错误处理
- 用户友好的错误提示

---

### 5️⃣ 节流中间件 (Throttle)

**作用**：限制状态更新频率，避免频繁渲染

```typescript
// src/store/middleware/throttle.ts
import { StateCreator } from 'zustand';

export const throttle = <T>(
  f: StateCreator<T, [], []>,
  delay: number = 300
) => (set: any, get: any, store: any) => {
  let timer: NodeJS.Timeout | null = null;
  let lastArgs: any = null;

  const throttledSet = (...args: any[]) => {
    lastArgs = args;

    if (!timer) {
      timer = setTimeout(() => {
        if (lastArgs) {
          set(...lastArgs);
        }
        timer = null;
      }, delay);
    }
  };

  return f(throttledSet, get, store);
};
```

**使用示例**：
```typescript
const useSearchStore = create(
  throttle(
    (set) => ({
      keyword: '',
      setKeyword: (keyword: string) => set({ keyword }),
    }),
    500 // 500ms 内只更新一次
  )
);
```

**适用场景**：
- 搜索输入
- 滚动事件
- 窗口 resize 事件

---

### 6️⃣ 时间旅行中间件 (Temporal)

**作用**：记录历史状态，支持撤销/重做

```typescript
// src/store/middleware/temporal.ts
import { StateCreator } from 'zustand';

interface TemporalState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const temporal = <T>(
  f: StateCreator<T, [], []>,
  maxHistory: number = 50
) => (set: any, get: any, store: any) => {
  const initialState = f(set, get, store);

  const temporalState: TemporalState<T> = {
    past: [],
    present: initialState as T,
    future: [],
  };

  return {
    ...initialState,
    ...temporalState,

    // 撤销
    undo: () => {
      const { past, present, future } = get();
      if (past.length === 0) return;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      set({
        past: newPast,
        present: previous,
        future: [present, ...future],
      });
    },

    // 重做
    redo: () => {
      const { past, present, future } = get();
      if (future.length === 0) return;

      const next = future[0];
      const newFuture = future.slice(1);

      set({
        past: [...past, present],
        present: next,
        future: newFuture,
      });
    },

    // 包装 set，自动记录历史
    setState: (partial: Partial<T>) => {
      const { past, present } = get();
      set({
        past: [...past.slice(-maxHistory + 1), present],
        present: { ...present, ...partial },
        future: [],
      });
    },
  };
};
```

**使用示例**：
```typescript
const useEditorStore = create(
  temporal(
    (set) => ({
      content: '',
      setContent: (content: string) => set({ content }),
    }),
    100 // 最多保存 100 条历史
  )
);

// 使用
const { content, setState, undo, redo } = useEditorStore();
setState({ content: 'Hello' });
setState({ content: 'Hello World' });
undo(); // 回到 'Hello'
redo(); // 回到 'Hello World'
```

**适用场景**：
- 文本编辑器
- 画板应用
- 表单编辑

---

### 7️⃣ 权限控制中间件

**作用**：根据用户权限控制某些操作

```typescript
// src/store/middleware/permission.ts
import { StateCreator } from 'zustand';
import { message } from 'antd';

interface PermissionConfig {
  checkPermission: () => boolean;
  onDenied?: () => void;
}

export const withPermission = <T>(
  f: StateCreator<T, [], []>,
  config: PermissionConfig
) => (set: any, get: any, store: any) => {
  const permissionSet = (...args: any[]) => {
    if (!config.checkPermission()) {
      message.error('您没有权限执行此操作');
      config.onDenied?.();
      return;
    }
    set(...args);
  };

  return f(permissionSet, get, store);
};
```

**使用示例**：
```typescript
const useAdminStore = create(
  withPermission(
    (set) => ({
      users: [],
      deleteUser: (id: string) =>
        set((state) => ({
          users: state.users.filter(u => u.id !== id)
        })),
    }),
    {
      checkPermission: () => {
        const userRole = localStorage.getItem('role');
        return userRole === 'admin';
      },
      onDenied: () => {
        console.log('权限不足，已记录日志');
      },
    }
  )
);
```

**适用场景**：
- 多角色系统
- 权限管理
- 敏感操作保护

---

### 8️⃣ 数据同步中间件

**作用**：状态变化时自动同步到服务器

```typescript
// src/store/middleware/sync.ts
import { StateCreator } from 'zustand';

interface SyncConfig<T> {
  syncFn: (state: T) => Promise<void>;
  debounceTime?: number;
}

export const sync = <T>(
  f: StateCreator<T, [], []>,
  config: SyncConfig<T>
) => (set: any, get: any, store: any) => {
  let timer: NodeJS.Timeout | null = null;

  const syncedSet = (...args: any[]) => {
    set(...args);

    // 防抖同步
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const state = get();
      config.syncFn(state).catch(console.error);
    }, config.debounceTime || 1000);
  };

  return f(syncedSet, get, store);
};
```

**使用示例**：
```typescript
const useDraftStore = create(
  sync(
    (set) => ({
      title: '',
      content: '',
      setTitle: (title: string) => set({ title }),
      setContent: (content: string) => set({ content }),
    }),
    {
      syncFn: async (state) => {
        await api.saveDraft({
          title: state.title,
          content: state.content,
        });
        console.log('✅ 草稿已自动保存');
      },
      debounceTime: 2000, // 2秒后自动保存
    }
  )
);
```

**适用场景**：
- 自动保存草稿
- 实时协作
- 数据备份

---

## 如何自己写中间件

### 中间件的基本结构

```typescript
/**
 * 中间件模板
 *
 * 中间件本质上是一个高阶函数：
 * 1. 接收原始的状态创建函数
 * 2. 返回一个增强后的状态创建函数
 */
import { StateCreator } from 'zustand';

export const myMiddleware = <T>(
  // 原始的状态创建函数
  stateCreator: StateCreator<T, [], []>,
  // 中间件配置（可选）
  options?: any
) => (
  // Zustand 提供的三个参数
  set: any,
  get: any,
  store: any
) => {
  // 1. 包装 set 函数（在状态更新前后做处理）
  const wrappedSet = (...args: any[]) => {
    console.log('⏰ 更新前');
    set(...args);
    console.log('✅ 更新后');
  };

  // 2. 调用原始的状态创建函数
  const state = stateCreator(wrappedSet, get, store);

  // 3. 返回增强后的状态（可以添加新方法）
  return {
    ...state,
    // 添加额外的方法或属性
    extraMethod: () => console.log('中间件添加的方法'),
  };
};
```

---

### 实战：性能监控中间件

```typescript
// src/store/middleware/performance.ts

/**
 * 性能监控中间件
 *
 * 功能：
 * 1. 记录每次状态更新的耗时
 * 2. 统计更新次数
 * 3. 检测慢更新（超过阈值）
 */
import { StateCreator } from 'zustand';

interface PerformanceStats {
  updateCount: number;
  totalTime: number;
  slowUpdates: number;
}

export const performance = <T>(
  f: StateCreator<T, [], []>,
  slowThreshold: number = 100 // 慢更新阈值（ms）
) => (set: any, get: any, store: any) => {
  const stats: PerformanceStats = {
    updateCount: 0,
    totalTime: 0,
    slowUpdates: 0,
  };

  const performanceSet = (...args: any[]) => {
    const startTime = performance.now();

    set(...args);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 更新统计
    stats.updateCount++;
    stats.totalTime += duration;

    if (duration > slowThreshold) {
      stats.slowUpdates++;
      console.warn(`⚠️ 慢更新检测: ${duration.toFixed(2)}ms`);
    }
  };

  const state = f(performanceSet, get, store);

  return {
    ...state,
    // 添加性能统计方法
    getPerformanceStats: () => ({
      ...stats,
      averageTime: stats.updateCount > 0
        ? stats.totalTime / stats.updateCount
        : 0,
    }),
    resetStats: () => {
      stats.updateCount = 0;
      stats.totalTime = 0;
      stats.slowUpdates = 0;
    },
  };
};
```

**使用示例**：
```typescript
const useStore = create(
  performance(
    (set) => ({
      data: [],
      addData: (item: any) =>
        set((state) => ({ data: [...state.data, item] })),
    }),
    50 // 超过 50ms 视为慢更新
  )
);

// 使用
const { addData, getPerformanceStats } = useStore();
addData({ id: 1 });
addData({ id: 2 });

console.log(getPerformanceStats());
// {
//   updateCount: 2,
//   totalTime: 15.5,
//   slowUpdates: 0,
//   averageTime: 7.75
// }
```

---

## 中间件组合使用

### 多个中间件的组合

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { performance } from './middleware/performance';

interface State {
  count: number;
  increment: () => void;
}

const useStore = create<State>()(
  // 从外到内的执行顺序
  devtools(              // 5. 开发工具
    persist(             // 4. 持久化
      logger(            // 3. 日志
        errorHandler(    // 2. 错误处理
          performance(   // 1. 性能监控
            (set) => ({
              count: 0,
              increment: () => set((s) => ({ count: s.count + 1 })),
            }),
            50
          )
        )
      ),
      { name: 'my-store' }
    )
  )
);
```

### 执行顺序说明

当调用 `increment()` 时，执行顺序为：

```
用户调用 increment()
  ↓
5. devtools 记录到 Redux DevTools
  ↓
4. persist 准备持久化
  ↓
3. logger 打印日志
  ↓
2. errorHandler 捕获可能的错误
  ↓
1. performance 记录性能
  ↓
实际更新状态
  ↓
1. performance 计算耗时
  ↓
2. errorHandler 检查是否有错误
  ↓
3. logger 打印更新后的状态
  ↓
4. persist 保存到 localStorage
  ↓
5. devtools 更新显示
```

---

## 最佳实践

### 1. 中间件的选择原则

| 环境 | 推荐中间件 |
|------|-----------|
| **开发环境** | `devtools` + `logger` |
| **生产环境** | `persist` + `errorHandler` |
| **性能敏感** | `throttle` / `debounce` |
| **需要撤销** | `temporal` |
| **权限控制** | `withPermission` |

### 2. 中间件组合顺序建议

```typescript
// 推荐的组合顺序（从外到内）
create(
  devtools(        // 最外层：开发工具
    persist(       // 持久化
      logger(      // 日志记录
        errorHandler(  // 错误处理
          // 你的状态逻辑
        )
      )
    )
  )
)
```

### 3. 性能优化建议

- ✅ **生产环境移除 logger**：避免性能损耗
- ✅ **合理使用 throttle/debounce**：减少不必要的更新
- ✅ **partialize 持久化字段**：只保存必要的数据
- ✅ **避免过度嵌套**：中间件不要超过 5 层

### 4. 常见问题

#### Q1: 中间件的顺序重要吗？
**A**: 非常重要！外层中间件先执行，内层中间件后执行。

#### Q2: 可以动态添加中间件吗？
**A**: 不可以。中间件必须在创建 store 时就确定。

#### Q3: 中间件会影响性能吗？
**A**: 会有轻微影响，但通常可以忽略。生产环境建议移除 logger 等调试中间件。

#### Q4: 如何调试中间件？
**A**: 使用 `console.log` 或 Redux DevTools 查看状态变化。

---

## 总结

### 中间件的本质
- **高阶函数**：接收函数，返回增强后的函数
- **拦截器模式**：在操作前后插入逻辑
- **装饰器模式**：给原有功能添加新能力

### 常见应用场景对照表

| 场景 | 中间件 | 优先级 |
|------|--------|--------|
| 数据持久化 | `persist` | ⭐⭐⭐⭐⭐ |
| 开发调试 | `logger`, `devtools` | ⭐⭐⭐⭐ |
| 错误处理 | `errorHandler` | ⭐⭐⭐⭐⭐ |
| 性能优化 | `throttle`, `debounce` | ⭐⭐⭐ |
| 权限控制 | `permission` | ⭐⭐⭐ |
| 撤销重做 | `temporal` | ⭐⭐ |
| 自动保存 | `sync` | ⭐⭐⭐ |

### 写中间件的三个关键点

1. **包装 `set` 函数** - 在状态更新前后做处理
2. **调用原始函数** - 保持原有功能
3. **返回增强状态** - 可以添加新方法

---

## 参考资源

- [Zustand 官方文档](https://docs.pmnd.rs/zustand)
- [Zustand 中间件 API](https://docs.pmnd.rs/zustand/guides/typescript#middleware-that-doesn't-change-the-store-type)
- [项目中的实际应用](../src/store/modules/app.ts)

---

**最后更新**: 2025-11-13
**作者**: React Admin Platform Team


