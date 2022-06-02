import { useEffect } from 'react';
import { useDispatch } from 'umi';

interface UsePageProps {
  pagePath: { path: string; title: string }[];
}

export const usePage = (props: UsePageProps) => {
  const { pagePath = [] } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'global/changePagePath',
      payload: pagePath,
    });
  }, [dispatch, pagePath]);
};
