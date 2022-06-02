import { ColumnSpace, Iconfont, LoadingContainer } from '@/components';
import { useFetch, useFetchData, usePage, useUrlParams } from '@/hooks';
import type { Article } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Divider, Space } from 'antd';
import { useCallback, useMemo } from 'react';
import { Link } from 'umi';
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
  const [articleFeedback, getArticleFeedbackLoading, getArticleFeedback] =
    useFetchData(apis.getArticleFeedback, {
      id: articleId,
    });
  usePage({
    pagePath: [
      {
        title: articleInfo?.title || '加载中',
        path: `/article?id=${articleId}`,
      },
    ],
  });

  const [toggleArticleLike, toggleArticleLikeLoading] = useFetch(
    apis.toggleArticleLike,
    {},
    () => {
      getArticleFeedback();
    },
    {
      showSuccessMessage: false,
    },
  );

  const handleArticleToogleLike = useCallback(
    (type) => {
      if (type === articleFeedback?.likeStatus) {
        toggleArticleLike({
          id: articleInfo?.id,
          type: 2,
        });
      } else {
        toggleArticleLike({
          id: articleInfo?.id,
          type,
        });
      }
    },
    [articleInfo?.id, articleFeedback?.likeStatus, toggleArticleLike],
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

          <Divider style={{ marginBottom: 0 }} />
          <LoadingContainer
            loading={toggleArticleLikeLoading || getArticleFeedbackLoading}
            className={`${styles.feedback}`}
          >
            <Space>
              <div className={styles.operate}>
                <Iconfont type="icon-collection" />{' '}
                {articleFeedback?.collectCount}
              </div>
              <div
                className={styles.operate}
                title="点赞"
                onClick={() => handleArticleToogleLike(0)}
              >
                <Iconfont
                  type={
                    articleFeedback?.likeStatus === 0
                      ? 'icon-good-fill'
                      : 'icon-good'
                  }
                />
                {articleFeedback?.likeCount}
              </div>
              <div
                className={styles.operate}
                title="点踩"
                onClick={() => handleArticleToogleLike(1)}
              >
                <Iconfont
                  type={
                    articleFeedback?.likeStatus === 1
                      ? 'icon-bad-fill'
                      : 'icon-bad'
                  }
                />
                {articleFeedback?.unlikeCount}
              </div>
            </Space>
          </LoadingContainer>
        </ColumnSpace>

        <ColumnSpace className="module">
          <div>评论</div>
        </ColumnSpace>
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticlePage;
