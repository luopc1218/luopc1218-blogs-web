import { ColumnSpace } from '@/components';
import { useFetch } from '@/hooks';
import type { ArticleComment } from '@/types/article';
import { ListResponse } from '@/types/response';
import apis from '@/utils/apis';
import { Modal } from 'antd';
import ArticleCommentItem from './ArticleCommentItem';

export const ArticleCommentList: React.FC<{
  articleCommentList: ListResponse;
  setArticleCommentList: React.Dispatch<
    React.SetStateAction<ListResponse<any>>
  >;
}> = ({ articleCommentList, setArticleCommentList }) => {
  // 切换评论点赞状态api
  const [toggleCommentLike, toggleCommentLikeLoading] = useFetch(
    apis.toggleArticleCommentLike,
  );

  // 删除评论api
  const [deleteComment] = useFetch(apis.deleteArticleComment, {
    requestOptions: { showSuccessMessage: true },
  });

  const [getCommentReplyCount] = useFetch<number>(
    apis.getArticleCommentReplyCount,
  );
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
          setArticleCommentList((oldValue) => {
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
      setArticleCommentList((oldValue) => {
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

  /**
   * 监听回复评论
   * @param commentId 评论id
   */
  const handleCommentReply = async (commentId: number) => {
    const replyCount = await getCommentReplyCount({
      commentId,
    });
    if (replyCount) {
      setArticleCommentList((oldValue) => {
        const newValue = { ...oldValue };
        newValue.list = oldValue.list.map((item) =>
          item.id === commentId ? { ...item, replyCount } : item,
        );
        return newValue;
      });
    }
  };

  return (
    <ColumnSpace>
      {articleCommentList?.list.map((item: ArticleComment) => (
        <ArticleCommentItem
          key={item.id}
          commentInfo={item}
          onDelete={handleDeleteComment}
          onToggleCommentLike={handleToogleCommentLike}
          onReply={handleCommentReply}
        />
      ))}
    </ColumnSpace>
  );
};

export default ArticleCommentList;
