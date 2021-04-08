declare namespace Main {
  import type {
    UserService,
    SystemService,
    PillarService,
    PillarControlService,
  } from '../../src/main/services';

  /**
   * Electron 支持的服务
   */
  interface Services {
    pillar: PillarService;
    pillarControl: PillarControlService;
    user: UserService;
    system: SystemService;
  }
}

declare namespace NodeJS {
  interface Global {
    services: Main.Services;
  }
}
