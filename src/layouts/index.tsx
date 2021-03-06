import { Breadcrumb, Footer, Header, NoticeDrawer, Sider } from '@/components';
import {
  Affix,
  ConfigProvider,
  Layout,
  Modal,
  notification as AntdNotification,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import type { ModalStaticFunctions } from 'antd/lib/modal/confirm';
import { NotificationApi } from 'antd/lib/notification';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useMemo } from 'react';
import type { GlobalModelState, ModelMap } from 'umi';
import { Helmet, useDispatch, useSelector } from 'umi';
import styles from './index.less';

declare global {
  interface Window {
    modal: Omit<ModalStaticFunctions, 'warn'>;
    notification: NotificationApi;
  }
}

export const LayoutContainer: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [modal, modalContextHolder] = Modal.useModal();
  const [notification, notificationContextHolder] =
    AntdNotification.useNotification();

  const globalModelState: GlobalModelState = useSelector(
    (state: ModelMap) => state.global,
  );

  useEffect(() => {
    window.modal = modal;
    window.notification = notification;
    dispatch({
      type: 'user/checkSignIn',
    });
  }, [modal, notification]);

  ConfigProvider.config({
    theme: {
      primaryColor: globalModelState.theme,
    },
  });
  const title = useMemo(() => {
    return (
      globalModelState?.sysConfig?.title +
      (globalModelState.titlePath.length > 0 ? '-' : '') +
      globalModelState.titlePath
        .map((item: { path: string; title: string }) => item.title)
        .join('-')
    );
  }, [globalModelState]);

  return (
    <ConfigProvider locale={zhCN}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Layout className={styles.layout} id="root-layout">
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <div>
          <Breadcrumb />
        </div>
        <Layout style={{ padding: '0 1rem' }}>
          <Layout.Content className={styles.content}>{children}</Layout.Content>
          {globalModelState.siderVisible && <Sider />}
        </Layout>
        <Footer />
      </Layout>

      {modalContextHolder}
      {notificationContextHolder}
      <NoticeDrawer />
    </ConfigProvider>
  );
};

export default LayoutContainer;
