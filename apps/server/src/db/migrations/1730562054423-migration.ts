import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730562054423 implements MigrationInterface {
    name = 'Migration1730562054423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" ADD "cvName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "cvName"`);
    }

}
