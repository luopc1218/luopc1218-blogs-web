import { parseJsonToUrl, parseUrlToJson } from '@/utils';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'umi';

type UrlParams = Record<string, string>;

export const useUrlParams = (): [UrlParams, any, string] => {
  const history = useHistory();
  const { search, pathname } = history.location;

  const urlParams: UrlParams = useMemo(
    () => (!!search ? parseUrlToJson(search) : {}),
    [search],
  );
  const setUrlParams = useCallback(
    (obj, overwrite = false) => {
      const newUrlParams = parseJsonToUrl(
        overwrite ? obj : { ...urlParams, ...obj },
      );
      history.replace(pathname + '?' + newUrlParams);
    },
    [history, pathname, urlParams],
  );
  return [urlParams, setUrlParams, pathname];
};
export default useUrlParams;
