import { database } from '@/bridge';

/**
 * 获取数据库
 */
export const usePillarControl = () => {
  const { pillarControl } = database;

  return { pillarControl };
};
