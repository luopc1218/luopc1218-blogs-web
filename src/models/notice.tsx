import { noticeService } from '@/services/notice';
import type { Notice } from '@/types/notice';
import type { Model } from './index';

export interface NoticeModelState {
  noticeDrawerVisible: boolean;
  notice: {
    list: Notice[];
    unReadCount: number;
  };
  getNoticeLoading: boolean;
}

export const NoticeModel: Model<NoticeModelState> = {
  namespace: 'notice',
  state: {
    noticeDrawerVisible: false,
    notice: { list: [], unReadCount: 0 },
    getNoticeLoading: false,
  },
  reducers: {
    setNoticeDrawerVisible(state, { payload }) {
      state.noticeDrawerVisible = payload;
    },
    setNotice(state, { payload }) {
      state.notice = payload;
    },
    setGetNoticeLoading(state, { payload }) {
      state.getNoticeLoading = payload;
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
        yield put({ type: 'setGetNoticeLoading', payload: true });
        const notice = yield noticeService.getNoticeList();

        yield put({
          type: 'setNotice',
          payload: notice,
        });
        yield put({ type: 'setGetNoticeLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setGetNoticeLoading', payload: false });
      }
    },
  },
};

export default NoticeModel;
