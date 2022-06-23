import { useFetch, usePagination } from '@/hooks';
import type { ListResponse } from '@/types/response';
import type { Api } from '@/utils/apis';
import { Pagination, Table, TableProps } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDeepCompareCallback } from 'use-deep-compare';
import ColumnSpace from '../ColumnSpace';
import type { RemoteQueryFormItem } from '../RemoteQueryForm';
import RemoteQueryForm from '../RemoteQueryForm';

interface RemoteTableProps extends Omit<TableProps<any>, 'pagination'> {
  api: Api;
  params?: Record<string, any>;
  queryFields?: RemoteQueryFormItem[];
}

export interface RemoteTableImperativeHandle {
  refresh: () => void;
}

export const RemoteTable = forwardRef<
  RemoteTableImperativeHandle,
  RemoteTableProps
>(({ api, params, queryFields, ...rest }, ref) => {
  const [tableData, setTableData] = useState<ListResponse>({
    list: [],
    totalCount: 0,
  });

  const [getTableData, getTableDataLoading] = useFetch<ListResponse>(api);

  const [{ page, pageSize }, setPagination] = usePagination();

  const [query, setQuery] = useState({});

  /**
   * 刷新表格
   * @param query 请求参数
   */
  const handleRefreshTableData = () => {
    if (page === 1) {
      getTableData({ ...params, ...query, page: 1, pageSize }).then((res) => {
        if (res) setTableData(res);
      });
    } else {
      setPagination(1);
    }
  };

  const handleGetTableData = useDeepCompareCallback(() => {
    getTableData({ ...params, ...query, page, pageSize }).then((res) => {
      if (res) setTableData(res);
    });
  }, [params, query, page, pageSize]);

  useEffect(() => {
    handleGetTableData();
  }, [page, pageSize]);

  useImperativeHandle(ref, () => {
    return {
      refresh: handleRefreshTableData,
    };
  });

  return (
    <ColumnSpace>
      {queryFields && (
        <RemoteQueryForm
          fields={queryFields}
          onSearch={handleRefreshTableData}
          onChange={setQuery}
        />
      )}
      <Table
        loading={getTableDataLoading}
        dataSource={tableData.list}
        pagination={false}
        {...rest}
      />
      <div style={{ textAlign: 'right' }}>
        <Pagination
          showSizeChanger
          current={page}
          onChange={(newPage, newPageSize) => {
            setPagination(newPage, newPageSize);
          }}
          pageSize={pageSize}
          total={tableData.totalCount}
        />
      </div>
    </ColumnSpace>
  );
});

export default RemoteTable;
