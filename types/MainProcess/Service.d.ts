declare namespace Main {
  import type {
    UserService,
    SystemService,
    PillarService,
  } from '../../src/main/services';

  /**
   * Electron 支持的服务
   */
  interface Services {
    pillar: PillarService;
    user: UserService;
    system: SystemService;
  }
}

declare namespace NodeJS {
  interface Global {
    services: Main.Services;
  }
}
