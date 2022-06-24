export interface Article {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string;
  content: string;
  tags: ArticleTag[];
  type: number;
  viewCount: number;
  createTime: string;
  editTime: string;
}

export interface ArticleFeedback {
  collectCount: number;
  likeCount: number;
  unlikeCount: number;
  likeStatus: number;
  collectStatus: boolean;
  id: number;
}

export interface ArticleComment {
  id: number;
  articleId: number;
  from: number;
  fromName: string;
  fromAvatarUrl: string;
  content: string;
  replyCount: number;
  likeCount: number;
  likeStatus: boolean;
  time: string;
}

export interface ArticleTag {
  id: number;
  name: string;
}
