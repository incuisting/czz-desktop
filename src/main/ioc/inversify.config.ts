import { AsyncContainerModule, Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import type { Repository } from 'typeorm';

import { Pillar, User, Setting } from '@/models';
import { getDBConnection, getRepository } from '@/utils';
import TYPES from './types';

import './loader';

// 容器
const container = new Container();

container.load(buildProviderModule());

export default container;

/**
 * 加载异步对象
 */
export const asyncBindings = new AsyncContainerModule(async (bind) => {
  await getDBConnection();

  bind<Repository<User>>(TYPES.UserRepository)
    .toDynamicValue(() => {
      return getRepository(User);
    })
    .inRequestScope();

  bind<Repository<Pillar>>(TYPES.PillarRepository)
    .toDynamicValue(() => {
      return getRepository(Pillar);
    })
    .inRequestScope();

  bind<Repository<Setting>>(TYPES.SettingRepository)
    .toDynamicValue(() => {
      return getRepository(Setting);
    })
    .inRequestScope();
});
