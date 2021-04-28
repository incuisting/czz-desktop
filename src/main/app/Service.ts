import { inject } from 'inversify';
import {
  PillarService,
  SystemService,
  UserService,
  PillarControlService,
  SettingService,
} from '@/services';
import { logAfter, logBefore, provideSingleton } from '@/utils';
import { ipcMain } from 'electron';
import { CHANNELS } from '@/common';

@provideSingleton(Service)
export class Service {
  /** 服务类 * */

  @inject(UserService)
  user!: UserService;

  @inject(PillarService)
  pillar!: PillarService;

  @inject(SettingService)
  setting!: SettingService;

  @inject(PillarControlService)
  pillarControl!: PillarControlService;

  @inject(SystemService)
  system!: SystemService;

  /**
   * 处理所有服务的初始化
   */
  @logBefore('[服务]初始化服务...')
  @logAfter('[服务]初始化完成!')
  init() {
    // 服务上桥
    global.services = {
      user: this.user,
      system: this.system,
      pillar: this.pillar,
      pillarControl: this.pillarControl,
      setting: this.setting,
    };

    // 检查 macOS 权限上桥
    ipcMain.handle(
      CHANNELS.CHECK_ACCESSIBILITY_FOR_MAC_OS,
      this.system.checkAccessibilityForMacOS,
    );
  }
}
