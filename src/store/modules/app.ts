/**
 * 应用配置状态管理
 * 管理主题、语言、侧边栏等应用级配置
 */

import { create } from 'zustand';
/**
 * persist 是 Zustand 提供的中间件，用于持久化状态
 * 作用：将 store 中的状态自动保存到 localStorage/sessionStorage
 * 好处：刷新页面后状态不会丢失
 * 
 * 使用方式：
 * 1. 包裹 create 函数
 * 2. 配置 name（localStorage 的 key）
 * 3. 配置 partialize（选择需要持久化的字段）
 */
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/api/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import Sider from 'antd/es/layout/Sider';

/**
 * 主题类型
 */
export type ThemeMode = 'light' | 'dark';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 应用配置状态接口
 */
/**
 * AppState 是应用配置状态的 TypeScript 接口定义
 * 
 * 为什么需要这个接口？
 * 1. 类型安全：TypeScript 可以在编译时检查类型错误，避免运行时错误
 * 2. 代码提示：IDE 可以提供智能提示，提高开发效率
 * 3. 代码可读性：清晰地定义了状态的结构和可用的操作
 * 4. 维护性：修改状态结构时，TypeScript 会提示所有需要修改的地方
 * 
 * 为什么需要这些参数？
 * 
 * 【状态字段】- 存储应用的配置数据
 * - theme: 主题模式（亮色/暗色），用于切换界面主题
 * - language: 语言设置（中文/英文），用于国际化
 * - sidebarCollapsed: 侧边栏折叠状态，控制侧边栏展开/收起
 * - menus: 菜单数据，存储用户可访问的菜单列表
 * 
 * 【Action 方法】- 修改状态的函数
 * - setTheme: 设置主题，同时更新 localStorage 和 DOM
 * - toggleTheme: 切换主题（亮色 ↔ 暗色）
 * - setLanguage: 设置语言，同时更新 localStorage
 * - setSidebarCollapsed: 设置侧边栏状态
 * - toggleSidebar: 切换侧边栏状态（展开 ↔ 收起）
 * - setMenus: 设置菜单数据（通常从后端获取）
 * 
 * 使用示例：
 * const { theme, setTheme, toggleTheme } = useAppStore();
 * setTheme('dark'); // 设置为暗色主题
 * toggleTheme();    // 切换主题
 */

interface AppState {
  // 状态
  theme:ThemeMode;
  language:Language;
  sidebarCollapsed:boolean;
  menus:MenuItem[];

  // Actions
  /**
   * Actions（动作方法）
   * 
   * 为什么叫 Action？
   * 1. 来源于 Flux/Redux 架构模式，Action 表示"改变状态的动作"
   * 2. 区别于普通方法：Action 专门用于修改 Store 中的状态
   * 3. 命名规范：通常以 set/toggle/update/delete 等动词开头
   * 4. 单一职责：每个 Action 只负责一个具体的状态变更操作
   * 
   * 在状态管理中的角色：
   * - State（状态）：存储数据（theme, language 等）
   * - Action（动作）：修改数据的方法（setTheme, toggleTheme 等）
   * - 这种分离使得状态变更可追踪、可预测
   */
  setTheme:(theme:ThemeMode)=>void;
  toggleTheme:()=>void;
  setLanguage:(language:Language)=>void;
  setSidebarCollapsed:(collapsed:boolean)=>void;
  toggleSidebar:()=>void;
  setMenus:(menus:MenuItem[])=>void;
}

/**
 * 应用配置 Store
 */

/**
 * 这段代码创建了一个 Zustand Store，用于管理应用的全局配置状态
 * 
 * 🔍 语法解析：
 * 
 * 1️⃣ create<AppState>()() - 双括号语法
 *    - 第一个 () 是泛型参数，指定 Store 的类型为 AppState
 *    - 第二个 () 是函数调用，原因如下：
 *      · persist 中间件本身是一个高阶函数（返回函数的函数）
 *      · persist(...) 执行后返回一个新的函数
 *      · 这个返回的函数需要再次调用，才能真正创建 Store
 *    - 这是 TypeScript 的柯里化（Currying）写法
 *      · 柯里化：将多参数函数转换为一系列单参数函数
 *      · 好处：可以逐步传入参数，实现函数组合和复用
 *      · 示例：f(a, b) 变成 f(a)(b)
 *    
 *    💡 执行流程：
 *    create<AppState>()  →  返回一个接受中间件的函数
 *                       ↓
 *    persist(...)        →  返回一个增强后的状态创建函数
 *                       ↓
 *    最终调用 ()         →  创建并返回 Store
 * 
 *    🤔 为什么要用柯里化（双括号）写法？
 *    
 *    ❌ 错误理解：以为返回函数后没有执行
 *    ✅ 正确理解：返回的函数立即被第二个 () 执行了！
 *    
 *    📝 完整执行过程（一步步拆解）：
 *    
 *    // 步骤1：create<AppState>() 返回一个函数（我们叫它 createWithMiddleware）
 *    const createWithMiddleware = create<AppState>();
 *    
 *    // 步骤2：persist(...) 返回一个增强后的状态创建函数（我们叫它 enhancedStateCreator）
 *    //        "增强"是指：原本只有 theme、setTheme 等基础功能
 *    //        经过 persist 中间件包装后，额外获得了"持久化"能力
 *    //        就像给普通汽车加装了自动驾驶系统，功能更强大了
 *    const enhancedStateCreator = persist(
 *      (set, get) => ({ theme: 'light', ... }),
 *      { name: 'app-storage' }
 *    );
 *    
 *    // 步骤3：调用 createWithMiddleware(enhancedStateCreator) 创建最终的 Store
 *    const store = createWithMiddleware(enhancedStateCreator);
 *    
 *    // 上面三步合并成一行，就是：
 *    const store = create<AppState>()(persist(...));
 *    //                            ↑↑
 *    //                            第二个括号在这里执行！
 *    
 *    💡 为什么不直接写成 create<AppState>(persist(...)) ？
 *    
 *    因为 TypeScript 的类型推导限制：
 *    - create<AppState>(persist(...))  ❌ 类型推导会出错
 *    - create<AppState>()(persist(...)) ✅ 类型推导正确
 *    
 *    🤔 为什么需要中间件？为什么要这样设计？
 *    
 *    【问题1：为什么需要中间件？】
 *    
 *    想象一下，如果没有 persist 中间件，我们需要手动处理持久化：
 *    
 *    ❌ 没有中间件的痛苦写法：
 *    ```typescript
 *    const useAppStore = create<AppState>((set, get) => ({
 *      theme: localStorage.getItem('theme') || 'light', // 手动读取
 *      setTheme: (theme) => {
 *        set({ theme });
 *        localStorage.setItem('theme', theme); // 手动保存
 *      },
 *      language: localStorage.getItem('language') || 'zh-CN', // 手动读取
 *      setLanguage: (language) => {
 *        set({ language });
 *        localStorage.setItem('language', language); // 手动保存
 *      },
 *      // ... 每个字段都要重复这样的代码！
 *    }));
 *    ```
 *    
 *    问题：
 *    - 每个 action 都要手动写 localStorage.setItem()，重复代码多
 *    - 初始化时要手动读取 localStorage，容易遗漏
 *    - 数据序列化/反序列化要自己处理（JSON.stringify/parse）
 *    - 错误处理要自己写（localStorage 可能失败）
 *    
 *    ✅ 使用 persist 中间件的优雅写法：
 *    ```typescript
 *    const useAppStore = create<AppState>()(
 *      persist(
 *        (set, get) => ({
 *          theme: 'light',  // 只写默认值，中间件自动处理读取
 *          setTheme: (theme) => set({ theme }), // 只写业务逻辑，中间件自动保存
 *          language: 'zh-CN',
 *          setLanguage: (language) => set({ language }),
 *        }),
 *        { name: 'app-storage' } // 一行配置，搞定所有持久化
 *      )
 *    );
 *    ```
 *    
 *    好处：
 *    - 代码简洁：不需要手动写 localStorage 操作
 *    - 自动化：中间件自动处理读取、保存、序列化
 *    - 可配置：通过 partialize 选择需要持久化的字段
 *    - 健壮性：中间件内置错误处理和边界情况处理
 *    
 *    【问题2：为什么要这样设计（双括号语法）？】
 *    
 *    这是 TypeScript 类型系统的限制，不是 Zustand 故意为难你！
 *    
 *    🔍 技术原因（深入理解）：
 *    
 *    TypeScript 的泛型推导有个限制：
 *    - 当函数既有泛型参数，又有高阶函数参数时
 *    - TypeScript 无法同时推导两者的类型
 *    
 *    ❌ 如果写成 create<AppState>(persist(...))：
 *    ```typescript
 *    // TypeScript 会困惑：
 *    // 1. AppState 是你手动指定的类型
 *    // 2. persist(...) 返回的函数也有自己的类型
 *    // 3. 这两个类型怎么合并？TypeScript 不知道！
 *    // 结果：类型推导失败，报错 ❌
 *    ```
 *    
 *    ✅ 写成 create<AppState>()(persist(...))：
 *    ```typescript
 *    // 第一步：create<AppState>()
 *    // → 返回一个已经知道类型的函数（类型已固定为 AppState）
 *    
 *    // 第二步：(persist(...))
 *    // → 把中间件传给这个函数
 *    // → 因为类型已经固定，TypeScript 可以正确推导
 *    // 结果：类型推导成功 ✅
 *    ```
 *    
 *    🎯 简单理解：
 *    - 第一个 () → 告诉 TypeScript："我要创建一个 AppState 类型的 Store"
 *    - 第二个 () → 告诉 Zustand："用这个中间件来增强 Store"
 *    - 分两步走，TypeScript 才能正确理解你的意图
 *    
 *    💡 类比：
 *    想象你在定制一辆汽车：
 *    1. create<AppState>()     → 选择车型（轿车/SUV/跑车）
 *    2. persist(...)           → 选择配置（天窗/真皮座椅/自动驾驶）
 *    
 *    如果同时说"我要 SUV 带自动驾驶"，销售可能听不清楚。
 *    分两步说"先给我 SUV"→"再加自动驾驶"，就很清楚了。
 *    
 *    这是 Zustand 为了支持中间件而设计的特殊语法，
 *    第一个 () 用于传递泛型类型，第二个 () 用于传递中间件。
 *    
 *    🎯 类比理解：
 *    想象你去餐厅点餐：
 *    1. create<AppState>()     → 告诉服务员你要什么类型的餐（泛型）
 *    2. persist(...)           → 告诉厨师怎么做这道菜（中间件配置）
 *    3. 最后的 ()              → 厨师开始做菜，最终端上桌（执行并返回 Store）
 *    
 *    所以这里的函数确实执行了，而且是立即执行的！
 * 
 * 2️⃣ persist(...) - 持久化中间件
 *    - 第一个参数：状态创建函数 (set, get) => ({...})
 *    - 第二个参数：配置对象 { name, partialize }
 * 
 * 3️⃣ (set, get) => ({...}) - 状态创建函数
 *    - set: 用于更新状态，例如 set({ theme: 'dark' })
 *    - get: 用于获取当前状态，例如 get().theme
 *    - 返回一个对象，包含状态字段和 action 方法
 * 
 * 4️⃣ 配置对象说明：
 *    - name: 'app-storage' 
 *      → localStorage 中的键名，数据会保存为 localStorage['app-storage']
 *    - partialize: (state) => ({...})
 *      → 选择需要持久化的字段，这里只持久化 theme、language、sidebarCollapsed
 *      → menus 不持久化，因为菜单数据应该从后端获取
 * 
 * 💡 工作流程：
 * 1. 用户调用 setTheme('dark')
 * 2. set({ theme: 'dark' }) 更新 Zustand 状态
 * 3. storage.set() 同步更新 localStorage
 * 4. persist 中间件自动将选中的字段持久化
 * 5. 页面刷新后，persist 自动从 localStorage 恢复状态
 * 
 * 📌 使用示例：
 * const { theme, setTheme, toggleTheme } = useAppStore();
 * setTheme('dark');  // 设置主题
 * toggleTheme();     // 切换主题
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      theme: 'light',
      language: 'zh-CN',
      sidebarCollapsed: false,
      menus: [],

      /**
       * 设置主题
       * 
       * 执行流程：
       * 1. set({ theme }) - 更新 Zustand 状态
       * 2. storage.set() - 手动保存到 localStorage（双重保险）
       * 3. 更新 DOM - 添加/移除 dark class，触发 CSS 样式变化
       */
      setTheme: (theme) => {
        set({ theme });
        storage.set(STORAGE_KEYS.THEME, theme);
        
        // 更新 HTML 根元素的 class
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      /**
       * 切换主题
       * 
       * 原理：获取当前主题 → 计算新主题 → 调用 setTheme
       */
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      /**
       * 设置语言
       */
      setLanguage: (language) => {
        set({ language });
        storage.set(STORAGE_KEYS.LANGUAGE, language);
      },

      /**
       * 设置侧边栏折叠状态
       */
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
        storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
      },

      /**
       * 切换侧边栏折叠状态
       */
      toggleSidebar: () => {
        const collapsed = !get().sidebarCollapsed;
        get().setSidebarCollapsed(collapsed);
      },

      /**
       * 设置菜单数据
       * 
       * 注意：menus 不持久化，每次登录后从后端获取最新数据
       */
      setMenus: (menus) => {
        set({ menus });
      },
    }),
    {
      name: 'app-storage', // localStorage 中的 key
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        // menus 不持久化，因为菜单数据应该从后端实时获取
      }),
    }
  )
);

export default useAppStore;

