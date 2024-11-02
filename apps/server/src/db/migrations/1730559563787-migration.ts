import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730559563787 implements MigrationInterface {
    name = 'Migration1730559563787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "cv" ADD CONSTRAINT "FK_e4b7330e64fd0ecce86720e62f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" DROP CONSTRAINT "FK_e4b7330e64fd0ecce86720e62f9"`);
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "userId"`);
    }

}
