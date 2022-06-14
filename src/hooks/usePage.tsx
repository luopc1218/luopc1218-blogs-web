import { useDispatch } from 'umi';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface UsePageProps {
  pagePath: { path: string; title: string }[];
  siderVisible?: boolean;
}

export const usePage = (props: UsePageProps) => {
  const { pagePath = [], siderVisible = true } = props;
  const dispatch = useDispatch();
  useDeepCompareEffect(() => {
    dispatch({
      type: 'global/changePagePath',
      payload: pagePath,
    });
    dispatch({
      type: 'global/changeEnableSider',
      payload: siderVisible,
    });
  }, [pagePath, siderVisible]);
};
