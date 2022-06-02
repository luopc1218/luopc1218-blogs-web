import type { SpaceProps } from 'antd';
import { Space } from 'antd';
import { useMemo } from 'react';

export const ColumnSpace: React.FC<SpaceProps> = (props) => {
  const spaceProps = useMemo<SpaceProps>(() => {
    return {
      style: {
        width: '100%',
      },
      direction: 'vertical',
      ...props,
    };
  }, [props]);
  return <Space {...spaceProps}>{props.children}</Space>;
};

export default ColumnSpace;
