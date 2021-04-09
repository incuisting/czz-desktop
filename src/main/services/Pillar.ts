import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { Repository } from 'typeorm';

import type { Pillar } from '@/models';
import TYPES from '@/ioc/types';

@provide(PillarService)
export class PillarService {
  @inject(TYPES.PillarRepository) private model!: Repository<Pillar>;

  /**
   * 创建对象
   * @param name
   * @param surname
   */
  public insert(ip: string, name: string, port: string): Promise<Pillar> {
    return this.model.save({ ip, name, port, status: 0 });
  }

  public async finAll(): Promise<Pillar[]> {
    return this.model.find();
  }

  public update(
    id: number,
    updateContent: {
      ip?: string;
      port?: string;
      name?: string;
      status?: number;
    },
  ) {
    this.model.update(id, updateContent);
  }
  public delete(ids: number[]) {
    this.model.delete(ids);
  }
  public findByIds(ids: number[]): Promise<Pillar[]> {
    return this.model.findByIds(ids);
  }
}
