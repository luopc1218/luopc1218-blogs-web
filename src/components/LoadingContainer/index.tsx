import { Empty } from '@/components';
import { Spin } from 'antd';

export interface LoadingContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  loading: boolean;
  empty?: boolean;
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
  ...rest
}) => {
  return (
    <div {...rest}>
      <Spin spinning={loading}>{empty ? <Empty /> : children}</Spin>
    </div>
  );
};

export default LoadingContainer;
