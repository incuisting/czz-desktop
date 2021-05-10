import type { FC } from 'react';
import { useState } from 'react';
import styles from './index.less';
import { Form, Input, Button, Upload, message } from 'antd';
import { useSetting } from '@/hooks';
import { routeTo } from '@/utils';
import { useMount } from 'ahooks';

const Auth: FC = () => {
  const [form] = Form.useForm();
  const { setLic, getAppId } = useSetting();
  const [importVisible, setImportVisible] = useState(true);
  const [appid, setAppid] = useState('');
  const handleOk = (values: { appId: string; license: { file: any } }) => {
    const { license } = values;
    const {
      originFileObj: { path },
    } = license.file;
    const res = setLic(path, appid);
    if (res) {
      routeTo('/home');
    } else {
      message.error('验证失败');
      form.resetFields();
      setImportVisible(true);
    }
  };
  useMount(async () => {
    const id = await getAppId();
    setAppid(id);
  });
  return (
    <div className={styles.container}>
      <div className={styles.title}>证书导入</div>
      <div className={styles.appId}>
        <span>软件ID:</span>
        <span className={styles.id}>{appid}</span>
      </div>
      <Form form={form} onFinish={handleOk} className={styles.formContent}>
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
