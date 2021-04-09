import { logger, provideSingleton } from '@/utils';

@provideSingleton(PillarControlService)
export class PillarControlService {
  public up(connectInfo: { ip: string; port: string }): boolean {
    console.log(connectInfo);
    return true;
  }

  public down(connectInfo: { ip: string; port: string }): boolean {
    logger(connectInfo);
    return true;
  }
}
