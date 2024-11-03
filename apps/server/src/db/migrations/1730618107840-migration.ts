import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730618107840 implements MigrationInterface {
    name = 'Migration1730618107840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "credential" ADD CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" DROP CONSTRAINT "FK_51dc2344d47cea3102674c64963"`);
        await queryRunner.query(`ALTER TABLE "credential" DROP COLUMN "userId"`);
    }

}
