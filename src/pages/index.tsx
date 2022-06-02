import { usePage } from '@/hooks';
import { ArticleList } from './components';
import styles from './index.less';

//主页
export const IndexPage = () => {
  usePage({ pagePath: [] });

  return (
    <div className={`page ${styles.indexPage}`}>
      <ArticleList className="module" />
    </div>
  );
};

export default IndexPage;
