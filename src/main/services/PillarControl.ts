import { logger, provideSingleton, readCoils } from '@/utils';

@provideSingleton(PillarControlService)
export class PillarControlService {
  public up(connectInfo: { ip: string; port: string }): boolean {
    readCoils({ host: connectInfo.ip, port: 8080 });
    console.log(connectInfo);
    return true;
  }

  public down(connectInfo: { ip: string; port: string }): boolean {
    logger(connectInfo);
    return true;
  }
}
