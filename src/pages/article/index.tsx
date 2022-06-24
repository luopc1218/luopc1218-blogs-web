import { ColumnSpace, LoadingContainer } from '@/components';
import { useFetch, useFetchData, useUrlParams } from '@/hooks';
import type { Article } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Avatar, Button, Modal, Space, Tag } from 'antd';
import { useMemo } from 'react';
import {
  GlobalModelState,
  Link,
  ModelMap,
  history,
  UserModelState,
  useSelector,
} from 'umi';
import { Comments, Feedback } from './components';
import styles from './index.less';

export const ArticlePage: React.FC = () => {
  ;
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

  const [deleteArticle, deleteArticleLoading] = useFetch(apis.deleteArticle);

  const handleDeleteArticle = () => {
    Modal.confirm({
      type: 'warning',
      content: '确定要除这个文章吗？',
      onOk() {
        deleteArticle({
          articleId: articleInfo?.id,
        }).then((res) => {
          if (res) {
            history.replace('/');
          }
        });
      },
    });
  };

  return (
    <LoadingContainer
      loading={getArticleInfoLoading || deleteArticleLoading}
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
            {authorMode && (
              <Space>
                <Link to={'/article/edit?articleId=' + articleInfo?.id}>
                  编辑
                </Link>
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={handleDeleteArticle}
                >
                  删除
                </Button>
              </Space>
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
