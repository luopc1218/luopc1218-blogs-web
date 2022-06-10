import { Breadcrumb, Footer, Header, Sider } from '@/components';
import { Affix, ConfigProvider, Layout, Modal } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'quill/dist/quill.snow.css';
import React, { useEffect } from 'react';
import type { GlobalModelState, ModelMap } from 'umi';
import { useDispatch, useSelector } from 'umi';
import styles from './index.less';

declare global {
  interface Window {
    modal: any;
  }
}

export const LayoutContainer: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [modal, contextHolder] = Modal.useModal();
  const globalModelState: GlobalModelState = useSelector(
    (state: ModelMap) => state.global,
  );

  useEffect(() => {
    window.modal = modal;
    dispatch({
      type: 'user/checkSignIn',
    });
  }, [dispatch, modal]);

  ConfigProvider.config({
    theme: {
      primaryColor: globalModelState.theme.primaryColor,
    },
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className={styles.layout} id="root-layout">
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <div>
          <Breadcrumb />
        </div>
        <Layout style={{ padding: '0 1rem' }}>
          <Layout.Content className={styles.content}>{children}</Layout.Content>
          <Sider />
        </Layout>
        <Footer />
      </Layout>

      {contextHolder}
    </ConfigProvider>
  );
};

export default LayoutContainer;
