import { Breadcrumb as AntdBreadcrumb } from 'antd';
import type { GlobalModelState, ModelMap } from 'umi';
import { Link, useSelector } from 'umi';
import styles from './index.less';

export const Breadcrumb = () => {
  const globalModelState: GlobalModelState = useSelector(
    (state: ModelMap) => state.global,
  );
  return (
    <div className={styles.breadcrumb}>
      <AntdBreadcrumb>
        <AntdBreadcrumb.Item>
          <Link to="/">主页</Link>
        </AntdBreadcrumb.Item>
        {globalModelState.titlePath.map((path) => {
          return (
            <AntdBreadcrumb.Item key={path.path}>
              <Link to={path.path}>{path.title}</Link>
            </AntdBreadcrumb.Item>
          );
        })}
      </AntdBreadcrumb>
    </div>
  );
};

export default Breadcrumb;
