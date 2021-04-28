import {
  provideSingleton,
  connect,
  createControlCommand,
  createReadCommand,
  parseRead,
  CONTROL,
} from '@/utils';
@provideSingleton(PillarControlService)
export class PillarControlService {
  public async up(connectInfo: { host: string; port: number }): Promise<any> {
    const write = (addr: number, val: number) =>
      new Promise((resolve, reject) => {
        connect(connectInfo, createControlCommand(addr, val), resolve, reject);
      });
    try {
      await write(CONTROL.UP, CONTROL.OFF);
      await write(CONTROL.UP, CONTROL.ON);
    } catch (e) {
      return e;
    }
  }

  public async down(connectInfo: { host: string; port: number }) {
    const write = (addr: number, val: number) =>
      new Promise((resolve, reject) => {
        connect(connectInfo, createControlCommand(addr, val), resolve, reject);
      });
    try {
      await write(CONTROL.UP, CONTROL.OFF);
      await write(CONTROL.UP, CONTROL.ON);
    } catch (e) {
      return e;
    }
  }

  public async readStatus(connectInfo: {
    host: string;
    port: number;
  }): Promise<number | undefined> {
    const upStatus = (addr: number, bits: number) =>
      new Promise((resolve, reject) => {
        connect(connectInfo, createReadCommand(addr, bits), resolve, reject);
      });

    const downStatus = (addr: number, bits: number) =>
      new Promise((resolve, reject) => {
        connect(connectInfo, createReadCommand(addr, bits), resolve, reject);
      });
    try {
      const [up, down] = await Promise.all([
        upStatus(CONTROL.UP_STATUS, 1),
        downStatus(CONTROL.DOWN_STATUS, 1),
      ]);
      if (parseRead(up as Buffer)) {
        return 1;
      }
      if (parseRead(down as Buffer)) {
        return 2;
      }
      return;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }
}
