import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export class SiopOffer extends BaseEntity {
  @Column({ type: 'text' })
  request: string;

  @Column({ type: 'jsonb', default: {} })
  pex: Record<string, any>;
}
