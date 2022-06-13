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
  toggleArticleCollect: {
    url: '/api/article/toggleArticleCollect',
    method: 'POST',
  },
  getArticleCommentList: {
    url: '/api/article/getArticleCommentList',
    method: 'GET',
  },
  addArticleComment: {
    url: '/api/article/addArticleComment',
    method: 'POST',
  },
  toggleArticleCommentLike: {
    url: '/api/article/toggleArticleCommentLike',
    method: 'POST',
  },
  deleteArticleComment: {
    url: '/api/article/deleteArticleComment',
    method: 'POST',
  },
  sendArticleCommentReply: {
    url: '/api/article/sendArticleCommentReply',
    method: 'POST',
  },
  getArticleCommentReplyList: {
    url: '/api/article/getArticleCommentReplyList',
    method: 'GET',
  },
};

export default apis;
