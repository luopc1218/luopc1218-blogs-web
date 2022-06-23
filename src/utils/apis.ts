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
  createArticle: {
    url: '/api/article/createArticle',
    method: 'POST',
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
  addArticleCommentReply: {
    url: '/api/article/addArticleCommentReply',
    method: 'POST',
  },
  getArticleCommentReplyList: {
    url: '/api/article/getArticleCommentReplyList',
    method: 'GET',
  },
  getArticleRankingList: {
    url: '/api/article/getArticleRankingList',
    method: 'GET',
  },
  upgradeArticleViewCount: {
    url: '/api/article/upgradeArticleViewCount',
    method: 'POST',
  },
  getAuthorRankingList: {
    url: '/api/article/getAuthorRankingList',
    method: 'GET',
  },
  getArticleCommentReplyCount: {
    url: '/api/article/getArticleCommentReplyCount',
    method: 'GET',
  },
  getArticleTypeList: {
    url: '/api/article/getArticleTypeList',
    method: 'GET',
  },
  getArticleTagList: {
    url: '/api/article/getArticleTagList',
    method: 'GET',
  },
  saveArticle: {
    url: '/api/article/saveArticle',
    method: 'POST',
  },
  deleteArticle: {
    url: '/api/article/deleteArticle',
    method: 'POST',
  },
};

export default apis;
