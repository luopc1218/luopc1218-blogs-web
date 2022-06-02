import type { Api } from '@/utils/apis';
import type { ResponseOptions } from '@/utils/request';
import request from '@/utils/request';
import { useCallback, useState } from 'react';

export const useFetch = <T = any,>(
  api: Api | undefined = undefined,
  params: Record<string, any> | FormData | undefined = {},
  callback: (resData: T) => any | undefined = () => {},
  requestOptions: ResponseOptions = {},
): [(newParams: any) => void, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = useCallback(
    async (newParams: any = {}) => {
      if (!api) {
        return Promise.reject();
      }
      setLoading(true);
      try {
        const resData = await request(api, newParams || params, requestOptions);
        callback(resData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [api, callback, params],
  );

  return [handleRequest, loading];
};

export default useFetch;
