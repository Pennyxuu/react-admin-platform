/**
 * 本地存储工具
 * 封装 localStorage 和 sessionStorage，支持 JSON 序列化
 * 
 * 什么是 JSON 序列化？
 * - 序列化：将 JavaScript 对象转换为 JSON 字符串的过程（JSON.stringify）
 * - 反序列化：将 JSON 字符串转换回 JavaScript 对象的过程（JSON.parse）
 * 
 * 为什么需要序列化？
 * - localStorage/sessionStorage 只能存储字符串
 * - 通过序列化，我们可以存储对象、数组等复杂数据类型
 * 
 * 示例：
 * const user = { name: '张三', age: 25 };
 * JSON.stringify(user)  // 序列化 → '{"name":"张三","age":25}'
 * JSON.parse('{"name":"张三","age":25}')  // 反序列化 → { name: '张三', age: 25 }
 */

/**
 * 存储类型
 */
type StorageType = 'local' | 'session';

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

/**
 * 获取存储对象
 */
/**
 * 获取存储对象
 * 
 * 🔍 语法解析：
 * 
 * 1️⃣ 函数签名：const getStorage = (type: StorageType = 'local'): Storage => {...}
 *    - const getStorage：声明一个常量函数
 *    - (type: StorageType = 'local')：参数列表
 *      · type：参数名
 *      · StorageType：参数类型（'local' | 'session'）
 *      · = 'local'：默认值，如果不传参数，默认使用 'local'
 *    - : Storage：返回值类型，Storage 是浏览器内置的接口类型
 *    - => {...}：箭头函数语法
 * 
 * 2️⃣ 三元运算符：type === 'local' ? localStorage : sessionStorage
 *    - 条件：type === 'local'
 *    - 为真：返回 localStorage
 *    - 为假：返回 sessionStorage
 * 
 * 💡 使用示例：
 * getStorage()          // 返回 localStorage（使用默认值）
 * getStorage('local')   // 返回 localStorage
 * getStorage('session') // 返回 sessionStorage
 */
const getStorage = (type: StorageType = 'local'): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

/**
 * 存储工具类
 */

class StorageUtil {
  private type: StorageType;

  constructor(type: StorageType = 'local') {
    this.type = type;
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值（会自动 JSON 序列化）
   */
  set<T = any>(key: string, value: T): void {
    try {
      const storage = getStorage(this.type);
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`存储失败 [${key}]:`, error);
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 解析后的值
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const storage = getStorage(this.type);
      const item = storage.getItem(key);
      
      if (item === null) {
        return defaultValue ?? null;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`读取失败 [${key}]:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   */
  remove(key: string): void {
    try {
      const storage = getStorage(this.type);
      storage.removeItem(key);
    } catch (error) {
      console.error(`移除失败 [${key}]:`, error);
    }
  }

  /**
   * 清空所有存储
   */
  clear(): void {
    try {
      const storage = getStorage(this.type);
      storage.clear();
    } catch (error) {
      console.error('清空存储失败:', error);
    }
  }

  /**
   * 检查键是否存在
   * @param key 键名
   */
  has(key: string): boolean {
    const storage = getStorage(this.type);
    return storage.getItem(key) !== null;
  }

  /**
   * 获取所有键名
   */
  keys(): string[] {
    const storage = getStorage(this.type);
    return Object.keys(storage);
  }
}

/**
 * localStorage 实例
 */
/**
 * 导出 localStorage 实例
 * 
 * 💡 为什么这样导出？
 * 
 * 1️⃣ 具名导出 (Named Export)：
 *    export const storage = new StorageUtil('local');
 *    - 使用方式：import { storage } from '@/utils/storage';
 *    - 优点：明确知道导入的是什么，支持按需导入
 * 
 * 2️⃣ 默认导出 (Default Export)：
 *    export default storage;
 *    - 使用方式：import storage from '@/utils/storage';
 *    - 优点：导入时可以自定义名称，更简洁
 * 
 * 3️⃣ 为什么同时提供两种导出？
 *    - 灵活性：开发者可以根据习惯选择导入方式
 *    - 兼容性：支持不同的代码风格
 *    - 示例：
 *      import storage from '@/utils/storage';           // 默认导出
 *      import { storage, sessionStorage } from '@/utils/storage'; // 具名导出
 * 
 * 4️⃣ sessionStorage 为什么只有具名导出？
 *    - 一个模块只能有一个默认导出
 *    - storage 作为主要实例，使用默认导出
 *    - sessionStorage 作为辅助实例，使用具名导出
 */
export const storage = new StorageUtil('local');

/**
 * sessionStorage 实例
 */
export const sessionStorage = new StorageUtil('session');

export default storage;

