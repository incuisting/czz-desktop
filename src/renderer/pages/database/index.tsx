import type { FC } from 'react';
import { Button, Card } from 'antd';
import { useDatabase, usePillarControl } from '@/hooks';

import { routeTo } from '@/utils';
import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  const { pillarControl } = usePillarControl();
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
        <Button
          onClick={() => {
            const t = pillarControl.up('t');
            console.log(t);
          }}
        >
          up
        </Button>
      </Card>
    </div>
  );
};

export default Home;
