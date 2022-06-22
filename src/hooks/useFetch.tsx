import type { Api } from '@/utils/apis';
import type { ResponseOptions } from '@/utils/request';
import request from '@/utils/request';
import { useState } from 'react';

export interface UseFetchOptions<T> {
  defaultParams?: Record<string, any> | FormData | undefined;
  callback?: (resData: T) => any;
  requestOptions?: ResponseOptions;
}

export const useFetch = <T = any,>(
  api: Api | undefined | false,
  options?: UseFetchOptions<T>,
): [(newParams?: any) => Promise<T | undefined>, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = async (
    newParams: any = undefined,
  ): Promise<T | undefined> => {
    if (!api) {
      return Promise.reject();
    }
    setLoading(true);
    try {
      const resData = await request(
        api,
        newParams || options?.defaultParams,
        options?.requestOptions,
      );
      if (options?.callback) options.callback(resData);
      setLoading(false);
      return resData;
    } catch (error) {
      setLoading(false);
      return undefined;
    }
  };

  return [handleRequest, loading];
};

export default useFetch;
