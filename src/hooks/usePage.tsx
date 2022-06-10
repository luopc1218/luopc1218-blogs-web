import { useDispatch } from 'umi';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface UsePageProps {
  pagePath: { path: string; title: string }[];
}

export const usePage = (props: UsePageProps) => {
  const { pagePath = [] } = props;
  const dispatch = useDispatch();
  useDeepCompareEffect(() => {
    dispatch({
      type: 'global/changePagePath',
      payload: pagePath,
    });
  }, [pagePath]);
};
