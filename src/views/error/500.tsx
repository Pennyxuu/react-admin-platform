/**
 * 500 页面
 */

import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '100px 0', textAlign: 'center' }}>
      <Result
        status="500"
        title="500"
        subTitle="抱歉，服务器出错了"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default ServerError;

