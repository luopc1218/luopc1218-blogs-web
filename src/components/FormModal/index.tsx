import type { FormProps, ModalFuncProps, FormInstance } from 'antd';
import { Modal } from 'antd';
import React from 'react';
export * from './SignInForm';
export * from './SignUpForm';
export * from './ChangePasswordForm';

export interface FormComponentProps extends FormProps {
  formProps: FormProps & {
    ref: React.RefObject<FormInstance<any>>;
  };
}
interface FormModalProps {
  FormComponent: React.FC;
  modalProps?: ModalFuncProps;
}

// 表单式对话框
export class FormModal extends React.Component<FormModalProps> {
  /**
   * api式表单式对话框
   * @param FormComponent 表单组件
   * @param callback 回调（values：表单数据，reslove：提交成功调用关闭modal，reject：提交失败调用保留modal，不调用则会一直保留loading状态）
   * @param modalProps Modal参数
   * @param singleModalKey 独立modal的唯一key，传入则不会重复生成相同modal
   * @returns modal实体
   */
  static open<T>(
    FormComponent: React.FC<FormComponentProps>,
    callback: (
      formData: T,
      reslove: (value: void | PromiseLike<void>) => void,
      reject: (reason?: any) => void,
    ) => void,
    modalProps?: ModalFuncProps,
    singleModalKey?: string | undefined,
  ) {
    const formRef = React.createRef<FormInstance>();
    // 为了获取context使用封装的modal
    // 查看layout/index.tsx
    const modal = window.modal?.confirm({
      ...modalProps,
      content: (
        <FormComponent
          formProps={{
            ref: formRef,
          }}
        />
      ),
      icon: null,
      onOk() {
        return new Promise<void>((reslove, reject) => {
          formRef?.current
            ?.validateFields()
            .then((values) => {
              callback(values, reslove, reject);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      onCancel() {
        if (!!singleModalKey) {
          delete (window as any)[`formModal-${singleModalKey}`];
        }
      },
      getContainer: document.getElementById('root-layout') || document.body,
    });

    if (!!singleModalKey) {
      (window as any)[`formModal-${singleModalKey}`] = modal;
    }
    return modal;
  }

  render() {
    return (
      <Modal {...this.props.modalProps}>
        <this.props.FormComponent />
      </Modal>
    );
  }
}
