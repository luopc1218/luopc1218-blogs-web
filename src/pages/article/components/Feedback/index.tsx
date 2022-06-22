import { Iconfont, LoadingContainer } from '@/components';
import { useFetch, useFetchData, usePage } from '@/hooks';
import type { Article, ArticleFeedback } from '@/types/article';
import apis from '@/utils/apis';
import { Divider, Space } from 'antd';
import { useMemo } from 'react';
import styles from './index.less';

export interface FeedbackProps {
  articleInfo: Article;
}

export const Feedback: React.FC<FeedbackProps> = ({ articleInfo }) => {
  const articleId = useMemo(() => articleInfo.id, [articleInfo]);
  const [articleFeedback, getArticleFeedbackLoading, getArticleFeedback] =
    useFetchData<ArticleFeedback>(apis.getArticleFeedback, {
      params: { articleId },
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
    {
      callback: (res) => {
        if (res) {
          getArticleFeedback({
            articleId,
          });
        }
      },
    },
  );

  const handleArticleToogleLike = (type: number | undefined) => {
    if (type === articleFeedback?.likeStatus) {
      toggleArticleLike({
        articleId: articleInfo?.id,
        type: 2,
      });
    } else {
      toggleArticleLike({
        articleId: articleInfo?.id,
        type,
      });
    }
  };
  const [toggleArticleCollect, toggleArticleCollectLoading] = useFetch(
    apis.toggleArticleCollect,
  );

  const handleToggleArticleCollect = () => {
    toggleArticleCollect({
      articleId,
    }).then((res) => {
      if (res) {
        getArticleFeedback({
          articleId,
        });
      }
    });
  };

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
        <Space className={`${styles.operate}`} title="访问量">
          <Iconfont type="icon-browse" />
          <div>{articleInfo?.viewCount}</div>
        </Space>
        <div
          className={`clickable ${styles.operate}`}
          onClick={handleToggleArticleCollect}
          title="收藏"
        >
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
          className={`clickable ${styles.operate}`}
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
          className={`clickable ${styles.operate}`}
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
