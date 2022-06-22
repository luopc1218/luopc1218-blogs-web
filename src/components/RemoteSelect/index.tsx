import { useFetchData } from '@/hooks';
import type { Api } from '@/utils/apis';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import styles from './index.less';

export interface RemoteSelectProps extends SelectProps {
  api: Api;
  params?: any;
  keyName: string;
  valueName: string;
}
export const RemoteSelect: React.FC<RemoteSelectProps> = ({
  api,
  params = {},
  keyName,
  valueName,
  ...rest
}) => {
  const [optionList, getOptionListLoading] = useFetchData<any[]>(api, {
    params,
    defaultValues: [],
  });

  return (
    <Select
      {...rest}
      loading={getOptionListLoading}
      allowClear
      className={styles.remoteSelect}
      optionFilterProp="label"
      options={optionList?.map((option) => {
        return {
          label: option[keyName],
          value: option[valueName],
        };
      })}
    />
  );
};
export default RemoteSelect;
