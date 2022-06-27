import type { FormInstance, FormItemProps } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import styles from './index.less';

export type RemoteQueryFormItem = FormItemProps & {
  render?: (form: FormInstance<any>) => React.ReactNode;
};

export interface RemoteQueryFormProps {
  fields: RemoteQueryFormItem[];
  onSearch: (data: any) => void;
  onChange?: (data: any) => void;
}

export const RemoteQueryForm: React.FC<RemoteQueryFormProps> = ({
  fields,
  onSearch,
  onChange = () => {},
}) => {
  const [form] = Form.useForm();
  return (
    <div className={styles.remoteQueryForm}>
      <Form
        form={form}
        onFinish={onSearch}
        onValuesChange={() => {
          onChange(form.getFieldsValue());
        }}
      >
        <Space wrap align="center">
          {fields.map(({ render, ...rest }) => {
            return (
              <Form.Item {...rest} key={JSON.stringify(rest.name)} noStyle>
                {render ? (
                  render(form)
                ) : (
                  <Input placeholder={'请输入' + rest.label} />
                )}
              </Form.Item>
            );
          })}

          <Form.Item noStyle>
            <Button type="primary" htmlType="submit">
              查找
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default RemoteQueryForm;
