import type { Api } from '@/utils/apis';
import type { ResponseOptions } from '@/utils/request';
import request from '@/utils/request';
import { useCallback, useState } from 'react';

export const useFetch = <T = any,>(
  api: Api | undefined = undefined,
  params: Record<string, any> | FormData | undefined = {},
  callback: (resData: T) => any = () => {},
  requestOptions: ResponseOptions = {},
): [(newParams?: any) => Promise<undefined>, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = useCallback(
    async (newParams: any = undefined) => {
      if (!api) {
        return Promise.reject();
      }
      setLoading(true);
      try {
        console.log(newParams, params);

        const resData = await request(api, newParams || params, requestOptions);
        callback(resData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [api, callback, params, requestOptions],
  );

  return [handleRequest, loading];
};

export default useFetch;
