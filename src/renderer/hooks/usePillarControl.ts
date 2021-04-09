import { database } from '@/bridge';
import { useDatabase } from './useDatabase';

/**
 * 获取数据库
 */
export default function usePillarControl<T>() {
  const { pillar } = useDatabase();
  const { pillarControl } = database;
  const up = (ids: T[]) => {
    ids.forEach(async (id) => {
      const pillars = pillar.findByIds([id]);
      console.log('up pillars', pillars);
      pillarControl.up(id);
    });
  };

  const down = (ids: T[]) => {
    ids.forEach((id) => {
      const pillars = pillar.findByIds([id]);
      console.log('up pillars', pillars);
      pillarControl.down(id);
    });
  };

  return { up, down };
}
