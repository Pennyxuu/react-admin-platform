/**
 * 认证布局
 * 用于登录、注册等不需要侧边栏的页面
 */

import { Outlet } from 'react-router-dom';
import './index.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

