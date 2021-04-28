import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { Repository } from 'typeorm';

import type { Setting } from '@/models';
import TYPES from '@/ioc/types';

@provide(SettingService)
export class SettingService {
  @inject(TYPES.SettingRepository) private model!: Repository<Setting>;

  /**
   * 创建对象
   * @param name
   * @param surname
   */
  public setActive(isActive: boolean, id: number = 0) {
    this.model.update(id, { isActive });
  }

  public async getActive() {
    const el = await this.model.findByIds([0]);

    const all = await this.model.find();
    console.log(all);
    // return el[0].isActive;
  }
}
