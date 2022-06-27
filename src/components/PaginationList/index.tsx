import { useFetch, usePagination } from '@/hooks';
import type { ListResponse } from '@/types/response';
import type { Api } from '@/utils/apis';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import LoadingContainer from '../LoadingContainer';

export interface PaginationListProps {
  api: Api;
  params?: any;
  render: (
    data: ListResponse,
    setData: React.Dispatch<React.SetStateAction<ListResponse<any>>>,
  ) => JSX.Element;
}

export interface PaginationListImperative {
  refresh: (newParams: any) => void;
}

export const PaginationList = forwardRef<
  PaginationListImperative,
  PaginationListProps
>(({ api, params = {}, render, children }, ref) => {
  const listRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = usePagination();

  const [data, setData] = useState<ListResponse>({
    list: [],
    totalCount: 0,
  });

  const noMoreData = useMemo(() => {
    return data && data.list.length >= data.totalCount;
  }, [data]);

  const [getData, getDataLoading] = useFetch(api, {
    callback(res) {
      setData((oldValue) => {
        const newValue = { ...oldValue };
        newValue.list = [...oldValue?.list, ...res.list];
        newValue.totalCount = res.totalCount;
        return newValue;
      });
    },
  });

  const handleFetchData = (newParams = {}) => {
    getData({ ...pagination, ...params, ...newParams });
  };

  const handleRefresh = (newParams = {}) => {
    setData({
      list: [],
      totalCount: 0,
    });
    if (pagination.page !== 1) {
      setPagination(1);
      handleFetchData(newParams);
    } else {
      handleFetchData(newParams);
    }
  };

  // 第一次请求
  useDeepCompareEffect(() => {
    handleRefresh();
  }, [params]);

  const handleTouchGround = () => {
    if (!noMoreData) {
      setPagination(pagination.page + 1);
      handleFetchData({
        page: pagination.page + 1,
      });
    }
  };

  const handleScroll = (e: any) => {
    const listElement: HTMLDivElement | null = listRef.current;
    const bodyElement = e.target.documentElement;

    if (
      listElement &&
      listElement.getBoundingClientRect()?.bottom < bodyElement.clientHeight
    ) {
      handleTouchGround();
    }
  };

  useEffect(() => {
    if (!getDataLoading) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [getDataLoading]);

  useImperativeHandle(ref, () => {
    return {
      refresh: handleRefresh,
    };
  });

  return (
    <LoadingContainer
      loading={getDataLoading}
      empty={data && data.list.length <= 0}
      className="paginationList"
    >
      <div ref={listRef}>
        {render(data, setData)}
        {children}
      </div>
    </LoadingContainer>
  );
});
export default PaginationList;
