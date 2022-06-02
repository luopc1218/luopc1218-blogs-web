export const BASE_API = 'localhost';

export interface Api {
  url: string;
  method: 'POST' | 'GET';
}

export const apis: Record<string, Api> = {
  signIn: {
    url: '/api/user/signIn',
    method: 'POST',
  },
  signUp: {
    url: '/api/user/signUp',
    method: 'POST',
  },
  checkSignIn: {
    url: '/api/user/checkSignIn',
    method: 'GET',
  },
  getUserInfo: {
    url: '/api/user/getUserInfo',
    method: 'GET',
  },

  uploadFile: {
    url: '/api/file/upload',
    method: 'POST',
  },
  changeAvatar: {
    url: '/api/user/changeAvatar',
    method: 'POST',
  },
  changePassword: {
    url: '/api/user/changePassword',
    method: 'POST',
  },
  getArticleList: {
    url: '/api/article/getArticleList',
    method: 'GET',
  },
  getArticleInfo: {
    url: '/api/article/getArticleInfo',
    method: 'GET',
  },
  toggleArticleLike: {
    url: '/api/article/toggleArticleLike',
    method: 'POST',
  },
  getArticleFeedback: {
    url: '/api/article/getArticleFeedback',
    method: 'GET',
  },
};

export default apis;
