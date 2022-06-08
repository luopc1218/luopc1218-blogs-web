import { Iconfont, LoadingContainer } from '@/components';
import { useFetch, useFetchData, usePage } from '@/hooks';
import type { Article, ArticleFeedback } from '@/types/article';
import apis from '@/utils/apis';
import { Divider, Space } from 'antd';
import { useCallback, useMemo } from 'react';
import styles from './index.less';

export interface FeedbackProps {
  articleInfo: Article;
}

export const Feedback: React.FC<FeedbackProps> = ({ articleInfo }) => {
  const articleId = useMemo(() => articleInfo.id, [articleInfo]);
  const [articleFeedback, getArticleFeedbackLoading, getArticleFeedback] =
    useFetchData<ArticleFeedback>(apis.getArticleFeedback, {
      articleId,
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
    () => getArticleFeedback(),
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

  const [toggleArticleCollect, toggleArticleCollectLoading] = useFetch(
    apis.toggleArticleCollect,
    {
      articleId: articleId,
    },
    () => getArticleFeedback(),
  );

  const handleToggleArticleCollect = useCallback(() => {
    toggleArticleCollect();
  }, [toggleArticleCollect]);

  return (
    <LoadingContainer
      loading={
        toggleArticleLikeLoading ||
        toggleArticleCollectLoading ||
        getArticleFeedbackLoading
      }
      className={`${styles.feedback}`}
    >
      <Divider style={{ marginBottom: 10 }} />
      <Space>
        <div className={styles.operate} onClick={handleToggleArticleCollect}>
          <Iconfont
            type={
              articleFeedback?.collectStatus
                ? 'icon-collection-fill'
                : 'icon-collection'
            }
          />{' '}
          {articleFeedback?.collectCount}
        </div>
        <div
          className={styles.operate}
          title="点赞"
          onClick={() => handleArticleToogleLike(0)}
        >
          <Iconfont
            type={
              articleFeedback?.likeStatus === 0 ? 'icon-good-fill' : 'icon-good'
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
              articleFeedback?.likeStatus === 1 ? 'icon-bad-fill' : 'icon-bad'
            }
          />
          {articleFeedback?.unlikeCount}
        </div>
      </Space>
    </LoadingContainer>
  );
};

export default Feedback;
