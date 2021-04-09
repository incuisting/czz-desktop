import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Row, Card, Col } from 'antd';
import { useSelections } from 'ahooks';

import { routeTo } from '@/utils';
import { useDatabase, usePillarControl } from '@/hooks';

import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  const { up, down } = usePillarControl<number>();
  const [czzList, setCzz] = useState<Models.Pillar[]>([]);
  const [selections, setSelections] = useState<number[]>([]);
  const {
    selected,
    allSelected,
    isSelected,
    toggle,
    toggleAll,
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
          {allSelected ? '取消' : 'All'}
        </Button>
        <Button
          disabled={!allSelected}
          onClick={() => {
            up(selected);
          }}
          type={'default'}
        >
          Up
        </Button>
        <Button
          disabled={!allSelected}
          onClick={() => {
            down(selected);
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
      <Row gutter={[8, 8]}>
        {czzList.map((el) => {
          return (
            <Col span={6} key={el.id}>
              <Card
                title={
                  <div>
                    <Checkbox
                      checked={isSelected(el.id)}
                      onClick={() => toggle(el.id)}
                    ></Checkbox>
                    <div>{el.name}</div>
                    <div>{el.status}</div>
                  </div>
                }
                bordered={false}
              >
                <div className={styles.operator}>
                  <Button
                    onClick={() => {
                      up([el.id]);
                    }}
                  >
                    up
                  </Button>
                  <Button
                    onClick={() => {
                      down([el.id]);
                    }}
                  >
                    down
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Home;
