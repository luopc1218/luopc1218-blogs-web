import { ColumnSpace, LoadingContainer, RichTextEditor } from '@/components';
import { useFetch, useFetchData } from '@/hooks';
import type { ArticleComment } from '@/types/article';
import type { ListResponse } from '@/types/response';
import apis from '@/utils/apis';
import { Button, Card } from 'antd';
import 'quill/dist/quill.snow.css';
import { useCallback, useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { useSelector } from 'umi';

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

  const handleSubmitComment = useCallback(() => {
    submitComment({
      articleId,
      content: inputingComment,
    });
  }, [articleId, inputingComment, submitComment]);

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
            <Card hoverable key={item.id}>
              <ColumnSpace className={styles.commentItem}>
                <div
                  className={`ql-editor ${styles.content}`}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <div className={styles.time}>
                  {item.time} by {item.from}
                </div>
              </ColumnSpace>
            </Card>
          ))}
        </ColumnSpace>
      </LoadingContainer>
    </ColumnSpace>
  );
};

export default Comments;
