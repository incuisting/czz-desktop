import { logAfter, provideSingleton } from '@/utils';

@provideSingleton(PillarControlService)
export class PillarControlService {
  @logAfter('test')
  public up(t: string): string {
    return t;
  }
}
