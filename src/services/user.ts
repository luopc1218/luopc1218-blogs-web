import type { SignInFormData, SignUpFormData } from '@/components';
import type { User } from '@/types/user';
import { md5Object } from '@/utils';
import apis from '@/utils/apis';
import request from '@/utils/request';
import type { Service } from './index';

export const UserService: Service = {
  // 登录
  async signIn(signUpFormData: SignInFormData) {
    const token = await request<string>(
      apis.signIn,
      md5Object(signUpFormData, ['password']),
    );
    localStorage.setItem('accessToken', token);
    location.reload();
    // return token;
  },
  // 注册
  async signUp(signUpFormData: SignUpFormData) {
    const { checkPassword, ...signUpFormDataWithoutCheckPassword } =
      signUpFormData;
    await request<boolean>(
      apis.signUp,
      md5Object(signUpFormDataWithoutCheckPassword, ['password']),
    );
    return true;
  },
  // 检测是否登录
  async checkSignIn() {
    await request<boolean>(apis.checkSignIn, undefined, {
      showErrorMessage: false,
    });
    return true;
  },
  // 获取用户信息
  async getUserInfo(): Promise<User> {
    const userInfo = await request<User>(apis.getUserInfo, undefined);
    return userInfo;
  },
  // 修改头像
  async changeAvatar(avatarUrl) {
    await request<boolean>(apis.changeAvatar, { url: avatarUrl });
    return true;
  },
  async changePassword(changePasswordFormData) {
    await request<boolean>(
      apis.changePassword,
      md5Object(changePasswordFormData, ['password', 'newPassword']),
    );
    return true;
  },
};
