import {
  ColumnSpace,
  Iconfont,
  PaginationList,
  RichTextEditor,
} from '@/components';
import { useFetch } from '@/hooks';
import type { ArticleComment } from '@/types/article';
import type { Pagination } from '@/types/pagination';
import type { ListResponse } from '@/types/response';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Avatar, Badge, Button, Card, Divider, Modal, Space } from 'antd';
import 'quill/dist/quill.snow.css';
import { useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { Link, useSelector } from 'umi';
import CommentReplys from '../CommentReplys';
import styles from './index.less';

export interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const [inputingComment, setInputingComment] = useState<string>('');
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );
  const [commentList, setCommentList] = useState<ListResponse>({
    list: [],
    totalCount: 0,
  });
  const [getCommentList, getCommentListLoading] = useFetch<
    ListResponse<ArticleComment>
  >(apis.getArticleCommentList, {}, (res) => {
    setCommentList({
      list: [...commentList.list, ...res.list],
      totalCount: res.totalCount,
    });
  });

  const [submitComment, submitCommentLoading] = useFetch(
    apis.addArticleComment,
  );

  const handleSubmitComment = () => {
    submitComment({
      articleId,
      content: inputingComment,
    }).then((res) => {
      if (!res) return false;
      setInputingComment('');
      setCommentList((oldValue) => {
        const newValue = { ...oldValue };
        newValue.list.unshift(res);
        return newValue;
      });
    });
  };

  const [toggleCommentLike, toggleCommentLikeLoading] = useFetch(
    apis.toggleArticleCommentLike,
  );

  const handleToogleCommentLike = (commentId: number) => {
    if (toggleCommentLikeLoading) return false;
    toggleCommentLike({
      commentId,
    }).then((res) => {
      if (!res) return false;
      setCommentList((oldValue) => {
        const newValue = { ...oldValue };
        newValue.list = oldValue.list.map((item) => {
          if (item.id === commentId) {
            const newLikeStatus = !item.likeStatus;
            const newLikeCount = newLikeStatus
              ? item.likeCount + 1
              : item.likeCount - 1;
            return {
              ...item,
              likeStatus: newLikeStatus,
              likeCount: newLikeCount,
            };
          }
          return item;
        });

        return newValue;
      });
    });
  };

  const [deleteComment, deleteCommentLoading] = useFetch(
    apis.deleteArticleComment,
    undefined,
    undefined,
    { showSuccessMessage: true },
  );

  const handleDeleteComment = (commentId: number) => {
    Modal.confirm({
      type: 'warning',
      content: '确认删除这条评论？',
      onOk() {
        deleteComment({
          commentId: commentId,
        }).then((res) => {
          if (!res) return false;
          setCommentList((oldValue) => {
            const newValue = { ...oldValue };
            newValue.list = oldValue.list.filter(
              (item) => item.id !== commentId,
            );
            newValue.totalCount -= 1;
            return newValue;
          });
        });
      },
      okButtonProps: {
        danger: true,
      },
    });
  };

  const [replyingCommentId, setReplyingCommentId] = useState<
    number | undefined
  >(undefined);

  const handleToggleCommentReplys = (commentId: number) => {
    if (replyingCommentId === commentId) {
      setReplyingCommentId(undefined);
      return;
    }
    setReplyingCommentId(commentId);
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
      <PaginationList
        loading={getCommentListLoading || deleteCommentLoading}
        empty={commentList?.list.length === 0}
        onPageChange={(pagination: Pagination) => {
          getCommentList({
            articleId,
            page: pagination.page,
            pageSize: pagination.pageSize,
          });
        }}
        noMoreData={commentList?.totalCount <= commentList?.list.length}
      >
        <ColumnSpace>
          {commentList?.list.map((item) => (
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
                    {userModelState.userInfo && (
                      <Badge
                        count={item.replyCount}
                        className={styles.ctrl}
                        size="small"
                        title="回复"
                      >
                        <Iconfont
                          onClick={() => {
                            handleToggleCommentReplys(item.id);
                          }}
                          title="回复"
                          type={
                            replyingCommentId === item.id
                              ? 'icon-comments-fill'
                              : 'icon-comments'
                          }
                        />
                      </Badge>
                    )}
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
                          handleToogleCommentLike(item.id);
                        }}
                      />
                    </Badge>
                    {item.from === userModelState.userInfo?.id && (
                      <Iconfont
                        onClick={() => {
                          handleDeleteComment(item.id);
                        }}
                        title="删除"
                        className={styles.ctrl}
                        type="icon-close"
                      />
                    )}
                  </Space>
                </div>
                <div
                  className={`ql-editor ${styles.content}`}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <div className={styles.time}>{formatTime(item.time)}</div>
                {replyingCommentId === item.id && (
                  <CommentReplys commentId={item.id} />
                )}
              </ColumnSpace>
            </Card>
          ))}
        </ColumnSpace>
      </PaginationList>
    </ColumnSpace>
  );
};

export default Comments;
