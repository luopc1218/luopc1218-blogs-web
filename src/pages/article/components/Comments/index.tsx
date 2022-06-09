import {
  ColumnSpace,
  Iconfont,
  LoadingContainer,
  RichTextEditor,
} from '@/components';
import { useFetch, useFetchData } from '@/hooks';
import type { ArticleComment } from '@/types/article';
import type { ListResponse } from '@/types/response';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Avatar, Badge, Button, Card, Divider, Space } from 'antd';
import 'quill/dist/quill.snow.css';
import { useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { Link, useSelector } from 'umi';

import styles from './index.less';

export interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const [inputingComment, setInputingComment] = useState<string>('');
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );
  const [
    articleCommentList,
    getArticleCommentListLoading,
    getArticleCommentList,
  ] = useFetchData<ListResponse<ArticleComment>>(
    apis.getArticleCommentList,
    {
      articleId,
    },
    {
      list: [],
      totalCount: 0,
    },
  );

  const [submitComment, submitCommentLoading] = useFetch(
    apis.addArticleComment,
    {},
    () => {
      setInputingComment('');
      getArticleCommentList();
    },
  );

  const handleSubmitComment = () => {
    submitComment({
      articleId,
      content: inputingComment,
    });
  };

  const [toggleArticleCommentLike] = useFetch(
    apis.toggleArticleCommentLike,
    {},
    () => {
      getArticleCommentList();
    },
  );

  const handleToogleArticleCommentLike = (commentId: number) => {
    toggleArticleCommentLike({
      commentId,
    });
  };

  return (
    <ColumnSpace className={`${styles.comments} module`}>
      <div>评论</div>
      {userModelState.userInfo && (
        <ColumnSpace align="center">
          <RichTextEditor
            placeholder="请输入评论"
            value={inputingComment}
            onChange={setInputingComment}
          />
          <Button
            disabled={!inputingComment}
            type="primary"
            onClick={handleSubmitComment}
            size="large"
            shape="round"
            loading={submitCommentLoading}
          >
            发送
          </Button>
        </ColumnSpace>
      )}

      {/* <Divider /> */}
      <LoadingContainer
        loading={getArticleCommentListLoading}
        empty={articleCommentList?.list.length === 0}
      >
        <ColumnSpace>
          {articleCommentList?.list.map((item) => (
            <Card hoverable key={item.id} style={{ cursor: 'auto' }}>
              <ColumnSpace className={styles.commentItem}>
                <div className={styles.header}>
                  <Space>
                    <Avatar src={item.fromAvatarUrl} />
                    <Link to={`/profile?userId=${item.from}`}>
                      {item.fromName}
                    </Link>
                  </Space>
                  <Space
                    align="center"
                    split={<Divider type="vertical" style={{ margin: 0 }} />}
                  >
                    <Badge
                      count={item.replyCount}
                      className={styles.ctrl}
                      size="small"
                      title="回复"
                    >
                      <Iconfont title="回复" type="icon-phone" />
                    </Badge>
                    <Badge
                      count={item.likeCount}
                      className={styles.ctrl}
                      size="small"
                      title="点赞"
                    >
                      <Iconfont
                        title="点赞"
                        type={item.likeStatus ? 'icon-good-fill' : 'icon-good'}
                        onClick={() => {
                          handleToogleArticleCommentLike(item.id);
                        }}
                      />
                    </Badge>
                  </Space>
                </div>
                <div
                  className={`ql-editor ${styles.content}`}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <div className={styles.time}>{formatTime(item.time)}</div>
              </ColumnSpace>
            </Card>
          ))}
        </ColumnSpace>
      </LoadingContainer>
    </ColumnSpace>
  );
};

export default Comments;
