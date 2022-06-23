import { ColumnSpace, PaginationList, RichTextEditor } from '@/components';
import { useFetch } from '@/hooks';
import usePaginationList from '@/hooks/usePaginationList';
import type { ArticleComment } from '@/types/article';
import apis from '@/utils/apis';
import { Button, Modal } from 'antd';
import 'quill/dist/quill.snow.css';
import React, { useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { useSelector } from 'umi';
import ArticleCommentItem from './ArticleCommentItem';
import styles from './index.less';

export interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const [inputingComment, setInputingComment] = useState<string>('');
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  // // 评论列表
  // const [commentList, setCommentList] = useState<ListResponse<ArticleComment>>({
  //   list: [],
  //   totalCount: 0,
  // });

  // // 获取评论列表api
  // const [getCommentList, getCommentListLoading] = useFetch<
  //   ListResponse<ArticleComment>
  // >(apis.getArticleCommentList, {}, (res) => {
  //   setCommentList({
  //     list: [...commentList.list, ...res.list],
  //     totalCount: res.totalCount,
  //   });
  // });

  const [commentList, setCommentList] = usePaginationList();

  // 提交评论api
  const [submitComment, submitCommentLoading] = useFetch(
    apis.addArticleComment,
  );

  /**
   * 监听提交评论
   */
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

  // 切换评论点赞状态api
  const [toggleCommentLike, toggleCommentLikeLoading] = useFetch(
    apis.toggleArticleCommentLike,
  );

  /**
   * 监听切换评论点赞状态
   * @param commentId 评论id
   */
  const handleToogleCommentLike = (commentId: number) => {
    if (toggleCommentLikeLoading) return;
    toggleCommentLike({
      commentId,
    }).then((res) => {
      if (!res) return;
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

  // 删除评论api
  const [deleteComment] = useFetch(apis.deleteArticleComment, {
    requestOptions: { showSuccessMessage: true },
  });

  /**
   * 监听删除评论
   * @param commentId 评论id
   */
  const handleDeleteComment = (commentId: number) => {
    Modal.confirm({
      type: 'warning',
      content: '确认删除这条评论？',
      onOk() {
        return deleteComment({
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

  const [getCommentReplyCount] = useFetch<number>(
    apis.getArticleCommentReplyCount,
  );

  /**
   * 监听回复评论
   * @param commentId 评论id
   */
  const handleCommentReply = async (commentId: number) => {
    const replyCount = await getCommentReplyCount({
      commentId,
    });
    if (replyCount) {
      setCommentList((oldValue) => {
        const newValue = { ...oldValue };
        newValue.list = oldValue.list.map((item) =>
          item.id === commentId ? { ...item, replyCount } : item,
        );
        return newValue;
      });
    }
  };

  return (
    <div className={`${styles.comments} module`}>
      <ColumnSpace>
        <div>评论</div>
        {userModelState.userInfo && (
          <ColumnSpace align="center">
            <RichTextEditor
              placeholder="请输入评论"
              value={inputingComment}
              onChange={setInputingComment}
              style={{
                // minHeight: 200,
                width: '100%',
              }}
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
          api={apis.getArticleCommentList}
          params={{ articleId }}
          onDataChange={setCommentList}
        >
          <ColumnSpace>
            {commentList?.list.map((item: ArticleComment) => (
              <ArticleCommentItem
                key={item.id}
                commentInfo={item}
                onDelete={handleDeleteComment}
                onToggleCommentLike={handleToogleCommentLike}
                onReply={handleCommentReply}
              />
            ))}
          </ColumnSpace>
        </PaginationList>
      </ColumnSpace>
    </div>
  );
};

export default Comments;
