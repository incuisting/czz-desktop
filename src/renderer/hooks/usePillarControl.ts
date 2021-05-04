import { database } from '@/bridge';
import { useDatabase } from './useDatabase';

/**
 * 获取数据库
 */
export function usePillarControl<T>() {
  const { pillar } = useDatabase();
  const { pillarControl } = database;
  const up = async (ids: T[]) => {
    ids.forEach(async (id) => {
      const pillars = await pillar.findByIds([id]);
      console.log('up pillars', pillars);
      if (pillars.length > 0) {
        try {
          await pillarControl.up({
            host: pillars[0].ip,
            port: pillars[0].port,
          });
        } catch (e) {
          console.error(e);
          pillar.update(id, { status: 0 });
        }
      }
    });
  };

  const down = (ids: T[]) => {
    ids.forEach(async (id) => {
      const pillars = await pillar.findByIds([id]);
      console.log('down pillars', pillars);
      if (pillars.length > 0) {
        try {
          await pillarControl.up({
            host: pillars[0].ip,
            port: pillars[0].port,
          });
        } catch (e) {
          pillar.update(id, { status: 0 });
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
  return { up, down, updateStatus };
}
