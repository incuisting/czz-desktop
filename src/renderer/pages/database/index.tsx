import type { FC } from 'react';
import { Button, Card } from 'antd';
import { useDatabase } from '@/hooks';

import { routeTo } from '@/utils';
import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  return (
    <div className={styles.container}>
      <Card title={'测试数据库'} className={styles.card}>
        <Button
          onClick={async () => {
            const data = await pillar.insert('192.168.70.10', 'test', '8080');
            console.log(data);
          }}
        >
          插入数据
        </Button>
        <Button
          onClick={() => {
            routeTo('/home');
          }}
        >
          home
        </Button>
      </Card>
    </div>
  );
};

export default Home;
