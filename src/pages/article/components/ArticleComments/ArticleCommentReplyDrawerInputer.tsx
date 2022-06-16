import { ColumnSpace, RichTextEditor } from '@/components';
import type { DrawerProps } from 'antd';
import { Button, Drawer } from 'antd';
import { useState } from 'react';

export interface ReplyDrawerInputerProps {
  onConfirm: (content: string, to?: number) => Promise<any>;
  onClose: () => void;
  toName?: string;
  loading?: boolean;
  drawerProps?: DrawerProps;
}
export const ReplyDrawerInputer: React.FC<ReplyDrawerInputerProps> = ({
  onConfirm,
  toName = '',
  drawerProps,
  onClose,
  loading,
}) => {
  const [content, setContent] = useState('');

  const handleClose = () => {
    setContent('');
    onClose();
  };
  return (
    <Drawer {...drawerProps} title="回复" onClose={handleClose} destroyOnClose>
      <ColumnSpace>
        <RichTextEditor
          onChange={setContent}
          value={content}
          placeholder={`回复 ${toName}：`}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            disabled={!content}
            loading={loading}
            type="primary"
            onClick={async () => {
              try {
                await onConfirm(content);
                setContent('');
                handleClose();
              } catch (error) {
                handleClose();
              }
            }}
          >
            发送
          </Button>
        </div>
      </ColumnSpace>
    </Drawer>
  );
};

export default ReplyDrawerInputer;
