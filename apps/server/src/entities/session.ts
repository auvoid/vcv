import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './base-entity';
import { User } from './user';

@Entity()
export class Session extends BaseEntity {
  @Column({ nullable: false, default: true })
  isValid: boolean;

  @Column({ nullable: true })
  did: string;

  @ManyToOne(() => User, (e) => e.sessions, { onDelete: 'CASCADE' })
  user: Relation<User>;
}
