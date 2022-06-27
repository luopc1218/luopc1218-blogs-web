import {
  ColumnSpace,
  LoadingContainer,
  RemoteSelect,
  RichTextEditor,
} from '@/components';
import { useFetch, useFetchData, usePage, useUrlParams } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Form, Input } from 'antd';
import { useMemo } from 'react';
import type { ModelMap, UserModelState } from 'umi';
import { useHistory, useSelector } from 'umi';
import { useDeepCompareEffect } from 'use-deep-compare';
import ArticleTagSelector from '../components/ArticleTagSelector';
import styles from './index.less';

export interface ArticleCreatePageProps {}

export const ArticleCreatePage: React.FC<ArticleCreatePageProps> = ({}) => {
  const [{ articleId }] = useUrlParams();

  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  const [articleInfo, getArticleInfoLoading] = useFetchData(
    !!articleId && apis.getArticleInfo,
    {
      params: { id: articleId },
      interceptor(res) {
        return { ...res, tags: res.tags.map((item: any) => item.id) };
      },
    },
  );

  const [form] = Form.useForm();

  useDeepCompareEffect(() => {
    if (articleInfo) {
      form.setFieldsValue({
        title: articleInfo.title,
        description: articleInfo.description,
        tags: articleInfo.tags,
        content: articleInfo.content,
        type: articleInfo.type,
      });
    }
  }, [articleInfo, form]);

  const editMode = useMemo(() => {
    return !!articleId && userModelState.userInfo?.id === articleInfo?.authorId;
  }, [articleId, articleInfo, userModelState]);
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
      const newArticleId = await createArticle(data);
      if (newArticleId) {
        history.push(`/article?id=${newArticleId}`);
      }
    } catch (e) {}
  };

  const [saveArticle, saveArticleLoading] = useFetch(apis.saveArticle);

  const handleSaveCreateArticle = async (data: any) => {
    try {
      const newArticleId = await saveArticle({ articleId, ...data });
      if (newArticleId) {
        history.push(`/article?id=${newArticleId}`);
      }
    } catch (e) {}
  };

  return (
    <LoadingContainer loading={getArticleInfoLoading}>
      <ColumnSpace className={`page module ${styles.articleCreatePage}`}>
        <Form
          form={form}
          onFinish={editMode ? handleSaveCreateArticle : handleCreateArticle}
          initialValues={{
            title: '',
            description: '',
            tags: [],
            newTags: [],
            type: undefined,
            content: '',
          }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="简介"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <RemoteSelect
              api={apis.getArticleTypeList}
              fieldNames={{ label: 'name', value: 'id' }}
              placeholder="请选择类型"
            />
          </Form.Item>
          <Form.Item
            label="标签"
            shouldUpdate={(preValues, afterValues) => {
              return (
                preValues.newTags?.join(',') !== afterValues.newTags?.join(',')
              );
            }}
          >
            {({ getFieldValue, setFieldsValue }) => {
              const newTags = getFieldValue('newTags');
              return (
                <Form.Item name="tags">
                  <ArticleTagSelector
                    defaultNewTagList={newTags}
                    onNewTagListChange={(value) =>
                      setFieldsValue({ newTags: value })
                    }
                  />
                </Form.Item>
              );
            }}
            {/* <RemoteSelect
              mode="multiple"
              api={apis.getArticleTagList}
              keyName="name"
              valueName="id"
            /> */}
          </Form.Item>
          <Form.Item name="newTags" hidden>
            {/* <Select mode="tags" /> */}
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
                  loading={createArticleLoading || saveArticleLoading}
                >
                  {editMode ? '保存修改' : '提交'}
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </ColumnSpace>
    </LoadingContainer>
  );
};

export default ArticleCreatePage;
