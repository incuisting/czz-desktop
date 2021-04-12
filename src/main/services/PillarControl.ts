import { provideSingleton, readCoils, writeSingleCoil } from '@/utils';

@provideSingleton(PillarControlService)
export class PillarControlService {
  public async up(connectInfo: { host: string; port: number }): Promise<any> {
    const write = () =>
      new Promise((resolve, reject) => {
        writeSingleCoil(
          connectInfo,
          { address: 16, value: true },
          resolve,
          reject,
        );
      });
    try {
      await write();
    } catch (e) {
      return e;
    }
  }

  public async down(connectInfo: { host: string; port: number }) {
    const write = () =>
      new Promise((resolve, reject) => {
        writeSingleCoil(
          connectInfo,
          { address: 17, value: true },
          resolve,
          reject,
        );
      });
    try {
      await write();
    } catch (e) {
      return e;
    }
  }

  public async readStatus(connectInfo: { host: string; port: number }) {
    const upStatus = () =>
      new Promise((resolve, reject) => {
        readCoils(connectInfo, { start: 18, count: 1 }, resolve, reject);
      });

    const downStatus = () =>
      new Promise((resolve, reject) => {
        readCoils(connectInfo, { start: 19, count: 1 }, resolve, reject);
      });
    try {
      const [up, down] = await Promise.all([upStatus(), downStatus()]);
      console.log('up', up);
      console.log('down', down);
      // 这个地方的回参格式还是未知
      return { up, down };
    } catch (e) {
      return e;
    }
  }
}
