import type { Api } from '@/utils/apis';
import type { ResponseOptions } from '@/utils/request';
import request from '@/utils/request';
import { useState } from 'react';

export const useFetch = <T = any,>(
  api: Api | undefined | false,
  params: Record<string, any> | FormData | undefined = {},
  callback: (resData: T) => any = () => {},
  requestOptions: ResponseOptions = {},
): [(newParams?: any) => Promise<undefined>, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = async (newParams: any = undefined) => {
    if (!api) {
      return Promise.reject();
    }
    setLoading(true);
    try {
      const resData = await request(api, newParams || params, requestOptions);
      callback(resData);
      setLoading(false);
      return resData;
    } catch (error) {
      setLoading(false);
    }
  };

  return [handleRequest, loading];
};

export default useFetch;
