import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
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

  @Column({ type: 'jsonb' })
  contacts: { linkedin: string; email: string; phone: string };

  @ManyToOne(() => User, (e) => e.cvs)
  user: User;

  @ManyToMany(() => Credential, (e) => e.cvs)
  @JoinTable()
  credentials: Credential[];

  @OneToMany(() => Experience, (e) => e.cv, { onDelete: 'CASCADE' })
  experiences: Experience[];
}
