import {
  ColumnSpace,
  LoadingContainer,
  RichTextEditor,
  RichTextViewer,
} from '@/components';
import { useFetch, useFetchData } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Divider, Space } from 'antd';
import { useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';

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
      [],
    );

  const handleSendCommentReply = (to?: number) => {
    sendCommentReply({
      commentId,
      to,
      content: replyContent,
    }).then((res) => {
      if (res) {
        setReplyContent('');
        getCommentReplyList({ commentId });
      }
    });
  };

  const handleReplyReply = (toId: number, toName: string) => {};

  return (
    <div className={styles.commentReplys}>
      <Divider />
      <ColumnSpace align="center">
        <RichTextEditor
          placeholder="请输入评论"
          value={replyContent}
          onChange={setReplyContent}
        />
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
      </ColumnSpace>
      <LoadingContainer loading={getCommentReplyListLoading}>
        <Divider />
        <ColumnSpace>
          {commentReplyList?.map((item: any) => {
            return (
              <div key={item.id} className={styles.replyItem}>
                <Space>
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
                  title="回复这条评论"
                  onClick={() => {
                    handleReplyReply(item.from, item.fromName);
                  }}
                >
                  <RichTextViewer html={item.content} />
                </div>
              </div>
            );
          })}
        </ColumnSpace>
      </LoadingContainer>
    </div>
  );
};

export default CommentReplys;
