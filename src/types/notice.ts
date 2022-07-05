export interface Notice {
  id: number;
  from: number;
  fromName: string;
  to: number;
  toName: string;
  content: string;
  isRead: boolean;
  createTime: string;
}
