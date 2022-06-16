import {
  ColumnSpace,
  Iconfont,
  LoadingContainer,
  RichTextViewer,
} from '@/components';
import { useFetch, useFetchData } from '@/hooks';
import type { ArticleComment } from '@/types/article';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Avatar, Card, Divider, Space } from 'antd';
import { useCallback, useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { Link, useSelector } from 'umi';
import ReplyDrawerInputer from './ArticleCommentReplyDrawerInputer';
import styles from './index.less';

export interface ArticleCommentItemProps {
  commentInfo: ArticleComment;
  onDelete: (commentId: number) => void;
  onToggleCommentLike: (commentId: number) => void;
  onReply: (commentId: number) => void;
}

export const ArticleCommentItem: React.FC<ArticleCommentItemProps> = ({
  commentInfo,
  onDelete,
  onToggleCommentLike,
  onReply,
}) => {
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  const [showReply, setShowReply] = useState(false);

  const [commentReplyList, getCommentReplyListLoading, getCommentReplyList] =
    useFetchData(
      showReply && apis.getArticleCommentReplyList,
      {
        commentId: commentInfo.id,
      },
      [],
    );

  const [replyingComment, setReplyingComment] = useState<
    { id: number; to?: number | undefined; toName: string } | undefined
  >(undefined);

  const [sendCommentReply, sendCommentReplyLoading] = useFetch(
    apis.addArticleCommentReply,
  );

  const handleSendCommentReply = useCallback(
    async (content: string) => {
      await sendCommentReply({
        commentId: replyingComment?.id,
        to: replyingComment?.to || null,
        content,
      });
      setReplyingComment(undefined);

      if (!showReply) {
        setShowReply(true);
      } else {
        getCommentReplyList({
          commentId: commentInfo.id,
        });
      }
      onReply(commentInfo.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentInfo.id, replyingComment?.id, showReply],
  );

  return (
    <Card hoverable key={commentInfo.id} style={{ cursor: 'auto' }}>
      <ColumnSpace className={styles.commentItem}>
        <div className={styles.header}>
          <Space>
            <Avatar src={commentInfo.fromAvatarUrl} />
            <Link to={`/profile?userId=${commentInfo.from}`}>
              {commentInfo.fromName}
            </Link>
          </Space>
          <Space
            align="center"
            split={<Divider type="vertical" style={{ margin: 0 }} />}
          >
            {userModelState.userInfo && (
              <Space
                className={`clickable ${styles.ctrl}`}
                onClick={() => {
                  if (commentInfo.replyCount > 0) {
                    setShowReply(!showReply);
                  }
                }}
              >
                <Iconfont
                  title="回复"
                  type={showReply ? 'icon-comments-fill' : 'icon-comments'}
                />
                <div>
                  {commentInfo.replyCount >= 999
                    ? '999+'
                    : commentInfo.replyCount}
                </div>
              </Space>
            )}
            <Space
              className={`clickable ${styles.ctrl}`}
              onClick={() => {
                onToggleCommentLike(commentInfo.id);
              }}
            >
              <Iconfont
                title="点赞"
                type={commentInfo.likeStatus ? 'icon-good-fill' : 'icon-good'}
              />
              <div>
                {commentInfo.likeCount >= 999 ? '999+' : commentInfo.likeCount}
              </div>
            </Space>
            {commentInfo.from === userModelState.userInfo?.id && (
              <Iconfont
                onClick={() => {
                  onDelete(commentInfo.id);
                }}
                title="删除"
                className={`clickable ${styles.ctrl} danger`}
                type="icon-ashbin"
              />
            )}
          </Space>
        </div>
        <div className={styles.time}>{formatTime(commentInfo.time)}</div>

        <div
          className="clickable"
          title="回复这条评论"
          onClick={() => {
            setReplyingComment({
              id: commentInfo.id,
              toName: commentInfo.fromName,
            });
          }}
        >
          <RichTextViewer
            className={`${styles.content}`}
            html={commentInfo.content}
          />
        </div>
        {showReply && (
          <div className={styles.commentReplys}>
            <LoadingContainer loading={getCommentReplyListLoading}>
              <ColumnSpace>
                <ColumnSpace>
                  {commentReplyList?.map((item: any) => {
                    return (
                      <div key={item.id} className={styles.replyItem}>
                        <Space>
                          <span className={styles.time}>
                            {formatTime(item.replyTime)}
                          </span>
                          {/* <Avatar src={item.fromAvatarUrl} /> */}
                          <Link to={`/profile?userId=${item.from}`}>
                            {item.fromName}
                          </Link>
                          {item.to && (
                            <Space>
                              回复
                              <Link to={`/profile?userId=${item.to}`}>
                                {item.toName}
                              </Link>
                            </Space>
                          )}
                          <span>：</span>
                        </Space>
                        <div
                          className={`${styles.content} clickable`}
                          title="回复这条回复"
                          onClick={() => {
                            setReplyingComment({
                              id: commentInfo.id,
                              to: item.from,
                              toName: item.fromName,
                            });
                          }}
                        >
                          <RichTextViewer html={item.content} />
                        </div>
                      </div>
                    );
                  })}
                </ColumnSpace>
              </ColumnSpace>
            </LoadingContainer>
          </div>
        )}
      </ColumnSpace>
      <ReplyDrawerInputer
        onConfirm={handleSendCommentReply}
        toName={replyingComment?.toName}
        loading={sendCommentReplyLoading}
        onClose={() => setReplyingComment(undefined)}
        drawerProps={{
          visible: !!replyingComment?.id,
          width: 600,
        }}
      />
    </Card>
  );
};

export default ArticleCommentItem;
