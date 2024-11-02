import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { hash, verify } from 'argon2';
import { BaseEntity } from './base-entity';
import { Session } from './session';
import { CV } from './cv';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  did: string;

  @OneToMany(() => Session, (e) => e.user, { onDelete: 'CASCADE' })
  sessions: Relation<Session[]>;

  @Column({ default: false, nullable: false })
  emailVerified: boolean;

  @OneToMany(() => CV, (e) => e.user)
  cvs: CV[];

  private tempPassword: string;
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashAndSaltPassword() {
    if (this.tempPassword !== this.password) {
      this.password = await hash(this.password);
    }
  }

  async verifyPassword(pwd: string) {
    return verify(this.password, pwd);
  }
}
