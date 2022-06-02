import type { Api } from '@/utils/apis';
import request from '@/utils/request';
import { useCallback, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

export const useFetch = <T = any,>(
  api?: Api,
  params?: Record<string, any> | FormData | undefined,
  defaultValues?: T,
): [T | undefined, boolean] => {
  const [data, setData] = useState<T | undefined>(defaultValues);
  const [loading, setLoading] = useState<boolean>(false);
  const handleRequest = useCallback(
    async (newParams: any = {}) => {
      if (!api) {
        return Promise.reject();
      }
      setLoading(true);
      try {
        const resData = await request(api, { ...params, ...newParams });
        setData(resData);
        setLoading(false);
      } catch (error) {
        setData(undefined);
        setLoading(false);
      }
    },
    [api, params],
  );

  useDeepCompareEffect(() => {
    if (api) {
      handleRequest();
    }
  }, [api, params]);

  return [data, loading];
};

export default useFetch;
