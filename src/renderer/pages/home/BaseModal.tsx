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
          rules={[{ required: true, message: '请输入设备ip' }]}
        >
          <Input maxLength={15} />
        </Form.Item>

        <Form.Item
          name="port"
          label="端口"
          rules={[{ required: true, message: '请输入设备端' }]}
        >
          <Input maxLength={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseModal;
