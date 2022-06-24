import { Breadcrumb, Footer, Header, NoticeDrawer, Sider } from '@/components';
import { GlobalModelState, ModelMap } from '@/models';
import { Affix, ConfigProvider, Layout, Modal } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useMemo } from 'react';
import { Outlet, useDispatch, useSelector } from 'umi';
import {useModel} from '@umijs/max'
import styles from './index.less';

declare global {
  interface Window {
    modal: any;
  }
}

export const LayoutContainer: React.FC = ({}) => {
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
  }, [modal]);

  console.log(globalModelState);

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
      {/* <Helmet>
        <title>{title}</title>
      </Helmet> */}
      <Layout className={styles.layout} id="root-layout">
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <div>
          <Breadcrumb />
        </div>
        <Layout style={{ padding: '0 1rem' }}>
          <Layout.Content className={styles.content}>
            <Outlet />
          </Layout.Content>
          {globalModelState.siderVisible && <Sider />}
        </Layout>
        <Footer />
      </Layout>

      {contextHolder}
      <NoticeDrawer />
    </ConfigProvider>
  );
};

export default LayoutContainer;
