import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export class CredOffer extends BaseEntity {
  @Column({ nullable: false, type: 'jsonb' })
  offer: Record<string, any>;
}
