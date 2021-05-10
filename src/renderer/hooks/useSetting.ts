import { routeTo } from '@/utils';
import { useDatabase } from './useDatabase';
import moment from 'moment';

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

  const checkLic = async () => {
    const settingInfo = await setting.getActive();
    const { isActive, expireDate, lastUseTime, appId } = settingInfo;
    const currentAppId = await setting.createAppId();
    const currentMoment = moment().valueOf();
    if (!isActive) {
      routeTo('/auth');
    }
    if (currentMoment > expireDate) {
      routeTo('/auth');
    }
    if (currentMoment < lastUseTime) {
      routeTo('/auth');
    }
    if (currentAppId !== appId) {
      routeTo('/auth');
    }
  };
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
  const updateLastUseTime = () => {
    const timeStamp = moment().valueOf();
    setting.setActive({
      lastUseTime: timeStamp,
    });
  };
  return { setLic, checkLic, getAppId, updateLastUseTime };
}
