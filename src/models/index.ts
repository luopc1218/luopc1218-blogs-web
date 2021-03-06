import type { Effect, ImmerReducer, NoticeModelState } from 'umi';
import type { UserModelState } from './user';

export interface Model<T> {
  namespace?: string;
  state?: T;
  effects?: Record<string, Effect>;
  reducers?: Record<string, ImmerReducer<T>>;
}

export interface ModelMap {
  global: GlobalModelState;
  user: UserModelState;
  notice: NoticeModelState;
}

export interface GlobalModelState {
  titlePath: { title: string; path: string }[];
  sysConfig: any;
  theme: string;
  siderVisible: boolean;
}

export const globalModel: Model<GlobalModelState> = {
  namespace: 'global',
  state: {
    titlePath: [],
    sysConfig: {
      title: 'luopc1218blogs',
    },
    theme: localStorage.getItem('theme') || '',
    siderVisible: true,
  },
  reducers: {
    setPagePath(state, { payload }) {
      state.titlePath = payload;
      return state;
    },
    setSysConfig(state, { payload }) {
      state.sysConfig = payload;
      return state;
    },
    setTheme(state, { payload }) {
      state.theme = payload;
    },
    setEnableSider(state, { payload }) {
      state.siderVisible = payload;
    },
  },
  effects: {
    *changePagePath({ payload }, { put }) {
      yield put({
        type: 'setPagePath',
        payload,
      });
    },
    *changeTheme({ payload }, { put }) {
      localStorage.setItem('theme', payload);
      yield put({
        type: 'setTheme',
        payload: payload,
      });
    },
    *changeEnableSider({ payload }, { put }) {
      yield put({
        type: 'setEnableSider',
        payload,
      });
    },
  },
};

export default globalModel;
