import regExps from '@/utils/regExps';
import { Form, Input } from 'antd';
import type { FormComponentProps } from '..';
import styles from './index.less';

export interface ChangePasswordFormData {
  password: string;
  newPassword: string;
}

export const ChangePasswordForm: React.FC<FormComponentProps> = ({
  formProps,
}) => {
  return (
    <div className={styles.changePasswordForm}>
      <div className={styles.title}>修改密码</div>
      <Form {...formProps} labelCol={{ span: 8 }}>
        <Form.Item
          name="password"
          label="原密码"
          rules={[{ required: true, message: '请输入原密码!' }]}
        >
          <Input type="password" placeholder="请输入原始密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码!' },
            {
              pattern: regExps.password,
              message:
                '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
            },
          ]}
        >
          <Input type="password" placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          name="newPasswordCheck"
          label="确认密码密码"
          rules={[
            { required: true, message: '请再次输入密码!' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || value === getFieldValue('newPassword')) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码输入不一致');
              },
            }),
          ]}
        >
          <Input type="password" placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
