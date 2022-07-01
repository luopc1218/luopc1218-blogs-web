import { Drawer } from 'antd';
import { useEffect } from 'react';
import type { ModelMap, NoticeModelState } from 'umi';
import { useDispatch, useSelector } from 'umi';
import LoadingContainer from '../LoadingContainer';
import styles from './index.less';

export const NoticeDrawer: React.FC = () => {
  const noticeModelState: NoticeModelState = useSelector(
    (state: ModelMap) => state.notice,
  );

  const dispatch = useDispatch();

  const handleCloseNoticeDrawer = () => {
    dispatch({
      type: 'notice/closeNoticeDrawer',
    });
  };

  const connectNoticeServer = () => {
    const ws = new WebSocket('ws://localhost:8080/ws/notice');

    ws.onopen = function () {
      console.log('Connection open ...');
      ws.send('Hello WebSockets!');
    };
    ws.onclose = function () {
      console.log('Connection closed.');
    };
    return ws;
  };

  useEffect(() => {
    dispatch({ type: 'notice/getNotice' });
    connectNoticeServer();
  }, []);

  return (
    <Drawer
      visible={noticeModelState.noticeDrawerVisible}
      onClose={handleCloseNoticeDrawer}
      title="消息中心"
    >
      <LoadingContainer
        loading={false}
        empty={noticeModelState.notice.list.length <= 0}
        className={styles.noticeDrawer}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, esse!
      </LoadingContainer>
    </Drawer>
  );
};

export default NoticeDrawer;
