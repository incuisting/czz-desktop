import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { Repository } from 'typeorm';
import { mac } from 'address';
import NodeRSA from 'node-rsa';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import os from 'os';

import type { Setting } from '@/models';
import TYPES from '@/ioc/types';

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQCWYRaMtBaqPN0Yu/MxxHbiDEmHIgztbXWfkX2sHKDHIEpgdoAnA/P9JydK
CzQUAVVQambWAjhPHeynZKvZELP5AgMBAAE=
-----END RSA PUBLIC KEY-----`;
@provide(SettingService)
export class SettingService {
  @inject(TYPES.SettingRepository) private model!: Repository<Setting>;

  /**
   * 创建对象
   * @param name
   * @param surname
   */
  public setActive(
    info: {
      isActive?: boolean;
      expireDate?: number;
      appId?: string;
      lastUseTime?: number;
    },
    id: number = 1,
  ) {
    this.model.update(id, { ...info });
  }

  public async getActive(): Promise<Setting> {
    const all = await this.model.find();
    if (all.length === 0) {
      await this.model.insert({ isActive: false, appId: '' });
      return { isActive: false, appId: '' };
    }
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
    if (appId !== id) {
      return false;
    }
    const time = moment().valueOf();
    if (time < notBefore || time > notAfter) {
      return false;
    }

    return { notAfter, notBefore };
  }
  private async getMAC(): Promise<string> {
    return new Promise((resolve, reject) => {
      mac((err, addr) => {
        if (err) {
          reject(err);
        }
        resolve(addr);
      });
    });
  }
  public async createAppId(): Promise<string> {
    const hostname = os.hostname();
    const osType = os.type();
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();
    const MAC = await this.getMAC();
    const info = MAC + hostname + osType + platform + arch + release;
    const appId = CryptoJS.SHA1(info).toString(CryptoJS.enc.Hex);
    return appId;
  }
}
