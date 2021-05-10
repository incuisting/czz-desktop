import type { FC } from 'react';
import { useState } from 'react';
import { Button, Checkbox, Row, Card, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { useSelections, useInterval, useMount, useUnmount } from 'ahooks';

import { useDatabase, usePillarControl, useSetting } from '@/hooks';
import BaseModal from './BaseModal';

import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  const { checkLic, updateLastUseTime } = useSetting();
  const { up, down, updateAllStatus } = usePillarControl<number>();
  const [czzList, setCzz] = useState<Models.Pillar[]>([]);
  const [pillarDetail, setPillarDetail] = useState<Models.Pillar | null>(null);
  const [selections, setSelections] = useState<number[]>([]);
  const {
    selected,
    allSelected,
    isSelected,
    toggle,
    toggleAll,
    unSelectAll,
  } = useSelections(selections, []);
  const [modalVisible, setModalVisible] = useState(false);
  async function queryDB() {
    const devices = await pillar.finAll();
    setCzz(devices);
    setSelections(devices.map((el: { id: number }) => el.id));
  }

  useMount(() => {
    queryDB();
    checkLic();
  });
  useUnmount(() => {
    updateLastUseTime();
  });
  useInterval(() => {
    updateAllStatus();
    queryDB();
  }, 1000);

  const computedStatusStr = (status: 0 | 1 | 2) => {
    const dic = { 0: '离线', 1: '升起', 2: '降下' };
    return dic[status];
  };
  const addDevice = (values: { name: string; ip: string; port: string }) => {
    const { name, ip, port } = values;
    pillar.insert(ip, name, port);
    setModalVisible(false);
    queryDB();
  };
  const updateDevice = (
    id: number,
    values: { name: string; ip: string; port: string },
  ) => {
    const { name, ip, port } = values;
    pillar.update(id, { name, ip, port });
    setModalVisible(false);
    queryDB();
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
              setModalVisible(true);
              setPillarDetail(null);
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
              <Col span={8} key={el.id}>
                <Card
                  title={
                    <div className={styles.cardHeader}>
                      <Checkbox
                        checked={isSelected(el.id)}
                        onClick={() => toggle(el.id)}
                      ></Checkbox>
                      <div className={styles.cardTitle}>
                        <div>{el.name}</div>
                        <div className={styles.status}>
                          {computedStatusStr(el.status)}
                          <div
                            className={styles.edit}
                            onClick={async () => {
                              const item = await pillar.findByIds([el.id]);
                              setPillarDetail(item[0]);
                              setModalVisible(true);
                            }}
                          >
                            <SettingOutlined />
                          </div>
                        </div>
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
      <BaseModal
        title={pillarDetail ? '编辑' : '添加'}
        visible={modalVisible}
        handleOk={(values) => {
          if (pillarDetail) {
            const { id } = pillarDetail;
            updateDevice(id, values);
          } else {
            addDevice(values);
          }
        }}
        handleCancel={() => {
          setModalVisible(false);
          setPillarDetail(null);
        }}
        initData={pillarDetail}
      ></BaseModal>
    </div>
  );
};

export default Home;
