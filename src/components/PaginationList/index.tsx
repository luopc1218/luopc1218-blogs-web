import { usePagination } from '@/hooks';
import type { Pagination } from '@/types/pagination';
import { useEffect, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

export interface PaginationListProps {
  disabled: boolean;
  noMoreData: boolean;
  onPageChange: (pagination: Pagination) => void;
}

export const PaginationList: React.FC<PaginationListProps> = ({
  children,
  disabled,
  noMoreData,
  onPageChange,
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
    if (!disabled) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disabled]);

  useDeepCompareEffect(() => {
    onPageChange(pagination);
  }, [pagination]);

  return (
    <div ref={listRef} className="paginationList">
      {children}
    </div>
  );
};
export default PaginationList;
