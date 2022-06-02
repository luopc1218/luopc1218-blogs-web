import type { Pagination } from '@/types/pagination';
import { useCallback, useState } from 'react';

/**
 * 分页数据管理
 * @param defaultPage 默认页码
 * @param defaultPageSize 默认分页规格
 */
export const usePagination = (
  defaultPage: number = 1,
  defaultPageSize: number = 20,
): [Pagination, (newPage: number, newPageSize: number) => void] => {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const setPagination = useCallback(
    (newPage: number, newPageSize: number): void => {
      setPage(newPage);
      if (newPageSize) {
        setPageSize(newPageSize);
      }
    },
    [],
  );
  return [
    {
      page,
      pageSize,
    },
    setPagination,
  ];
};
