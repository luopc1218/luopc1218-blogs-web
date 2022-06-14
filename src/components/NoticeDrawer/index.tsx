import { Drawer } from 'antd';
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

  return (
    <Drawer
      visible={noticeModelState.noticeDrawerVisible}
      onClose={handleCloseNoticeDrawer}
      title="消息中心"
    >
      <LoadingContainer loading={true} className={styles.noticeDrawer}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, esse!
      </LoadingContainer>
    </Drawer>
  );
};

export default NoticeDrawer;
