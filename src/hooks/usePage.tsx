import type { ModelMap, UserModelState } from 'umi';
import { useDispatch, history, useSelector } from 'umi';
import { useDeepCompareEffect } from 'use-deep-compare';

interface UsePageProps {
  pagePath: { path: string; title: string }[];
  siderVisible?: boolean;
  signInRequire?: boolean;
}

export const usePage = (props: UsePageProps) => {
  const { pagePath = [], siderVisible = true, signInRequire = false } = props;
  ;
  const userModelState: UserModelState = useSelector(
    (state: ModelMap) => state.user,
  );
  const dispatch = useDispatch();
  useDeepCompareEffect(() => {
    if (signInRequire && !userModelState.userInfo) {
      history.replace('/404');
    } else {
      dispatch({
        type: 'global/changePagePath',
        payload: pagePath,
      });
      dispatch({
        type: 'global/changeEnableSider',
        payload: siderVisible,
      });
    }
  }, [pagePath, siderVisible, signInRequire, userModelState.userInfo]);
};
