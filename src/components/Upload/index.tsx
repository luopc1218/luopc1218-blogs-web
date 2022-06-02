import { fileService } from '@/services/file';
import type { UploadProps as AntdUploadProps } from 'antd';
import { Upload as AntdUpload, notification, Progress } from 'antd';
import { useMemo } from 'react';

const accessToken: string = localStorage.getItem('accessToken') || '';

interface UploadProps extends AntdUploadProps {
  onSuccess?: (url: string) => any;
}

export const Upload: React.FC<UploadProps> = ({
  children,
  onSuccess,
  ...rest
}) => {
  const uploadConfig = useMemo<AntdUploadProps>(
    () => ({
      async customRequest(e) {
        const uploadNotificationKey: string = `upload-no.${new Date().getTime()}`;
        const openUploadNotification = (progress: number): void => {
          notification.open({
            key: uploadNotificationKey,
            message: '图片上传中，请稍后',
            description: <Progress percent={progress} status="active" />,
            duration: 0,
            placement: 'bottomRight',
          });
        };
        openUploadNotification(0);
        let progress: number = 0;
        const progressInterval = setInterval(() => {
          progress += parseInt((Math.random() * 10).toFixed(0));
          if (progress >= 99) {
            progress = 99;
            return;
          }
          openUploadNotification(progress);
          e.onProgress?.({
            percent: progress,
          });
        }, 1000);
        try {
          const res = await fileService.upload(e.file);
          clearInterval(progressInterval);
          notification.open({
            key: uploadNotificationKey,
            message: '上传成功',
            description: <Progress percent={100} status="success" />,
            placement: 'bottomRight',
          });
          e.onSuccess?.(res);
        } catch (error: any) {
          clearInterval(progressInterval);
          notification.open({
            key: uploadNotificationKey,
            message: '上传失败，请稍后重试',
            description: <Progress percent={progress} status="exception" />,
            duration: 0,
            placement: 'bottomRight',
          });
          e.onError?.(error);
        }
      },
      onChange(e) {
        const { status, response } = e.file;
        if (status === 'done') {
          onSuccess?.(response);
        }
      },
      ...rest,
    }),
    [onSuccess, rest],
  );

  return (
    <AntdUpload disabled={!accessToken} {...uploadConfig}>
      {children}
    </AntdUpload>
  );
};
export default Upload;
