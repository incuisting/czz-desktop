import { useState, useEffect } from 'react';
import { database } from '@/bridge';
import { useDatabase } from './useDatabase';

/**
 * 获取数据库
 */
const UP = 1;
const DOWN = 2;
export function useTask() {
  const { pillar } = useDatabase();
  const { pillarControl } = database;
  const [queryQueue, setQueryQueue] = useState<Models.Pillar[]>([]);
  const [upQueue, setUpQueue] = useState<Models.Pillar[]>([]);
  const [downQueue, setDownQueue] = useState<Models.Pillar[]>([]);

  useEffect(() => {
    const handleQuery = async (item: Models.Pillar) => {
      const { ip, port, id } = item;
      try {
        const status = await pillarControl.readStatus({ host: ip, port });
        pillar.update(id, { status });
      } catch (e) {
        pillar.update(id, { status: 0 });
      }
    };
    if (queryQueue.length > 0) {
      const item = queryQueue.shift();
      if (item) {
        handleQuery(item);
        setQueryQueue([...queryQueue]);
      }
    }
  }, [pillar, pillarControl, queryQueue]);
  useEffect(() => {
    if (upQueue.length > 0) {
      const handleUp = async (item: Models.Pillar) => {
        if (item.status !== UP) {
          try {
            const status = await pillarControl.up({
              host: item.ip,
              port: item.port,
            });
            pillar.update(item.id, { status });
          } catch (e) {
            console.error(e);
            pillar.update(item.id, { status: 0 });
          }
        }
      };
      if (upQueue.length > 0) {
        const item = upQueue.shift();
        if (item) {
          handleUp(item);
          setUpQueue([...upQueue]);
        }
      }
    }
  }, [pillar, pillarControl, upQueue]);
  useEffect(() => {
    if (downQueue.length > 0) {
      const handleDown = async (item: Models.Pillar) => {
        if (item.status !== DOWN) {
          try {
            const status = await pillarControl.down({
              host: item.ip,
              port: item.port,
            });
            pillar.update(item.id, { status });
          } catch (e) {
            console.error(e);
            pillar.update(item.id, { status: 0 });
          }
        }
      };
      if (downQueue.length > 0) {
        const item = downQueue.shift();
        if (item) {
          handleDown(item);
          setDownQueue([...downQueue]);
        }
      }
    }
  }, [downQueue, pillar, pillarControl]);
  const queryRegister = (items: Models.Pillar[]) => {
    setQueryQueue([...queryQueue, ...items]);
  };

  const upRegister = (items: Models.Pillar[]) => {
    setUpQueue([...upQueue, ...items]);
  };
  const downRegister = (items: Models.Pillar[]) => {
    setDownQueue([...downQueue, ...items]);
  };

  return { queryRegister, downRegister, upRegister };
}
