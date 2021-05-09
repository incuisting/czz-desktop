import type { FC } from 'react';
import { useState } from 'react';
import styles from './index.less';
import { Form, Input, Button, Upload, message } from 'antd';
import { useSetting } from '@/hooks';
import { routeTo } from '@/utils';

const Auth: FC = () => {
  const [form] = Form.useForm();
  const { setLic } = useSetting();
  const [importVisible, setImportVisible] = useState(true);
  const handleOk = (values: { appId: string; license: { file: any } }) => {
    const { license, appId } = values;
    const {
      originFileObj: { path },
    } = license.file;
    const res = setLic(path, appId);
    if (res) {
      routeTo('/home');
    } else {
      message.error('验证失败');
      form.resetFields();
      setImportVisible(true);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>证书导入</div>
      <Form form={form} onFinish={handleOk} className={styles.formContent}>
        <Form.Item
          name="appId"
          label="流水号"
          rules={[{ required: true, message: '请输入流水号' }]}
        >
          <Input maxLength={10} />
        </Form.Item>

        <Form.Item
          name="license"
          label="证书"
          rules={[{ required: true, message: '请导入证书' }]}
        >
          <Upload
            onChange={(info) => {
              form.setFieldsValue({ license: info });
              if (info.fileList.length > 0) {
                setImportVisible(false);
              } else {
                setImportVisible(true);
              }
            }}
          >
            {importVisible ? <Button>导入</Button> : null}
          </Upload>
        </Form.Item>
      </Form>
      <div className={styles.buttonGroup}>
        <Button
          type={'primary'}
          onClick={() => {
            form.submit();
          }}
        >
          提交
        </Button>
      </div>
    </div>
  );
};

export default Auth;
