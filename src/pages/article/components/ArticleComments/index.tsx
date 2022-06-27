import type { PaginationListImperative } from '@/components';
import { ColumnSpace, PaginationList, RichTextEditor } from '@/components';
import { useFetch } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Divider } from 'antd';
import 'quill/dist/quill.snow.css';
import React, { useRef, useState } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { useSelector } from 'umi';
import ArticleCommentList from './ArticleCommentList';
import styles from './index.less';

export interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const [inputingComment, setInputingComment] = useState<string>('');
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  const paginationListRef = useRef<PaginationListImperative>(null);

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
      paginationListRef?.current?.refresh();
    });
  };

  return (
    <div className={`${styles.comments} module`}>
      <ColumnSpace>
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

        <Divider>评论</Divider>
        <PaginationList
          ref={paginationListRef}
          api={apis.getArticleCommentList}
          params={{ articleId }}
          render={(articleCommentList, setArticleCommentList) => {
            return (
              <ArticleCommentList
                articleCommentList={articleCommentList}
                setArticleCommentList={setArticleCommentList}
              />
            );
          }}
        />
      </ColumnSpace>
    </div>
  );
};

export default Comments;
