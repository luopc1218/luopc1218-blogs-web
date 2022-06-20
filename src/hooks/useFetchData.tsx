import type { Api } from '@/utils/apis';
import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import useFetch from './useFetch';

export const useFetchData = <T = any,>(
  api?: Api | undefined | false,
  params?: Record<string, any> | FormData,
  defaultValues?: T,
): [
  T | undefined,
  boolean,
  (newParams?: any) => any,
  React.Dispatch<React.SetStateAction<T | undefined>>,
] => {
  const [data, setData] = useState<T | undefined>(defaultValues);

  const [getData, getDataLoading] = useFetch(api);
  useDeepCompareEffect(() => {
    if (api) {
      getData(params).then(setData);
    }
  }, [api, params]);

  return [data, getDataLoading, getData, setData];
};

export default useFetchData;
