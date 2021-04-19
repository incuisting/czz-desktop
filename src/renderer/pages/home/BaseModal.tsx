import type { FC } from 'react';
// import { useEffect, useState } from 'react';
import { Modal } from 'antd';
// import { useDatabase } from '@/hooks';
// import styles from './index.less';

type Props = {
  title: string;
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
};
const BaseModal: FC<Props> = (props) => {
  const { visible, title, handleOk, handleCancel } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      1
    </Modal>
  );
};

export default BaseModal;
