import { UserService } from '@/services/user';
import type { User } from '@/types/user';
import type { Model } from './index';

export interface UserModelState {
  checkSignInLoading: boolean;
  getUserInfoLoading: boolean;
  userInfo: User | undefined;
}

export const userModel: Model<UserModelState> = {
  namespace: 'user',
  state: {
    checkSignInLoading: false,
    getUserInfoLoading: false,
    userInfo: undefined,
  },
  reducers: {
    setUserInfo(state, { payload }) {
      return { ...state, userInfo: payload };
    },
    setCheckSignInLoading(state, { payload }) {
      return { ...state, checkSignInLoading: payload };
    },
    setGetUserInfoLoading(state, { payload }) {
      return { ...state, getUserInfoLoading: payload };
    },
  },
  effects: {
    *signIn({ payload }, { put }) {
      const { signInFormData, reslove, reject } = payload;
      try {
        yield UserService.signIn(signInFormData);
        // reslove();
        // yield put({
        //   type: 'checkSignIn',
        //   payload: {
        //     accessToken,
        //   },
        // });
      } catch (e) {
        reject();
      }
    },
    *signUp({ payload }) {
      const { signUpFormData, reslove, reject } = payload;
      try {
        yield UserService.signUp(signUpFormData);
        reslove();
      } catch (e) {
        reject();
      }
    },
    *checkSignIn({}, { put }) {
      try {
        yield put({
          type: 'setCheckSignInLoading',
          payload: true,
        });
        yield UserService.checkSignIn();
        yield put({
          type: 'setCheckSignInLoading',
          payload: false,
        });
        yield put({
          type: 'getUserInfo',
        });
      } catch (error) {
        yield put({
          type: 'setCheckSignInLoading',
          payload: false,
        });
      }
    },
    *getUserInfo({}, { put }) {
      yield put({
        type: 'setGetUserInfoLoading',
        payload: true,
      });
      const userInfo = yield UserService.getUserInfo();
      yield put({
        type: 'setUserInfo',
        payload: userInfo,
      });
      yield put({
        type: 'setGetUserInfoLoading',
        payload: false,
      });
    },
    *signOut() {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        localStorage.removeItem('accessToken');
        location.reload();
      }
    },
    *changeAvatar({ payload }, { put }) {
      try {
        yield UserService.changeAvatar(payload);
        yield put({
          type: 'getUserInfo',
        });
      } catch (error) {}
    },
    *changePassword({ payload }, { put }) {
      const { changePasswordFormData, reslove, reject } = payload;
      const { password, newPassword } = changePasswordFormData;
      try {
        yield UserService.changePassword({ password, newPassword });
        yield put({
          type: 'signOut',
        });
        reslove();
      } catch (error) {
        reject(error);
      }
    },
  },
};

export default userModel;
