import { database } from '@/bridge';

/**
 * 获取数据库
 */
export const useDatabase = () => {
  const { user, pillar } = database;

  return { user, pillar };
};
