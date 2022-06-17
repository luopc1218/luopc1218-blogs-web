import { ColumnSpace, RichTextEditor } from '@/components';
import { useFetch, usePage } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Form, Input } from 'antd';
import { useHistory } from 'umi';
import styles from './index.less';

export const ArticleCreatePage = () => {
  usePage({
    pagePath: [
      {
        path: '/article/create',
        title: '写文章',
      },
    ],
    siderVisible: false,
  });

  const history = useHistory();

  const [createArticle, createArticleLoading] = useFetch<number>(
    apis.createArticle,
  );

  const handleCreateArticle = async (data: any) => {
    try {
      const articleId = await createArticle(data);
      if (articleId) {
        history.push(`/article?id=${articleId}`);
      }
    } catch (e) {}
  };

  return (
    <ColumnSpace className={`page module ${styles.articleCreatePage}`}>
      <Form onFinish={handleCreateArticle}>
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="简介" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="标签">
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '请输入文章内容' }]}
        >
          <RichTextEditor
            className={styles.editor}
            placeholder="请输入文章内容"
          />
        </Form.Item>
        <Form.Item
          shouldUpdate={(prevValues, curValues) =>
            prevValues.content !== curValues.content
          }
        >
          {({ getFieldValue }) => {
            const content = getFieldValue('content');
            return (
              <Button
                htmlType="submit"
                shape="round"
                size="large"
                type="primary"
                disabled={!content}
                loading={createArticleLoading}
              >
                提交
              </Button>
            );
          }}
        </Form.Item>
      </Form>
    </ColumnSpace>
  );
};

export default ArticleCreatePage;
