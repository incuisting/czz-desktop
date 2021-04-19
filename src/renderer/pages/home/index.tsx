import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Row, Card, Col } from 'antd';
import { useSelections, useInterval } from 'ahooks';

import { routeTo } from '@/utils';
import { useDatabase, usePillarControl } from '@/hooks';
import BaseModal from './BaseModal';

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
    const dic = { 0: '离线', 1: '升起', 2: '降下' };
    return dic[status];
  };
  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <div className={styles.operator}>
          <Button
            onClick={() => {
              toggleAll();
            }}
            type={'primary'}
          >
            {allSelected ? '取消' : '全选'}
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
            升起
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
            降下
          </Button>
        </div>
        <div className={styles.deviceManage}>
          <Button
            disabled={!(selected.length > 0)}
            onClick={() => {
              console.log('del');
              pillar.delete(selected);
              unSelectAll();
              queryDB();
            }}
            danger
          >
            删除设备
          </Button>
          <Button
            onClick={() => {
              routeTo('/database');
            }}
          >
            添加设备
          </Button>
        </div>
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
                      升
                    </div>
                  </Card.Grid>

                  <Card.Grid className={styles.operatorButton}>
                    <div
                      onClick={() => {
                        down([el.id]);
                      }}
                    >
                      降
                    </div>
                  </Card.Grid>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
      <BaseModal></BaseModal>
    </div>
  );
};

export default Home;
