import type { Notice } from '@/types/notice';
import { formatTime } from '@/utils';
import { Badge, Card, Drawer, notification, Space } from 'antd';
import { useEffect } from 'react';
import type { ModelMap, NoticeModelState, UserModelState } from 'umi';
import { Link, useDispatch, useSelector } from 'umi';
import ColumnSpace from '../ColumnSpace';
import LoadingContainer from '../LoadingContainer';
import { showNotice } from '../NoticeViewer';
import styles from './index.less';

export const NoticeDrawer: React.FC = () => {
  const noticeModelState: NoticeModelState = useSelector(
    (state: ModelMap) => state.notice,
  );

  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );

  const dispatch = useDispatch();

  const handleCloseNoticeDrawer = () => {
    dispatch({
      type: 'notice/closeNoticeDrawer',
    });
  };

  const connectNoticeServer = (userId: number) => {
    const ws = new WebSocket('ws://localhost:8080/ws/notice' + '/' + userId);

    ws.onopen = function () {
      console.log('Connection open ...');
    };
    ws.onclose = function () {
      console.log('Connection closed.');
    };
    ws.onmessage = function (e) {
      const notice: Notice = JSON.parse(e.data);
      window.notification.open({
        message: '您有一条新的消息',
        key: `${notice.id}`,
        description: (
          <ColumnSpace>
            {notice.from && (
              <Space>
                <Link to={`/profile?id=${notice.from}`}>{notice.fromName}</Link>
                <div>回复了您</div>
              </Space>
            )}
            <div style={{ color: '#969696' }}>
              {formatTime(notice.createTime)}
            </div>
          </ColumnSpace>
        ),
        onClick: () => {
          showNotice(notice.id);
          notification.close(`${notice.id}`);
        },
      });
      dispatch({ type: 'notice/getNoticeList' });
    };
    return ws;
  };

  useEffect(() => {
    dispatch({ type: 'notice/getNoticeList' });
    if (userModelState.userInfo?.id) {
      connectNoticeServer(userModelState.userInfo?.id);
    }
  }, [userModelState.userInfo?.id]);

  const handleShowNotice = (noticeId: number) => {
    showNotice(noticeId);
  };

  return (
    <Drawer
      visible={noticeModelState.noticeDrawerVisible}
      onClose={handleCloseNoticeDrawer}
      title="消息中心"
    >
      <LoadingContainer
        loading={noticeModelState.getNoticeLoading}
        empty={noticeModelState.notice.list.length <= 0}
        className={styles.noticeDrawer}
      >
        <ColumnSpace>
          {noticeModelState.notice.list.map((item) => {
            return (
              <Badge.Ribbon text={item.isRead ? `` : '未读'} key={item.id}>
                <Card hoverable onClick={() => handleShowNotice(item.id)}>
                  <div style={{ color: '#969696' }}>
                    {formatTime(item.createTime)}
                  </div>

                  <Space align="center">
                    <Link to={`/profile?id=${item.from}`}>{item.fromName}</Link>
                    <div>回复了您</div>
                  </Space>
                </Card>
              </Badge.Ribbon>
            );
          })}
        </ColumnSpace>
      </LoadingContainer>
    </Drawer>
  );
};

export default NoticeDrawer;
