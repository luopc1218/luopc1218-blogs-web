import apis from '@/utils/apis';
import request from '@/utils/request';
import type { Service } from './index';

export const fileService: Service = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const url = await request(apis.uploadFile, formData, {
      showErrorMessage: false,
      showSuccessMessage: false,
    });
    return url;
  },
};
