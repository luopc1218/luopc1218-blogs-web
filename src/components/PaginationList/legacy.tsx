import { usePagination } from '@/hooks';
import type { Pagination } from '@/types/pagination';
import { Divider, Spin } from 'antd';
import { useEffect, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import Empty from '../Empty';

export interface LegacyPaginationListProps {
  noMoreData: boolean;
  onPageChange: (pagination: Pagination) => void;
  loading?: boolean;
  empty?: boolean;
}

export const LegacyPaginationList: React.FC<LegacyPaginationListProps> = ({
  children,
  noMoreData,
  onPageChange,
  loading = false,
  empty = true,
}) => {
  const [pagination, setPagination] = usePagination();

  const listRef = useRef<HTMLDivElement>(null);

  const handleNextPage = () => {
    setPagination(pagination.page + 1);
  };
  const handleTouchGround = () => {
    if (!noMoreData) {
      handleNextPage();
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
    if (!loading) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  useDeepCompareEffect(() => {
    onPageChange(pagination);
  }, [pagination]);

  if (empty && !loading) return <Empty />;
  return (
    <div ref={listRef} className="paginationList">
      {children}
      {loading && (
        <Divider>
          <Spin />
        </Divider>
      )}
      {noMoreData && !loading && <Divider>已经到底了</Divider>}
    </div>
  );
};
export default LegacyPaginationList;
