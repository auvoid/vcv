import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { CV } from './cv';
import { User } from './user';

@Entity()
export class Credential extends BaseEntity {
  @Column({ type: 'text' })
  raw: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  decoded: Record<string, any>;

  @Column({ nullable: true })
  type: 'education' | 'experience' | 'certification' | null;

  @ManyToMany(() => CV, (e) => e.credentials)
  cvs: CV[];

  @ManyToOne(() => User, (e) => e.credentials)
  user: User;
}
