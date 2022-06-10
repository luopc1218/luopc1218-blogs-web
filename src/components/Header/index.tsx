import { Avatar } from '@/components';
import type { ModelMap } from '@/models';
import type { User } from '@/types/user';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Modal,
  Popover,
  Space,
  Spin,
} from 'antd';
import { useMemo, useState } from 'react';
import { CirclePicker } from 'react-color';
import type { UserModelState } from 'umi';
import { Link, useDispatch, useHistory, useSelector } from 'umi';
import type { SignInFormData } from '../FormModal';
import { FormModal, SignInForm } from '../FormModal';
import styles from './index.less';

interface HeaderUserProps {
  userModelState: UserModelState;
  onSignIn: () => void;
}

const HeaderUser: React.FC<HeaderUserProps> = ({
  userModelState,
  onSignIn,
}) => {
  const loading = useMemo<boolean>(
    () =>
      userModelState.checkSignInLoading || userModelState.getUserInfoLoading,
    [userModelState.checkSignInLoading, userModelState.getUserInfoLoading],
  );
  const userInfo = useMemo<User | undefined>(
    () => userModelState.userInfo,
    [userModelState.userInfo],
  );
  const dispatch = useDispatch();

  if (loading) {
    return <Spin />;
  }
  if (!userInfo) {
    return (
      <div className={styles.user}>
        <Button type="link" onClick={onSignIn}>
          请登录
        </Button>
      </div>
    );
  }

  const handleSignOut = (): void => {
    Modal.confirm({
      type: 'warning',
      content: '确定要注销当前用户吗?',
      onOk() {
        dispatch({
          type: 'user/signOut',
        });
      },
      okButtonProps: {
        danger: true,
      },
    });
  };

  const handleClickUserDropdown = ({ key }: { key: string }): void => {
    switch (key) {
      case 'signOut': {
        handleSignOut();
        break;
      }
    }
  };
  return (
    <div className={styles.user}>
      <Space align="center">
        <Popover
          placement="bottom"
          content={
            <CirclePicker
              onChange={(color) => {
                console.log(color);
                dispatch({
                  type: 'global/changeTheme',
                  payload: color.hex,
                });
              }}
            />
          }
          trigger="click"
        >
          <Button ghost>切换主题</Button>
        </Popover>
        <Avatar user={userInfo} />
        <span>hi {userInfo.name}</span>

        <Dropdown
          trigger={['click']}
          overlay={
            <Menu
              onClick={handleClickUserDropdown}
              items={[
                { label: <Link to="/profile">个人信息</Link>, key: 'profile' },
                {
                  label: '注销',
                  key: 'signOut',
                  danger: true,
                },
              ]}
            />
          }
        >
          <MoreOutlined className={styles.userInfoBtn} />
        </Dropdown>
      </Space>
    </div>
  );
};

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userModelState = useSelector<ModelMap, UserModelState>(
    (state: ModelMap) => {
      return state.user;
    },
  );
  const openSignInForm = () => {
    FormModal.open<SignInFormData>(
      SignInForm,
      (signInFormData, reslove, reject) => {
        dispatch({
          type: 'user/signIn',
          payload: {
            signInFormData,
            reslove,
            reject,
          },
        });
      },
      {
        title: null,
        icon: null,
        okText: '立即登录',
        closable: true,
      },
      'signInForm',
    );
  };

  const [searchWords, setSearchWords] = useState('');
  /**
   * 监听搜索
   * @param string 搜索的字符
   */
  const handleSearch = () => {
    if (!searchWords) {
      history.replace('/?timestamp=' + new Date().getTime());
    } else {
      history.replace(
        '/searchResult?words=' +
          searchWords +
          '&timestamp=' +
          new Date().getTime(),
      );
    }
  };

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Luopc1218-Blogs</Link>
      </div>

      <div className={styles.navigator}>
        <Input.Group compact>
          <Input
            style={{ width: 400 }}
            placeholder="请输入任意关键字"
            value={searchWords}
            onChange={(e) => setSearchWords(e.target.value)}
            onKeyUp={(e) => {
              if (e.code == 'Enter' || e.code == 'NumpadEnter') {
                handleSearch();
              }
            }}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                className={styles.searchBtn}
              />
            }
          />
        </Input.Group>
      </div>
      <HeaderUser userModelState={userModelState} onSignIn={openSignInForm} />
    </Layout.Header>
  );
};

export default Header;
