import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730563920652 implements MigrationInterface {
    name = 'Migration1730563920652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "credential" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "cv" ADD "type" character varying NOT NULL`);
    }

}
