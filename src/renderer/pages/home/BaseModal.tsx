import type { FC } from 'react';
import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
// import { useDatabase } from '@/hooks';
// import styles from './index.less';

type Props = {
  title: string;
  visible: boolean;
  handleOk: (values: { name: string; ip: string; port: string }) => void;
  handleCancel: () => void;
  initData?: Models.Pillar | null;
};
const BaseModal: FC<Props> = (props) => {
  const [form] = Form.useForm();
  const { visible, title, handleOk, handleCancel, initData } = props;
  useEffect(() => {
    if (visible && initData) {
      form.setFieldsValue({ ...initData });
    }
    if (!visible) {
      form.resetFields();
    }
  }, [visible, initData]);
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={handleCancel}
      okText={'提交'}
      cancelText={'取消'}
    >
      <Form form={form} onFinish={handleOk}>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input maxLength={10} />
        </Form.Item>

        <Form.Item
          name="ip"
          label="IP"
          rules={[
            { required: true, message: '请输入设备ip' },

            {
              validator: (rule, value, cb) => {
                if (value) {
                  const IP = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
                  if (IP.test(value)) {
                    cb();
                  } else {
                    cb(`请输入正确的ip格式,如:‘192.168.1.1’`);
                  }
                } else {
                  cb();
                }
              },
            },
          ]}
        >
          <Input maxLength={15} />
        </Form.Item>

        <Form.Item
          name="port"
          label="端口"
          rules={[
            { required: true, message: '请输入设备端' },
            {
              validator: (rule, value, cb) => {
                if (value) {
                  const PORT = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

                  if (PORT.test(value)) {
                    cb();
                  } else {
                    cb(`请输入正确的端口格式,在1-65535之间`);
                  }
                } else {
                  cb();
                }
              },
            },
          ]}
        >
          <Input maxLength={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseModal;
