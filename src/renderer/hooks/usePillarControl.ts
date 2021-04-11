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
      if (pillar.length > 0) {
        pillarControl.up({ host: pillar[0].ip, port: pillar[0].port });
      }
    });
  };

  const down = (ids: T[]) => {
    ids.forEach(async (id) => {
      const pillars = await pillar.findByIds([id]);
      console.log('down pillars', pillars);
      pillarControl.down(id);
    });
  };
  const updateStatus = async (ids: T[]) => {
    const pillars = await pillar.findByIds(ids);
    pillars.forEach(async (pillarItem: Models.Pillar) => {
      const { ip, port, id } = pillarItem;
      const status = await pillarControl.readStatus({ host: ip, port });
      pillar.update(id, { status });
    });
  };
  return { up, down, updateStatus };
}
