import type { FC } from 'react';
// import React from 'react';
import { Button } from 'antd';

// import { routeTo } from '@/utils';
// import { useDatabase  } from '@/hooks';

import styles from './index.less';

const Home: FC = () => {
  // const { user } = useDatabase;

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <Button
          onClick={() => {
            console.log('select all');
          }}
          type={'primary'}
        >
          全选
        </Button>
        <Button
          onClick={() => {
            console.log('up');
          }}
          type={'default'}
        >
          上升
        </Button>
        <Button
          onClick={() => {
            console.log('down');
          }}
          type={'default'}
        >
          下降
        </Button>
      </div>
    </div>
  );
};

export default Home;
