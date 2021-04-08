import type { FC} from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox } from 'antd';
import { useSelections } from 'ahooks';

import { routeTo } from '@/utils';
import { useDatabase } from '@/hooks';

import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  const [czzList, setCzz] = useState([]);
  const [selections, setSelections] = useState<number[]>([]);
  const {
    // selected,
    // allSelected,
    isSelected,
    toggle,
    toggleAll,
    // partiallySelected,
  } = useSelections(selections, []);
  useEffect(() => {
    // didMount
    async function queryDB() {
      const devices = await pillar.finAll();
      setCzz(devices);
      setSelections(devices.map((el: { id: number }) => el.id));
    }
    queryDB();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <Button
          onClick={() => {
            toggleAll();
          }}
          type={'primary'}
        >
          All
        </Button>
        <Button
          onClick={() => {
            console.log('up');
          }}
          type={'default'}
        >
          Up
        </Button>
        <Button
          onClick={() => {
            console.log('down');
          }}
          type={'default'}
        >
          Down
        </Button>
        <Button
          onClick={() => {
            routeTo('/database');
          }}
        >
          add device
        </Button>
      </div>
      <div className={styles.czzList}>
        {czzList.map((el: { id: number; name: string }, i) => {
          return (
            <div className={styles.infoCard} key={i}>
              <Checkbox
                checked={isSelected(el.id)}
                onClick={() => toggle(el.id)}
              >
                {el.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
