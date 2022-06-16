import { ListResponse } from '@/types/response';
import { useState } from 'react';

export type UsePaginationList<T = any> = (
  defaultValue?: ListResponse<T>,
) => [T, React.Dispatch<React.SetStateAction<ListResponse<T>>>];

export const usePaginationList: UsePaginationList = (
  defaultValue = { list: [], totalCount: 0 },
) => {
  const [paginationListData, setPaginationListData] = useState(defaultValue);
  return [paginationListData, setPaginationListData];
};

export default usePaginationList;
