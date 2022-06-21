import {
  ColumnSpace,
  RemoteSelect,
  RemoteTable,
  RemoteTableImperativeHandle,
} from '@/components';
import { useFetch } from '@/hooks';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Button, Modal, Space, Tag } from 'antd';
import { useRef } from 'react';
import { Link } from 'umi';

export interface ArticleListProps {
  isMe: boolean;
}

export const ArticleList: React.FC<ArticleListProps> = ({ isMe }) => {
  const tableRef = useRef<RemoteTableImperativeHandle>(null);

  const [deleteArticle] = useFetch(apis.deleteArticle);

  const handleDeleteArticle = (articleId: number) => {
    Modal.confirm({
      type: 'warning',
      content: '确认删除这条评论？',
      onOk() {
        return deleteArticle({
          articleId,
        }).then((res) => {
          if (res) tableRef.current?.refresh();
        });
      },
    });
  };

  return (
    <ColumnSpace>
      <RemoteTable
        ref={tableRef}
        queryFields={[
          {
            name: 'title',
            label: '标题',
          },
          {
            name: 'type',
            label: '类型',
            render: () => {
              return (
                <RemoteSelect
                  api={apis.getArticleTypeList}
                  keyName="name"
                  valueName="id"
                  placeholder="请选择类型"
                />
              );
            },
          },
          {
            name: 'tags',
            label: '标签',
            render: () => {
              return (
                <RemoteSelect
                  api={apis.getArticleTagList}
                  mode="multiple"
                  keyName="name"
                  valueName="id"
                  placeholder="请选择类型"
                />
              );
            },
          },
        ]}
        api={apis.getArticleList}
        rowKey="id"
        columns={[
          {
            title: '#',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '标题',
            dataIndex: 'title',
            render(value, row) {
              return <Link to={`/article?id=${row.id}`}>{value}</Link>;
            },
          },
          {
            title: '类型',
            dataIndex: 'typeName',
          },
          {
            title: '标签',
            dataIndex: 'tags',
            render(value) {
              return (
                <Space>
                  {value.map((tag: any) => (
                    <Tag key={tag.id}>{tag.name}</Tag>
                  ))}
                </Space>
              );
            },
          },
          {
            title: '最后修改时间',
            dataIndex: 'finalTime',
            width: 200,
            render(value) {
              return formatTime(value);
            },
          },
          {
            title: '操作',
            width: 300,
            render(row) {
              return (
                <Space>
                  <Button type="link">查看</Button>
                  {isMe && (
                    <>
                      <Button type="link">编辑</Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteArticle(row.id)}
                      >
                        删除
                      </Button>
                    </>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </ColumnSpace>
  );
};

export default ArticleList;
