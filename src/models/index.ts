import { useModifySetState } from '@/hooks';
import { useCallback, useState } from 'react';
import { useDeepCompareCallback } from 'use-deep-compare';

export interface GlobalState {
  pagePath: { title: string; path: string }[];
  sysConfig: any;
  theme: string;
  siderVisible: boolean;
}

export default () => {
  const [state, setState] = useState<GlobalState>({
    pagePath: [],
    sysConfig: {
      title: 'luopc1218blogs',
    },
    theme: localStorage.getItem('theme') || '',
    siderVisible: true,
  });

  const modifySetState = useModifySetState(setState);

  const changePagePath = useCallback((pagePath: any[]) => {
    modifySetState('pagePath', pagePath);
  }, []);
  const changeTheme = useCallback((theme: string) => {
    modifySetState('theme', theme);
  }, []);
  const changeEnableSider = useDeepCompareCallback(() => {
    modifySetState('siderVisible', !state.siderVisible);
  }, [state.siderVisible]);
  return { state, changePagePath, changeTheme, changeEnableSider };
};
