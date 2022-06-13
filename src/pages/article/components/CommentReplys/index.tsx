import { LoadingContainer, RichTextEditor } from '@/components';
import { useFetch, useFetchData } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Divider } from 'antd';
import { useState } from 'react';

export interface CommentReplysProps {
  commentId: number;
}
export const CommentReplys: React.FC<CommentReplysProps> = ({ commentId }) => {
  const [sendCommentReply, sendCommentReplyLoading] = useFetch(
    apis.sendArticleCommentReply,
  );
  const [replyContent, setReplyContent] = useState('');

  const [commentReplyList, getCommentReplyListLoading, getCommentReplyList] =
    useFetchData(
      apis.getArticleCommentReplyList,
      {
        commentId,
      },
      {
        list: [],
        totalCount: 0,
      },
    );

  const handleSendCommentReply = (to?: number) => {
    sendCommentReply({
      commentId,
      to,
      content: replyContent,
    }).then((res) => {
      if (res) {
        setReplyContent('');
      }
    });
  };

  return (
    <div>
      <Divider />
      <RichTextEditor
        placeholder="请输入评论"
        value={replyContent}
        onChange={setReplyContent}
      />
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <Button
          loading={sendCommentReplyLoading}
          disabled={!replyContent}
          type="primary"
          size="large"
          shape="round"
          onClick={() => {
            handleSendCommentReply();
          }}
        >
          发送
        </Button>
      </div>
      <LoadingContainer loading={getCommentReplyListLoading}>
        <Divider />
        {commentReplyList?.list.map((item: any) => {
          return <div key={item.id}></div>;
        })}
      </LoadingContainer>
    </div>
  );
};

export default CommentReplys;
