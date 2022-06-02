import { UploadMask } from '@/components';
import { DEFAULT_AVATAR } from '@/components/Avatar';
import regExps from '@/utils/regExps';
import { Avatar, Form, Input, Space } from 'antd';
import type { FormComponentProps } from '..';
import styles from './index.less';

export interface SignUpFormData {
  name: string;
  password: string;
  checkPassword: string;
  email: string;
  phone: string;
}

const AvatarUploader = ({ onChange = () => {}, value = '' }) => {
  return (
    <UploadMask
      onSuccess={onChange}
      uploadOptions={{
        accept: 'image/*,.gif',
      }}
    >
      <Avatar size={100} src={value || DEFAULT_AVATAR} />
    </UploadMask>
  );
};

export const SignUpForm: React.FC<FormComponentProps> = ({ formProps }) => {
  return (
    <div className={styles.signUpForm}>
      <div className={styles.title}>欢迎注册Luopc1218-Blogs</div>
      <Form
        {...formProps}
        labelCol={{ span: 6 }}
        autoComplete="none"
        aria-autocomplete="none"
      >
        <div className={styles.signUpFormBody}>
          <Space direction="vertical" align="center">
            <Form.Item name="avatarUrl" noStyle>
              <AvatarUploader />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: '请输入用户名!' }]}
              name="name"
              label={null}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Space>
          <div style={{ flex: 1 }}>
            <Form.Item
              rules={[
                { required: true, message: '请输入密码!' },
                {
                  pattern: regExps.password,
                  message:
                    '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
                },
              ]}
              name="password"
              label="密码"
            >
              <Input
                onChange={() => {
                  formProps.ref.current?.validateFields(['checkPassword']);
                }}
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item
              required
              rules={[
                { required: true, message: '请再次输入密码!' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || value === getFieldValue('password')) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致');
                  },
                }),
              ]}
              name="checkPassword"
              label="确认密码"
            >
              <Input type="password" placeholder="请输入确认密码" />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: '请输入手机号!' },
                { pattern: regExps.phone, message: '请输入正确的手机号!' },
              ]}
              name="phone"
              label="手机号"
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              rules={[
                { pattern: regExps.email, message: '请输入正确的邮箱地址!' },
              ]}
              name="email"
              label="邮箱"
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};
