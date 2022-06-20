import { Button, Form, FormInstance, FormItemProps, Input, Space } from 'antd';

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
    <div>
      <Form
        form={form}
        onFinish={onSearch}
        onValuesChange={() => {
          onChange(form.getFieldsValue());
        }}
      >
        <Space wrap>
          {fields.map(({ render, ...rest }) => {
            return (
              <Form.Item {...rest} key={JSON.stringify(rest.name)}>
                {render ? (
                  render(form)
                ) : (
                  <Input placeholder={'请输入' + rest.label} />
                )}
              </Form.Item>
            );
          })}

          <Form.Item>
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
