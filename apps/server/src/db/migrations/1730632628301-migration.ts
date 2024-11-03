import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730632628301 implements MigrationInterface {
    name = 'Migration1730632628301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" ADD "reference" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "reference"`);
    }

}
