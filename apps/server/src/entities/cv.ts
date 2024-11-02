import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Credential } from './credential';
import { Experience } from './experience';
import { User } from './user';

@Entity()
export class CV extends BaseEntity {
  @Column()
  name: string;

  @Column()
  cvName: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'text', array: true })
  skills: string[];

  @Column({ type: 'jsonb' })
  contacts: { linkedin: string; email: string; phone: string };

  @Column()
  type: 'education' | 'experience';

  @ManyToOne(() => User, (e) => e.cvs)
  user: User;

  @ManyToMany(() => Credential, (e) => e.cvs)
  @JoinTable()
  credentials: Credential[];
}
