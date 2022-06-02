import { ColumnSpace, Iconfont, LoadingContainer } from '@/components';
import { useFetch, usePagination } from '@/hooks';
import { Article } from '@/types/article';
import type { ListResponse } from '@/types/response';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Card, Divider, Space } from 'antd';
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
  const [articles, getArticlesLoading] = useFetch<ListResponse<Article>>(
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
      <ColumnSpace split={<Divider />}>
        {articles?.list.map((item) => (
          <Link key={item.id} to={`/article?id=${item.id}`}>
            <Card className={styles.articleItem} hoverable>
              <ColumnSpace>
                <div className={styles.title}>{item.title}</div>
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
                  <div className={styles.unLikeCount}>
                    <Iconfont type="icon-bad" />
                    {item.unLikeCount}
                  </div>
                  <div className={styles.createTime}>
                    {formatTime(item.createTime)}
                  </div>
                </Space>
              </ColumnSpace>
            </Card>
          </Link>
        ))}
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticleList;
