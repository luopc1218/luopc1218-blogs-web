import type { Effect, ImmerReducer } from 'umi';
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
}

export interface GlobalModelState {
  titlePath: { title: string; path: string }[];
  sysConfig: any;
  theme: string;
}

export const globalModel: Model<GlobalModelState> = {
  namespace: 'global',
  state: {
    titlePath: [],
    sysConfig: {
      title: 'luopc1218blogs',
    },
    theme: localStorage.getItem('theme') || '',
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
  },
};

export default globalModel;
