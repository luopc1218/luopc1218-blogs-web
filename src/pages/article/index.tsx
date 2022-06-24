import { ColumnSpace, LoadingContainer } from '@/components';
import { useFetchData, useUrlParams } from '@/hooks';
import type { Article } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Avatar, Space, Tag } from 'antd';
import { useMemo } from 'react';
import type { GlobalModelState, ModelMap, UserModelState } from 'umi';
import { Link, useSelector } from 'umi';
import { Comments, Feedback } from './components';
import styles from './index.less';

export const ArticlePage: React.FC = () => {
  const [urlParams] = useUrlParams();
  const articleId = useMemo(() => urlParams.id, [urlParams.id]);
  const [articleInfo, getArticleInfoLoading] = useFetchData<Article>(
    apis.getArticleInfo,
    {
      params: { id: articleId },
    },
  );
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );
  // 作者模式
  const authorMode = useMemo(
    () => articleInfo?.authorId === userModelState.userInfo?.id,
    [articleInfo?.authorId, userModelState.userInfo?.id],
  );

  const globalModelState: GlobalModelState = useSelector(
    (state: ModelMap) => state.global,
  );

  return (
    <LoadingContainer
      loading={getArticleInfoLoading}
      empty={!articleInfo}
      className={`page ${styles.articlePage}`}
    >
      <ColumnSpace>
        <ColumnSpace className="module">
          <Space align="center">
            <div className={styles.title}>{articleInfo?.title}</div>
            <div>
              {articleInfo?.tags.map((item: any) => (
                <Tag color={globalModelState.theme} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </div>
          </Space>

          <div className={styles.description}>{articleInfo?.description}</div>
          <Space>
            <Avatar src={articleInfo?.authorAvatarUrl} />
            <Link to={`/profile?userId=${articleInfo?.authorId}`}>
              {articleInfo?.authorName}
            </Link>
          </Space>
          <Space className={styles.time}>
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
