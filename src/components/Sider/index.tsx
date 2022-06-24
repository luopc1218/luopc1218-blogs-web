import { ColumnSpace, Iconfont, LoadingContainer } from '@/components';
import { useFetchData } from '@/hooks';
import apis from '@/utils/apis';
import { Button, Divider, Layout, Space } from 'antd';
import type { ModelMap, UserModelState } from 'umi';
import { Link, useSelector } from 'umi';
import styles from './index.less';

export const Sider = () => {
  const userModelStatus: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  const [articleRankingList, getArticleRankingListLoading] = useFetchData(
    apis.getArticleRankingList,
  );

  const [authorRankingList, getAuthorRankingListLoading] = useFetchData(
    apis.getAuthorRankingList,
  );
  return (
    <Layout.Sider width={350} className={`${styles.sider}`}>
      <ColumnSpace>
        {userModelStatus.userInfo && (
          <ColumnSpace className="module">
            <Link to={'/article/create'}>
              <Button type="primary" size="large" block shape="round">
                写文章
              </Button>
            </Link>
            <Link to={'/profile?tab=articleList'}>
              <Button size="large" block shape="round">
                我的文章
              </Button>
            </Link>
            <Link to={'/profile?tab=myCollect'}>
              <Button size="large" block shape="round">
                我的收藏
              </Button>
            </Link>
          </ColumnSpace>
        )}

        <ColumnSpace
          className="module"
          split={<Divider style={{ margin: 0 }} />}
        >
          <div>
            <div className={styles.title}>热门文章</div>
            <LoadingContainer
              loading={getArticleRankingListLoading}
              empty={!articleRankingList || articleRankingList.length <= 0}
            >
              <ColumnSpace>
                {articleRankingList?.map((item: any, index: number) => {
                  return (
                    <Space align="center" wrap key={item.id}>
                      <Link to={`/article?id=${item.id}`}>{item.title}</Link>
                      {index <= 2 && item.viewCount > 0 && (
                        <Iconfont
                          className={styles.hotIcon}
                          type="icon-hot-fill"
                        />
                      )}
                    </Space>
                  );
                })}
              </ColumnSpace>
            </LoadingContainer>
          </div>
          <div>
            <div className={styles.title}>活跃作者</div>
            <LoadingContainer
              loading={getAuthorRankingListLoading}
              empty={!authorRankingList || authorRankingList.length <= 0}
            >
              <ColumnSpace>
                {authorRankingList?.map((item: any, index: number) => {
                  return (
                    <Space align="center" wrap key={item.id}>
                      <Link to={`/profile?userId=${item.id}`}>{item.name}</Link>
                      {index <= 2 && item.articleCount > 0 && (
                        <Iconfont
                          className={styles.hotIcon}
                          type="icon-hot-fill"
                        />
                      )}
                    </Space>
                  );
                })}
              </ColumnSpace>
            </LoadingContainer>
          </div>
        </ColumnSpace>
      </ColumnSpace>
    </Layout.Sider>
  );
};

export default Sider;
