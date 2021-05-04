import { database } from '@/bridge';
import { useDatabase } from './useDatabase';

/**
 * 获取数据库
 */
const UP = 1;
const DOWN = 2;
export function usePillarControl<T>() {
  const { pillar } = useDatabase();
  const { pillarControl } = database;

  const up = async (ids: T[]) => {
    const pillars = await pillar.findByIds(ids);
    pillars.forEach((item: Models.Pillar) => {
      if (item.status !== UP) {
        try {
          pillarControl.up({
            host: item.ip,
            port: item.port,
          });
        } catch (e) {
          console.error(e);
          pillar.update(item.id, { status: 0 });
        }
      }
    });
  };
  const down = async (ids: T[]) => {
    const pillars = await pillar.findByIds(ids);
    pillars.forEach((item: Models.Pillar) => {
      if (item.status !== DOWN) {
        try {
          pillarControl.down({
            host: item.ip,
            port: item.port,
          });
        } catch (e) {
          console.error(e);
          pillar.update(item.id, { status: 0 });
        }
      }
    });
  };
  const updateStatus = async (ids: T[]) => {
    const pillars = await pillar.findByIds(ids);
    pillars.forEach(async (pillarItem: Models.Pillar) => {
      const { ip, port, id } = pillarItem;
      try {
        const status = await pillarControl.readStatus({ host: ip, port });
        pillar.update(id, { status });
      } catch (e) {
        pillar.update(id, { status: 0 });
      }
    });
  };
  const updateAllStatus = async () => {
    const pillars = await pillar.finAll();
    pillars.forEach(async (pillarItem: Models.Pillar) => {
      const { ip, port, id } = pillarItem;
      try {
        const status = await pillarControl.readStatus({ host: ip, port });
        pillar.update(id, { status });
      } catch (e) {
        pillar.update(id, { status: 0 });
      }
    });
  };
  return { up, down, updateStatus, updateAllStatus };
}
