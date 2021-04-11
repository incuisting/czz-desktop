import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Row, Card, Col } from 'antd';
import { useSelections, useInterval } from 'ahooks';

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
    unSelectAll,
  } = useSelections(selections, []);

  async function queryDB() {
    const devices = await pillar.finAll();
    setCzz(devices);
    setSelections(devices.map((el: { id: number }) => el.id));
  }
  useEffect(() => {
    // didMount
    queryDB();
  }, []);

  useInterval(() => {
    console.log(1);
  }, 1000);

  const computedStatusStr = (status: 0 | 1 | 2) => {
    const dic = { 0: '离线', 1: '升起', 2: '下降' };
    return dic[status];
  };
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
          disabled={!(selected.length > 0)}
          onClick={() => {
            up(selected);
            unSelectAll();
            queryDB();
          }}
          type={'default'}
        >
          Up
        </Button>
        <Button
          disabled={!(selected.length > 0)}
          onClick={() => {
            down(selected);
            unSelectAll();
            queryDB();
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
      <div className={styles.content}>
        <Row gutter={[8, 8]}>
          {czzList.map((el) => {
            return (
              <Col span={6} key={el.id}>
                <Card
                  title={
                    <div className={styles.cardHeader}>
                      <Checkbox
                        checked={isSelected(el.id)}
                        onClick={() => toggle(el.id)}
                      ></Checkbox>
                      <div className={styles.cardTitle}>
                        <div>{el.name}</div>
                        <div>{computedStatusStr(el.status)}</div>
                      </div>
                    </div>
                  }
                  bordered={false}
                >
                  <Card.Grid className={styles.operatorButton}>
                    <div
                      onClick={() => {
                        up([el.id]);
                      }}
                    >
                      up
                    </div>
                  </Card.Grid>

                  <Card.Grid className={styles.operatorButton}>
                    <div
                      onClick={() => {
                        down([el.id]);
                      }}
                    >
                      down
                    </div>
                  </Card.Grid>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Home;
