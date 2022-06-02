import { useFetch } from '@/hooks';
import type { Api } from '@/utils/apis';
import type { TableProps } from 'antd';
import { Table } from 'antd';

interface RemoteTableProps extends TableProps<any> {
  api: Api;
  params?: Record<string, any>;
}

interface TableData {
  data: any[];
  totalcount: number;
}

export const RemoteTable: React.FC<RemoteTableProps> = ({
  api,
  params,
  columns,
}) => {
  const [fetchData = { data: [], totalcount: 0 }, getFetchLoading] =
    useFetch<TableData>(api, params);
  const { data } = fetchData;
  return (
    <Table loading={getFetchLoading} dataSource={data} columns={columns} />
  );
};

export default RemoteTable;
