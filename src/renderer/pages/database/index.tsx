import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { useDatabase } from '@/hooks';

import { routeTo } from '@/utils';
import styles from './index.less';

const DataBase: FC = () => {
  const { pillar } = useDatabase();
  const [czzList, setCzz] = useState<Models.Pillar[]>([]);

  async function queryDB() {
    const devices = await pillar.finAll();
    setCzz(devices);
  }
  useEffect(() => {
    // didMount
    queryDB();
  }, []);
  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.cardTitle}>
            <Button
              onClick={() => {
                routeTo('/home');
              }}
            >
              返回
            </Button>
            <span>添加设备</span>
          </div>
        }
        className={styles.card}
      >
        <pre>{JSON.stringify(czzList)}</pre>
        <Button
          onClick={async () => {
            const data = await pillar.insert('192.168.70.10', 'test', '8080');
            console.log(data);
          }}
        >
          插入数据
        </Button>
      </Card>
    </div>
  );
};

export default DataBase;
