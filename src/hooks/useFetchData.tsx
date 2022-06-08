import type { Api } from '@/utils/apis';
import type { ResponseOptions } from '@/utils/request';
import request from '@/utils/request';
import { useCallback, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

export const useFetchData = <T = any,>(
  api?: Api | undefined,
  params?: Record<string, any> | FormData,
  defaultValues?: T,
  requestOptions: ResponseOptions = {},
): [T | undefined, boolean, (newParams?: any) => any] => {
  const [data, setData] = useState<T | undefined>(defaultValues);
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = useCallback(
    async (newParams: any = undefined) => {
      if (!api) {
        return Promise.reject();
      }
      setLoading(true);
      try {
        const resData = await request(api, newParams || params, requestOptions);
        setData(resData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [api, params, requestOptions],
  );

  useDeepCompareEffect(() => {
    if (api) {
      handleRequest();
    }
  }, [api, params]);

  return [data, loading, handleRequest];
};

export default useFetchData;
