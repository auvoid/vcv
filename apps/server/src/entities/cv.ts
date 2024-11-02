import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Credential } from './credential';
import { Experience } from './experience';

@Entity()
export class CV extends BaseEntity {
  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  bio: string;

  @Column()
  skills: string[];

  @Column({ type: 'jsonb' })
  contacts: { linkedin: string; email: string; phone: string };

  @Column()
  type: 'education' | 'experience';

  @ManyToMany(() => Credential, (e) => e.cvs)
  credentials: Credential[];

  @ManyToMany(() => Experience, (e) => e.cvs)
  experiences: Experience[];
}
