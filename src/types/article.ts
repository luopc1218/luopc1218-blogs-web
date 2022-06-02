export interface Article {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  content: string;
  tags: string;
  type: number;
  viewCount: number;
  collectCount: number;
  likeCount: number;
  unLikeCount: number;
  commentCount: number;
  createTime: string;
  editTime: string;
  deleteTime: string;
}
