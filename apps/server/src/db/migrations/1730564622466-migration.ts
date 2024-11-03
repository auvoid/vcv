import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730564622466 implements MigrationInterface {
    name = 'Migration1730564622466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "skills"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" ADD "skills" text array NOT NULL`);
    }

}
