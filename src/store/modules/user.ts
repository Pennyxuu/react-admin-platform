/**
 * 用户状态管理
 * 管理用户登录状态、用户信息等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/api/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

/**
 * 用户状态接口
 */
interface UserState {
  // 状态
  token: string | null;
  userInfo: UserInfo | null;
  
  // Actions
  setToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

/**
 * 用户状态 Store
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      token: null,
      userInfo: null,

      /**
       * 设置 token
       */
      setToken: (token) => {
        set({ token });
        if (token) {
          storage.set(STORAGE_KEYS.TOKEN, token);
        } else {
          storage.remove(STORAGE_KEYS.TOKEN);
        }
      },

      /**
       * 设置用户信息
       */
      setUserInfo: (userInfo) => {
        set({ userInfo });
        if (userInfo) {
          storage.set(STORAGE_KEYS.USER_INFO, userInfo);
        } else {
          storage.remove(STORAGE_KEYS.USER_INFO);
        }
      },

      /**
       * 登出
       * 清除所有用户相关数据
       */
      logout: () => {
        set({ token: null, userInfo: null });
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.USER_INFO);
      },

      /**
       * 检查是否已登录
       */
      isLoggedIn: () => {
        return !!get().token;
      },
    }),
    {
      name: 'user-storage', // localStorage 中的 key
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
);

export default useUserStore;

