import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730617660183 implements MigrationInterface {
    name = 'Migration1730617660183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" ALTER COLUMN "type" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" ALTER COLUMN "type" SET NOT NULL`);
    }

}
