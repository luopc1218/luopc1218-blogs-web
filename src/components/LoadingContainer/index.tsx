import { Empty } from '@/components';
import { Spin } from 'antd';

export interface LoadingContainerProps {
  loading: boolean;
  empty?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 加载容器
 * @param loading loading状态
 * @param empty 是否为空数据
 */
export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  loading,
  empty,
  children,
  className,
  style,
}) => {
  return (
    <div className={className} style={style}>
      <Spin spinning={loading}>{empty ? <Empty /> : children}</Spin>
    </div>
  );
};

export default LoadingContainer;
