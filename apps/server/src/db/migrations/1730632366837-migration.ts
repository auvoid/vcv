import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730632366837 implements MigrationInterface {
    name = 'Migration1730632366837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" ADD "cvId" uuid`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_027a6e80c4011387b65d8f654e4" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_027a6e80c4011387b65d8f654e4"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "cvId"`);
    }

}
