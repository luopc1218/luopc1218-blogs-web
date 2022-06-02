import { ColumnSpace, LoadingContainer } from '@/components';
import { Divider, Layout } from 'antd';
import styles from './index.less';

export const Sider = () => {
  return (
    <Layout.Sider width={350} className={`${styles.sider}`}>
      <ColumnSpace className="module" split={<Divider />}>
        <div>
          <div className={styles.title}>48小时阅读排行</div>
          <LoadingContainer loading={false} empty></LoadingContainer>
        </div>
        <div>
          <div className={styles.title}>作者排行</div>
          <LoadingContainer loading={false} empty></LoadingContainer>
        </div>
      </ColumnSpace>
    </Layout.Sider>
  );
};

export default Sider;
