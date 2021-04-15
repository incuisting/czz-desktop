import type { FC } from 'react';
import { useState } from 'react';
import { Button } from 'antd';
import InputToggle from '../InputToggle';
import styles from './index.less';

type Props = { ip: string; port: string; name: string; onDelete: () => void };
const DeviceItem: FC<Props> = (props) => {
  const [inputValue, setInputValue] = useState({ ...props });
  const { ip, port, name, onDelete } = props;
  return (
    <div className={styles.itemContent}>
      <div className={styles.item}>
        <span>名称</span>
        <InputToggle
          content={name}
          onChange={(value) => {
            setInputValue({ ...inputValue, ip: value });
          }}
        ></InputToggle>
      </div>
      <div className={styles.item}>
        <span>IP</span>
        <InputToggle
          content={ip}
          onChange={(value) => {
            setInputValue({ ...inputValue, ip: value });
          }}
        ></InputToggle>
      </div>
      <div className={styles.item}>
        <span>端口</span>
        <InputToggle
          content={port}
          onChange={(value) => {
            setInputValue({ ...inputValue, ip: value });
          }}
        ></InputToggle>
      </div>
      <Button
        onClick={() => {
          onDelete();
        }}
      >
        删除
      </Button>
    </div>
  );
};

export default DeviceItem;
