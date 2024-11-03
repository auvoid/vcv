import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730635359112 implements MigrationInterface {
    name = 'Migration1730635359112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "status"`);
    }

}
