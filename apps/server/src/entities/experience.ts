import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { CV } from './cv';

@Entity()
export class Experience extends BaseEntity {
  @Column()
  companyName: string;

  @Column()
  companyUrl: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  jobTitle: string;

  @ManyToMany(() => CV, (e) => e.experiences)
  cvs: CV[];
}
