import apis from '@/utils/apis';
import request from '@/utils/request';

export type ServiceFunction = (...params: any[]) => Promise<any>;

export type Service = Record<string, ServiceFunction>;

export const globalService: Service = {
  async getSysConfig() {
    const sysConfig = await request(apis.getSysConfig);
    return sysConfig;
  },
};
