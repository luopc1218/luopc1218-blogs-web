import { ColumnSpace, Iconfont, LoadingContainer } from '@/components';
import { useFetchData, usePagination } from '@/hooks';
import type { ListResponse } from '@/types/response';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Card, Space } from 'antd';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { Link } from 'umi';
import styles from './index.less';

export interface ArticleListProps {
  words?: string;
  style?: CSSProperties;
  className?: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  words,
  style,
  className,
}) => {
  const [pagination] = usePagination();
  const queryParams = useMemo(
    () => ({ ...pagination, words }),
    [pagination, words],
  );
  const [articles, getArticlesLoading] = useFetchData<ListResponse>(
    apis.getArticleList,
    queryParams,
  );

  return (
    <LoadingContainer
      loading={getArticlesLoading}
      empty={!articles?.totalCount}
      className={`${className} ${styles.articleList}`}
      style={style}
    >
      <ColumnSpace>
        {articles?.list.map((item) => (
          <div key={item.id}>
            <Card className={styles.articleItem}>
              <ColumnSpace>
                <Link to={`/article?id=${item.id}`} className={styles.title}>
                  {item.title}
                </Link>
                <div className={styles.description}>{item.description}</div>
                <Space>
                  <Link
                    to={`/profile?userId=${item.authorId}`}
                    className={styles.authorId}
                  >
                    {item.authorName}
                  </Link>
                  <div className={styles.likeCount}>
                    <Iconfont type="icon-good" />
                    {item.likeCount}
                  </div>
                  <div className={styles.unlikeCount}>
                    <Iconfont type="icon-bad" />
                    {item.unlikeCount}
                  </div>
                  <div className={styles.createTime}>
                    {formatTime(item.finalTime)}
                  </div>
                </Space>
              </ColumnSpace>
            </Card>
          </div>
        ))}
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticleList;
