import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteMockServe } from 'vite-plugin-mock';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Mock 服务配置
    viteMockServe({
      mockPath: 'mock', // mock 文件夹路径
      enable: true, // 启用 mock
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // 注释掉代理配置，使用 Mock 数据
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5320/api',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     ws: true,
    //   },
    // },
  },
});
