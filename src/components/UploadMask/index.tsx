import { Upload } from '@/components';
import { LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Space } from 'antd';
import { useState } from 'react';
import styles from './index.less';

interface UploadMaskProps {
  mask?: boolean;
  title?: string;
  uploadOptions?: UploadProps;
  onSuccess?: (url: string) => void;
  disabled?: boolean;
}

export const UploadMask: React.FC<UploadMaskProps> = ({
  mask = true,
  title = '点击上传',
  onSuccess,
  uploadOptions,
  disabled = false,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  if (disabled) return <div className={`${styles.uploadMask}`}>{children}</div>;

  return (
    <div className={`${styles.uploadMask}`}>
      <Upload
        maxCount={1}
        disabled={loading}
        showUploadList={false}
        {...uploadOptions}
        onChange={(e) => {
          console.log(e);

          const { status, response } = e.file;
          if (status === 'uploading') {
            setLoading(true);
          } else {
            setLoading(false);
          }
          if (status === 'done') {
            onSuccess?.(response);
          }
        }}
      >
        {loading && (
          <div className={styles.loading}>
            <Space align="center">
              <LoadingOutlined />
              请稍后
            </Space>
          </div>
        )}
        {!loading && mask && (
          <div className={styles.mask}>
            <div className={styles.title}>{title}</div>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </Upload>
    </div>
  );
};

export default UploadMask;
