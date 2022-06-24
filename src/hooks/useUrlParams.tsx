import { parseJsonToUrl, parseUrlToJson } from '@/utils';
import { useMemo } from 'react';
import { history } from 'umi';

type UrlParams = Record<string, string>;

export const useUrlParams = (): [UrlParams, any, string] => {
  ;
  const { search, pathname } = history.location;

  const urlParams: UrlParams = useMemo(
    () => (!!search ? parseUrlToJson(search) : {}),
    [search],
  );
  const setUrlParams = (obj: any, overwrite = false) => {
    const newUrlParams = parseJsonToUrl(
      overwrite ? obj : { ...urlParams, ...obj },
    );
    history.replace(pathname + '?' + newUrlParams);
  };

  return [urlParams, setUrlParams, pathname];
};
export default useUrlParams;
