import { provideSingleton, readCoils, writeSingleCoil } from '@/utils';

@provideSingleton(PillarControlService)
export class PillarControlService {
  public up(connectInfo: { host: string; port: number }) {
    // readCoils(connectInfo);
    writeSingleCoil(connectInfo, { address: 16, value: true }, () => {});
  }

  public down(connectInfo: { host: string; port: number }) {
    writeSingleCoil(connectInfo, { address: 17, value: true }, () => {});
  }

  public async readStatus(connectInfo: { host: string; port: number }) {
    const upStatus = new Promise((resolve, reject) => {
      readCoils(connectInfo, { start: 18, count: 1 }, resolve);
    });

    const downStatus = new Promise((resolve, reject) => {
      readCoils(connectInfo, { start: 19, count: 1 }, resolve);
    });
    const [up, down] = await Promise.all([upStatus, downStatus]);
    console.log('up', up);
    console.log('down', down);
    // 这个地方的回参格式还是未知
    return { up, down };
  }
}
