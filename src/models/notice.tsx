import { noticeService } from '@/services/notice';
import type { Notice } from '@/types/notice';
import type { Model } from './index';

export interface NoticeModelState {
  noticeDrawerVisible: boolean;
  notice: {
    list: Notice[];
    unReadCount: number;
  };
}

export const NoticeModel: Model<NoticeModelState> = {
  namespace: 'notice',
  state: {
    noticeDrawerVisible: false,
    notice: { list: [], unReadCount: 0 },
  },
  reducers: {
    setNoticeDrawerVisible(state, { payload }) {
      state.noticeDrawerVisible = payload;
    },
    setNotice(state, { payload }) {
      state.notice = payload;
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
    *getNoticeList({}, { put }) {
      try {
        const notice = yield noticeService.getNoticeList();
        yield put({
          type: 'setNotice',
          payload: notice,
        });
      } catch (error) {}
    },
  },
};

export default NoticeModel;
