import { usePage } from '@/hooks';
import { Button, Result } from 'antd';
import { Link } from 'umi';

export const NotFoundPage = () => {
  usePage({
    pagePath: [
      {
        title: '页面不存在',
        path: '/404',
      },
    ],
  });
  return (
    <div className="page module">
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
        extra={
          <Link to={'/'}>
            <Button type="primary">返回主页</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFoundPage;
