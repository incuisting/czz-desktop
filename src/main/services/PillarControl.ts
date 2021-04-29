import { provideSingleton, controller, querier } from '@/utils';
@provideSingleton(PillarControlService)
export class PillarControlService {
  public async up(connectInfo: { host: string; port: number }): Promise<any> {
    try {
      await controller(connectInfo, 'UP');
    } catch (e) {
      return e;
    }
  }

  public async down(connectInfo: { host: string; port: number }) {
    try {
      await controller(connectInfo, 'DOWN');
    } catch (e) {
      return e;
    }
  }

  public async readStatus(connectInfo: {
    host: string;
    port: number;
  }): Promise<number> {
    try {
      const isUp = await querier(connectInfo, 'UP_STATUS');
      if (isUp) {
        return 1;
      }
      return 2;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }
}
