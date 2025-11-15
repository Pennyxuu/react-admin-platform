/**
 * 403 页面
 */

import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '100px 0', textAlign: 'center' }}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default Forbidden;

