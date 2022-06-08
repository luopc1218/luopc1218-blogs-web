import { ColumnSpace, LoadingContainer } from '@/components';
import { useFetchData, useUrlParams } from '@/hooks';
import type { Article } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Space } from 'antd';
import { useMemo } from 'react';
import { Link } from 'umi';
import { Comments, Feedback } from './components';
import styles from './index.less';

export const ArticlePage: React.FC = () => {
  const [urlParams] = useUrlParams();
  const articleId = useMemo(() => urlParams.id, [urlParams.id]);
  const [articleInfo, getArticleInfoLoading] = useFetchData<Article>(
    apis.getArticleInfo,
    {
      id: articleId,
    },
  );

  return (
    <LoadingContainer
      loading={getArticleInfoLoading}
      empty={!articleInfo}
      className={`page ${styles.articlePage}`}
    >
      <ColumnSpace>
        <ColumnSpace className="module">
          <div className={styles.title}>{articleInfo?.title}</div>
          <div className={styles.description}>{articleInfo?.description}</div>
          <Space className={styles.time}>
            <Link to={`/profile?id=${articleInfo?.authorId}`}>
              {articleInfo?.authorName}
            </Link>
            <span>于{formatTime(articleInfo?.createTime)}创建</span>
            {articleInfo?.editTime && (
              <div>{formatTime(articleInfo?.editTime)}最后修改</div>
            )}
          </Space>
          <div
            dangerouslySetInnerHTML={{
              __html: articleInfo?.content || '加载中',
            }}
          />

          {articleInfo && <Feedback articleInfo={articleInfo} />}
        </ColumnSpace>
        <Comments articleId={articleId} />
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticlePage;
