export interface Notice {
  id: number;
  from: number;
  to: number;
  content: string;
  read: boolean;
  createTime: Date;
}
