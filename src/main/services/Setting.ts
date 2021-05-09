import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { Repository } from 'typeorm';

import NodeRSA from 'node-rsa';
import fs from 'fs';
import { resolve } from 'path';
import CryptoJS from 'crypto-js';
import moment from 'moment';

import type { Setting } from '@/models';
import TYPES from '@/ioc/types';

const publicKey = fs.readFileSync(resolve(__dirname, '../public'), {
  encoding: 'utf-8',
});
@provide(SettingService)
export class SettingService {
  @inject(TYPES.SettingRepository) private model!: Repository<Setting>;

  /**
   * 创建对象
   * @param name
   * @param surname
   */
  public setActive(isActive: boolean, expireTime: number, id: number = 1) {
    this.model.update(id, { isActive });
  }

  public async getActive(): Promise<Setting> {
    const all = await this.model.find();
    if (all.length === 0) {
      await this.model.insert({ isActive: false, appId: '' });
      return { isActive: false, appId: '' };
    }
    console.log(all);
    return all[0];
  }

  public checkLic(
    licensePath: string,
    id: string,
  ): { notBefore: string; notAfter: string } | boolean {
    const lic = fs.readFileSync(licensePath, { encoding: 'utf8' });
    if (!lic) {
      return false;
    }
    const key = new NodeRSA(publicKey);
    const aesKey = lic.substring(0, 16);
    const encDataLength = parseInt(lic.substring(16, 18), 16);
    const encData = lic.substring(18, 18 + encDataLength);
    const sign = lic.substring(18 + encDataLength);
    if (!key.verify(Buffer.from(encData), sign, 'utf8', 'base64')) {
      console.log('无效');
      return false;
    }
    const data = CryptoJS.AES.decrypt(encData, aesKey);
    const deData = JSON.parse(data.toString(CryptoJS.enc.Utf8));
    const { appId, notBefore, notAfter } = deData;
    console.log(deData);
    console.log(appId);
    const time = moment().valueOf();
    if (time < notBefore || time > notAfter) {
      return false;
    }

    return { notAfter, notBefore };
  }
}
