import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
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

  @Column()
  reference: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => CV, (e) => e.experiences)
  cv: CV;
}
