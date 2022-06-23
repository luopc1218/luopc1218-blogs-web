import { useFetch, usePagination } from '@/hooks';
import type { ListResponse } from '@/types/response';
import type { Api } from '@/utils/apis';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import LoadingContainer from '../LoadingContainer';

export interface PaginationListProps {
  api: Api;
  params?: any;
  onDataChange?: (data: any) => void;
  render?: (
    data: any,
    setData: React.Dispatch<
      React.SetStateAction<ListResponse<any> | undefined>
    >,
  ) => JSX.Element;
}

export const PaginationList: React.FC<PaginationListProps> = ({
  api,
  params = {},
  onDataChange = () => null,
  render = () => null,
  children,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = usePagination();

  const [data, setData] = useState<ListResponse | undefined>(undefined);

  const noMoreData = useMemo(() => {
    return data && data.list.length >= data.totalCount;
  }, [data]);

  const [getData, getDataLoading] = useFetch(api, {
    callback(res) {
      setData((oldValue) => {
        if (!oldValue) return res;
        const newValue = { ...oldValue };
        newValue.list = [...oldValue?.list, ...res.list];
        return newValue;
      });
    },
  });

  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const handleFetchData = () => {
    getData({ ...pagination, ...params });
  };

  // 第一次请求
  useDeepCompareEffect(() => {
    if (pagination.page !== 1) {
      setPagination(1);
    }
    setData(undefined);
    handleFetchData();
  }, [params]);

  // 后续请求
  useDeepCompareEffect(() => {
    if (pagination.page !== 1) {
      handleFetchData();
    }
  }, [pagination]);

  const handleTouchGround = useCallback(() => {
    if (!noMoreData) {
      setPagination(pagination.page + 1);
    }
  }, [noMoreData, pagination.page, setPagination]);

  const handleScroll = useCallback(
    (e: any) => {
      const listElement: HTMLDivElement | null = listRef.current;
      const bodyElement = e.target.documentElement;

      if (
        listElement &&
        listElement.getBoundingClientRect()?.bottom < bodyElement.clientHeight
      ) {
        handleTouchGround();
      }
    },
    [handleTouchGround],
  );

  useEffect(() => {
    if (!getDataLoading) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [getDataLoading, handleScroll]);

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
};
export default PaginationList;
