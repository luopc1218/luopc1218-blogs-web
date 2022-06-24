import { useModifySetState } from '@/hooks';
import { UserService } from '@/services/user';
import { User } from '@/types/user';
import { useState } from 'react';

export interface UserModelState {
  checkSignInLoading: boolean;
  getUserInfoLoading: boolean;
  userInfo: User | undefined;
}

export default () => {
  const [state, setState] = useState({
    checkSignInLoading: false,
    getUserInfoLoading: false,
    userInfo: undefined,
  });

  const modifySetState = useModifySetState(setState);

  const signIn = async ({ signInFormData, reslove, reject }) => {
    try {
      await UserService.signIn(signInFormData);
      reslove();
    } catch (e) {
      reject();
    }
  };
  const signUp = async ({ signUpFormData, reslove, reject }) => {
    try {
      await UserService.signUp(signUpFormData);
      reslove();
    } catch (e) {
      reject();
    }
  };
  const checkSignIn = async () => {
    try {
      modifySetState('checkSignInLoading', true);
      await UserService.checkSignIn();
      modifySetState('checkSignInLoading', false);

      await getUserInfo();
    } catch (error) {
      modifySetState('checkSignInLoading', false);
    }
  };
  const getUserInfo = async () => {
    modifySetState('setGetUserInfoLoading', true);
    const userInfo = await UserService.getUserInfo();
    modifySetState('userInfo', userInfo);
    modifySetState('setGetUserInfoLoading', false);
  };

  const signOut = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      localStorage.removeItem('accessToken');
      location.reload();
    }
  };
  const changeAvatar = async (avatar) => {
    try {
      await UserService.changeAvatar(avatar);
      await getUserInfo();
    } catch (error) {}
  };
  const changePassword = async ({
    changePasswordFormData,
    reslove,
    reject,
  }) => {
    const { password, newPassword } = changePasswordFormData;
    try {
      await UserService.changePassword({ password, newPassword });
      signOut();
      reslove();
    } catch (error) {
      reject(error);
    }
  };
  return {
    state,
    signIn,
    signUp,
    checkSignIn,
    getUserInfo,
    signOut,
    changeAvatar,
    changePassword,
  };
};
