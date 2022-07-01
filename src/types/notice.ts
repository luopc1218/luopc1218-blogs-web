export interface Notice {
  id: number;
  from: number;
  to: number;
  content: string;
  isRead: boolean;
  createTime: Date;
}
