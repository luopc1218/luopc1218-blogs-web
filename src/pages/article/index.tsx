import { ColumnSpace, LoadingContainer } from '@/components';
import { useFetch, usePage, useUrlParams } from '@/hooks';
import type { Article } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Button, Divider, Space } from 'antd';
import { useMemo } from 'react';
import { Link } from 'umi';
import styles from './index.less';

export const ArticlePage: React.FC = () => {
  const [urlParams] = useUrlParams();
  const articleId = useMemo(() => urlParams.id, [urlParams.id]);
  const [articleInfo, getArticleInfoLoading] = useFetch<Article>(
    apis.getArticleInfo,
    {
      id: articleId,
    },
  );
  usePage({
    pagePath: [
      {
        title: articleInfo?.title || '加载中',
        path: `/article?id=${articleId}`,
      },
    ],
  });
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
            <div>
              <Link to={`/profile?id=${articleInfo?.authorId}`}>
                {articleInfo?.authorName}
              </Link>
              于{formatTime(articleInfo?.createTime)}创建
            </div>
            {articleInfo?.editTime && (
              <div>{formatTime(articleInfo?.editTime)}最后修改</div>
            )}
          </Space>
          <Divider />
          <div
            dangerouslySetInnerHTML={{
              __html: articleInfo?.content || '加载中',
            }}
          />
          <Divider />
          <div className={styles.feedback}>
            <Space>
              <Button type="link">收藏 {articleInfo?.collectCount}</Button>
              <Button type="link">点赞 {articleInfo?.likeCount}</Button>
              <Button type="link">点踩 {articleInfo?.unLikeCount}</Button>
            </Space>
          </div>
        </ColumnSpace>
        <ColumnSpace className="module">
          <div>评论</div>
        </ColumnSpace>
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticlePage;
