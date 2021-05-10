import { useDatabase } from './useDatabase';

export function useSetting() {
  const { setting } = useDatabase();
  const setLic = (licensePath: string, id: string) => {
    const result = setting.checkLic(licensePath, id);
    if (!result) {
      return result;
    }
    setting.setActive({
      isActive: true,
      expireDate: result.notAfter,
    });
    return true;
  };

  const getLic = () => {};
  const getAppId = async (): Promise<string> => {
    let { appId } = await setting.getActive();
    if (!appId) {
      appId = await setting.createAppId();
      setting.setActive({
        appId,
      });
    }
    return appId;
  };
  return { setLic, getLic, getAppId };
}
