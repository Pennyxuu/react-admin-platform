/**
 * 仪表盘页面
 */

import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@/store';
import './index.css';

const Dashboard: React.FC = () => {
  const { userInfo } = useUserStore();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>欢迎回来，{userInfo?.nickname || userInfo?.username}！</h1>
        <p>这是您的仪表盘概览</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={2345}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={93256}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={11.28}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 更多内容区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="最近活动" bordered={false}>
            <p>这里可以显示最近的活动记录、图表等内容</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="快捷操作" bordered={false}>
            <p>这里可以放置常用的快捷操作按钮</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

