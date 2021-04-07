import { FC, useEffect, useState } from 'react';
import { Button, Checkbox } from 'antd';
import { useSelections } from 'ahooks';

// import { routeTo } from '@/utils';
import { useDatabase } from '@/hooks';

import styles from './index.less';

const Home: FC = () => {
  const { user } = useDatabase();
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
    async function queryDB() {
      const czzList = await user.finAll();
      setCzz(czzList);
      setSelections(czzList.map((el: { id: number }) => el.id));
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
      <div className={styles.czzList}>
        {czzList.map((el: { id: number; name: string }, i) => {
          return (
            <div className={styles.infoCard}>
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
