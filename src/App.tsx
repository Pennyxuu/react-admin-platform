/**
 * 应用根组件
 */

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from './router';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router />
    </ConfigProvider>
  );
}

export default App;
