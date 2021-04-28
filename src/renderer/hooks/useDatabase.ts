import { database } from '@/bridge';

/**
 * 获取数据库
 */
export const useDatabase = () => {
  const { user, pillar, setting } = database;

  return { user, pillar, setting };
};
