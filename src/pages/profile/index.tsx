import { Avatar, FormModal, UploadMask } from '@/components';
import type { ChangePasswordFormData } from '@/components/FormModal';
import { ChangePasswordForm } from '@/components/FormModal';
import { usePage, useUrlParams } from '@/hooks';
import type { ModelMap } from '@/models';
import { Button, Descriptions, message, Modal, Space, Spin, Tabs } from 'antd';
import { useCallback, useMemo } from 'react';
import type { UserModelState } from 'umi';
import { useDispatch, useSelector } from 'umi';
import styles from './index.less';

export const ProfilePage = () => {
  const [urlParams] = useUrlParams();

  const userModelState: UserModelState = useSelector<ModelMap, UserModelState>(
    (state: ModelMap) => state.user,
  );
  const isMe = useMemo(
    () =>
      !urlParams.userId ||
      parseInt(urlParams.userId) === userModelState.userInfo?.id,
    [urlParams.userId, userModelState.userInfo?.id],
  );
  const dispatch = useDispatch();
  const userInfo = useMemo(() => userModelState.userInfo, [userModelState]);
  const loading = useMemo<boolean>(
    () =>
      userModelState.checkSignInLoading || userModelState.getUserInfoLoading,
    [userModelState.checkSignInLoading, userModelState.getUserInfoLoading],
  );
  usePage({ pagePath: [{ path: '/profile', title: '个人信息' }] });

  // 监听修改头像
  const handleChangeAvatar = useCallback<(url: string) => void>(
    (url) => {
      dispatch({
        type: 'user/changeAvatar',
        payload: url,
      });
    },
    [dispatch],
  );

  // 监听修改密码
  const handleChangePassword = useCallback(() => {
    FormModal.open<ChangePasswordFormData>(
      ChangePasswordForm,
      (changePasswordFormData, reslove, reject) => {
        Modal.confirm({
          title: '确定修改密码?',
          content: '修改后需要重新登陆',
          type: 'warning',
          onOk() {
            dispatch({
              type: 'user/changePassword',
              payload: {
                changePasswordFormData,
                reslove,
                reject,
              },
            });
          },
          onCancel() {
            reject();
          },
        });
      },
    );
  }, [dispatch]);

  const handleChangePhone = useCallback(() => {
    message.error('暂不支持');
  }, []);

  const handleChangeEmail = useCallback(() => {
    message.error('暂不支持');
  }, []);

  if (!userInfo) return null;

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" className={`page ${styles.profilePage}`}>
        <div className={`module ${styles.summary}`}>
          <Space align="center">
            <Space direction="vertical" align="center">
              <UploadMask
                onSuccess={handleChangeAvatar}
                uploadOptions={{
                  accept: 'image/*,.gif',
                }}
              >
                <Avatar
                  user={userModelState.userInfo}
                  size={128}
                  shape="square"
                />
              </UploadMask>
            </Space>
            <Descriptions title={userInfo.name} className={styles.summary}>
              <Descriptions.Item label="电话">
                {userInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="电子邮箱">
                {userInfo.email}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </div>
        <div className={`module ${styles.details}`}>
          {isMe && (
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="偏好设置" key="setting">
                <Space>
                  <Button onClick={handleChangePassword}>修改密码</Button>
                  <Button onClick={handleChangePhone}>修改手机号</Button>
                  <Button onClick={handleChangeEmail}>修改电子邮箱</Button>
                </Space>
              </Tabs.TabPane>
            </Tabs>
          )}
        </div>
      </Space>
    </Spin>
  );
};

export default ProfilePage;

