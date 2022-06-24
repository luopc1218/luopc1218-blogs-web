import { useModifySetState } from '@/hooks';
import { noticeService } from '@/services/notice';
import { useState } from 'react';

export interface NoticeState {
  noticeDrawerVisible: boolean;
  unreadNoticeCount: number;
}

export default () => {
  const [state, setState] = useState({
    noticeDrawerVisible: false,
    unreadNoticeCount: 0,
  });

  const modifySetState = useModifySetState(setState);

  const openNoticeDrawer = () => {
    modifySetState('noticeDrawerVisible', true);
  };
  const closeNoticeDrawer = () => {
    modifySetState('noticeDrawerVisible', false);
  };
  const getUnreadNoticeCount = async () => {
    try {
      const unreadNoticeCount = await noticeService.getUnreadNoticeCount();
      modifySetState('unreadNoticeCount', unreadNoticeCount);
    } catch (error) {
      modifySetState('unreadNoticeCount', 0);
    }
  };
  return { state, openNoticeDrawer, closeNoticeDrawer, getUnreadNoticeCount };
};
