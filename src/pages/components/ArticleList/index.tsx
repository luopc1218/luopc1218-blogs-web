import {
  ColumnSpace,
  Iconfont,
  PaginationList,
  PaginationListImperative,
  RemoteQueryForm,
  RemoteSelect,
} from '@/components';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Card, Space } from 'antd';
import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { Link } from 'umi';
import styles from './index.less';

export interface ArticleListProps {
  words?: string;
  style?: CSSProperties;
  className?: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({}) => {
  const articleListRef = useRef<PaginationListImperative>(null);
  const handleRefresh = (queryData: any) => {
    articleListRef?.current?.refresh(queryData);
  };

  return (
    <ColumnSpace>
      <div className="module">
        <RemoteQueryForm
          fields={[
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
                    fieldNames={{ label: 'name', value: 'id' }}
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
                    fieldNames={{ label: 'name', value: 'id' }}
                    placeholder="请选择标签"
                  />
                );
              },
            },
          ]}
          onSearch={handleRefresh}
        />
      </div>
      <div>
        <PaginationList
          ref={articleListRef}
          api={apis.getArticleList}
          render={(data) => {
            return (
              <ColumnSpace>
                {data?.list?.map((item: any) => (
                  <div key={item.id}>
                    <Card className={styles.articleItem}>
                      <ColumnSpace>
                        <Link
                          to={`/article?id=${item.id}`}
                          className={styles.title}
                        >
                          {item.title}
                        </Link>
                        <div className={styles.description}>
                          {item.description}
                        </div>
                        <Space>
                          <Link
                            to={`/profile?userId=${item.authorId}`}
                            className={styles.authorId}
                          >
                            {item.authorName}
                          </Link>
                          <div className={styles.likeCount}>
                            <Iconfont type="icon-good" />
                            {item.likeCount}
                          </div>
                          <div className={styles.unlikeCount}>
                            <Iconfont type="icon-bad" />
                            {item.unlikeCount}
                          </div>
                          <div className={styles.createTime}>
                            {formatTime(item.finalTime)}
                          </div>
                        </Space>
                      </ColumnSpace>
                    </Card>
                  </div>
                ))}
              </ColumnSpace>
            );
          }}
        />
      </div>
    </ColumnSpace>
  );
};

export default ArticleList;
