import { Space, Button, Tooltip } from 'antd';
import { Link } from 'umi';
import styles from './index.less';
import { Iconfont } from '@/components';

interface FixedMenuItem {
  title: string;
  path: string;
  icon: string;
}

export const FixedMenu = () => {
  const fixedMenuList: FixedMenuItem[] = [
    {
      title: '主页',
      icon: 'icon-home',
      path: '/',
    },
    {
      title: '词库管理',
      icon: 'icon-cangku',
      path: '/lexicons',
    },
    {
      title: '练习',
      icon: 'icon-editor1',
      path: '/practice',
    },
  ];

  return (
    <Space direction="vertical" className={styles.fixedMenu}>
      {fixedMenuList.map((item) => (
        <Link to={item.path} key={item.path}>
          <Tooltip placement="left" title={item.title}>
            <Button size="large" shape="circle">
              <Iconfont type={item.icon} />
            </Button>
          </Tooltip>
        </Link>
      ))}
    </Space>
  );
};

export default FixedMenu;
