import apis from '@/utils/apis';
import request from '@/utils/request';
import type { Service } from './index';

export const noticeService: Service = {
  async getNotice() {
    return await request(apis.getNotice);
  },
};
