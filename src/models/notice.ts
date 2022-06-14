import { noticeService } from '@/services/notice';
import type { Model } from './index';

export interface NoticeModelState {
  noticeDrawerVisible: boolean;
  unreadNoticeCount: number;
}

export const NoticeModel: Model<NoticeModelState> = {
  namespace: 'notice',
  state: {
    noticeDrawerVisible: false,
    unreadNoticeCount: 0,
  },
  reducers: {
    setNoticeDrawerVisible(state, { payload }) {
      state.noticeDrawerVisible = payload;
    },
    setUnreadNoticeCount(state, { payload }) {
      state.unreadNoticeCount = payload;
    },
  },
  effects: {
    *openNoticeDrawer({}, { put }) {
      yield put({
        type: 'setNoticeDrawerVisible',
        payload: true,
      });
    },
    *closeNoticeDrawer({}, { put }) {
      yield put({
        type: 'setNoticeDrawerVisible',
        payload: false,
      });
    },
    *getUnreadNoticeCount({}, { put }) {
      try {
        const unreadNoticeCount = yield noticeService.getUnreadNoticeCount();
        yield put({
          type: 'setUnreadNoticeCount',
          payload: unreadNoticeCount,
        });
      } catch (error) {
        yield put({
          type: 'setUnreadNoticeCount',
          payload: 0,
        });
      }
    },
  },
};

export default NoticeModel;
