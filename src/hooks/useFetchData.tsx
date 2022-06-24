import type { Api } from '@/utils/apis';
import { useState } from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import type { UseFetchOptions } from './useFetch';
import useFetch from './useFetch';

export interface UseFetchDataOptions<T> {
  params?: Record<string, any> | FormData;
  defaultValues?: T;
  interceptor?: (res: T | undefined) => any;
  fetchOptions?: UseFetchOptions<T>;
}

export const useFetchData = <T = any,>(
  api?: Api | undefined | false,
  options?: UseFetchDataOptions<T>,
): [
  T | undefined,
  boolean,
  (newParams?: any) => any,
  React.Dispatch<React.SetStateAction<T | undefined>>,
] => {
  const [data, setData] = useState<T | undefined>(options?.defaultValues);

  const [getData, getDataLoading] = useFetch(api, options?.fetchOptions);

  const handleGetData = useDeepCompareCallback(
    (newParams: any) => {
      getData(newParams).then((res) => {
        if (options?.interceptor) {
          setData(options?.interceptor(res));
        } else {
          setData(res);
        }
      });
    },
    [options],
  );

  useDeepCompareEffect(() => {
    if (api) {
      handleGetData(options?.params);
    }
  }, [api, options?.params]);

  return [data, getDataLoading, handleGetData, setData];
};

export default useFetchData;
