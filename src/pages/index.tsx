import { usePage, useUrlParams } from '@/hooks';
import { ArticleList } from './components';
import styles from './index.less';

//主页
export const IndexPage = () => {
  usePage({ pagePath: [] });

  const [urlParams] = useUrlParams();

  return (
    <div className={`page ${styles.indexPage}`}>
      <ArticleList timestamp={urlParams.timestamp} />
    </div>
  );
};

export default IndexPage;
