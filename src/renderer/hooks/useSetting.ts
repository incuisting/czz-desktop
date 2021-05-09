import { useDatabase } from './useDatabase';

export function useSetting() {
  const { setting } = useDatabase();
  const setLic = (licensePath: string, id: string) => {
    const result = setting.checkLic(licensePath, id);
    if (!result) {
      return result;
    }
    setting.setActive(true, result.notAfter);
    return true;
  };

  const getLic = () => {};
  return { setLic, getLic };
}
