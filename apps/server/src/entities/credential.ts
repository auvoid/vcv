import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { CV } from './cv';

@Entity()
export class Credential extends BaseEntity {
  @Column({ type: 'text' })
  raw: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  decoded: Record<string, any>;

  @ManyToMany(() => CV, (e) => e.credentials)
  cvs: CV[];
}
