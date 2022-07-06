import { useFetch, useFetchData } from '@/hooks';
import type { Notice } from '@/types/notice';
import { formatTime } from '@/utils';
import apis from '@/utils/apis';
import { Space } from 'antd';
import { useEffect } from 'react';
import { Link, useDispatch } from 'umi';
import ColumnSpace from '../ColumnSpace';
import LoadingContainer from '../LoadingContainer';
import { RichTextViewer } from '../RichTextEditor';

export interface NoticeViewerProps {
  noticeId: number;
}

export const NoticeViewer: React.FC<NoticeViewerProps> = ({ noticeId }) => {
  const [noticeInfo, getNoticeInfoLoading] = useFetchData<Notice>(
    apis.getNoticeById,
    {
      params: {
        noticeId,
      },
    },
  );

  const dispatch = useDispatch();

  const [readNotice] = useFetch(apis.readNotice);

  useEffect(() => {
    if (noticeInfo && !noticeInfo.isRead) {
      readNotice({ noticeId: noticeId }).then((res) => {
        console.log(res);

        if (res) {
          dispatch({ type: 'notice/getNoticeList' });
        }
      });
    }
  }, [noticeInfo]);

  return (
    <LoadingContainer loading={getNoticeInfoLoading} empty={!noticeInfo}>
      {noticeInfo && (
        <ColumnSpace>
          {noticeInfo.from && (
            <Space>
              <Link to={`/profile?id=${noticeInfo.from}`}>
                {noticeInfo.fromName}
              </Link>
              <div>回复了您：</div>
            </Space>
          )}
          <div style={{ color: '#969696' }}>
            {formatTime(noticeInfo.createTime)}
          </div>
          <RichTextViewer html={noticeInfo.content} />
        </ColumnSpace>
      )}
    </LoadingContainer>
  );
};

export const showNotice = (noticeId: number) => {
  window.modal?.info({
    closable: true,
    width: '50%',
    icon: null,
    title: '消息查看',
    content: <NoticeViewer noticeId={noticeId} />,
    okButtonProps: {
      style: { display: 'none' },
    },
  });
};

export default NoticeViewer;
