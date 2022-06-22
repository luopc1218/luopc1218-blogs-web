import { Avatar, FormModal, LoadingContainer, UploadMask } from '@/components';
import type { ChangePasswordFormData } from '@/components/FormModal';
import { ChangePasswordForm } from '@/components/FormModal';
import { useFetch, usePage, useUrlParams } from '@/hooks';
import type { ModelMap } from '@/models';
import type { User } from '@/types/user';
import apis from '@/utils/apis';
import { Button, Descriptions, message, Modal, Space, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import type { UserModelState } from 'umi';
import { useDispatch, useSelector } from 'umi';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { ArticleList, MyCollect } from './components';
import styles from './index.less';

export const ProfilePage = () => {
  const [urlParams, setUrlParams] = useUrlParams();

  const { userId, tab = 'setting' } = urlParams;

  const userModelState: UserModelState = useSelector<ModelMap, UserModelState>(
    (state: ModelMap) => state.user,
  );
  const isMe = useMemo(() => {
    return !userId || parseInt(userId) === userModelState.userInfo?.id;
  }, [userId, userModelState.userInfo?.id]);
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);
  const [getUserInfo, getUserInfoLoading] = useFetch(
    !isMe && apis.getUserInfo,
    {
      defaultParams: {
        id: userId,
      },
      callback: (res) => {
        // console.log(res);
        setUserInfo(res);
      },
    },
  );
  useDeepCompareEffect(() => {
    if (isMe) {
      setUserInfo(userModelState.userInfo);
    } else {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMe, userModelState]);

  const dispatch = useDispatch();
  const loading = useMemo<boolean>(
    () =>
      userModelState.checkSignInLoading ||
      userModelState.getUserInfoLoading ||
      getUserInfoLoading,
    [
      getUserInfoLoading,
      userModelState.checkSignInLoading,
      userModelState.getUserInfoLoading,
    ],
  );
  usePage({
    pagePath: [{ path: '/profile', title: '个人信息' }],
    siderVisible: false,
  });

  // 监听修改头像
  const handleChangeAvatar = (url: string) => {
    dispatch({
      type: 'user/changeAvatar',
      payload: url,
    });
  };

  // 监听修改密码
  const handleChangePassword = () => {
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
  };

  const handleChangePhone = () => {
    message.error('暂不支持');
  };

  const handleChangeEmail = () => {
    message.error('暂不支持');
  };

  if (!userInfo) return null;

  return (
    <LoadingContainer loading={loading} empty={!userInfo}>
      <Space direction="vertical" className={`page ${styles.profilePage}`}>
        <div className={`module ${styles.summary}`}>
          <Space align="center">
            <Space direction="vertical" align="center">
              <UploadMask
                disabled={!isMe}
                onSuccess={handleChangeAvatar}
                uploadOptions={{
                  accept: 'image/*,.gif',
                }}
              >
                <Avatar user={userInfo} size={128} shape="square" />
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
          <Tabs
            defaultActiveKey={tab}
            onChange={(key) => {
              setUrlParams({ tab: key });
            }}
          >
            <Tabs.TabPane
              key="articleList"
              tab={isMe ? '我的文章' : '文章列表'}
            >
              <ArticleList isMe={isMe} />
            </Tabs.TabPane>
            {isMe && (
              <Tabs.TabPane key="myCollect" tab="我的收藏">
                <MyCollect />
              </Tabs.TabPane>
            )}
            {isMe && (
              <Tabs.TabPane tab="偏好设置" key="setting">
                <Space>
                  <Button onClick={handleChangePassword}>修改密码</Button>
                  <Button onClick={handleChangePhone}>修改手机号</Button>
                  <Button onClick={handleChangeEmail}>修改电子邮箱</Button>
                </Space>
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      </Space>
    </LoadingContainer>
  );
};

export default ProfilePage;
