import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730562682216 implements MigrationInterface {
    name = 'Migration1730562682216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cv_credentials_credential" ("cvId" uuid NOT NULL, "credentialId" uuid NOT NULL, CONSTRAINT "PK_47dc5d6d1c7c3f7b18f34a1e7e3" PRIMARY KEY ("cvId", "credentialId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d7a2e8c3298ac6a3316bced8a0" ON "cv_credentials_credential" ("cvId") `);
        await queryRunner.query(`CREATE INDEX "IDX_71d49eb47d345064e9626c7ca7" ON "cv_credentials_credential" ("credentialId") `);
        await queryRunner.query(`ALTER TABLE "cv_credentials_credential" ADD CONSTRAINT "FK_d7a2e8c3298ac6a3316bced8a03" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cv_credentials_credential" ADD CONSTRAINT "FK_71d49eb47d345064e9626c7ca73" FOREIGN KEY ("credentialId") REFERENCES "credential"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv_credentials_credential" DROP CONSTRAINT "FK_71d49eb47d345064e9626c7ca73"`);
        await queryRunner.query(`ALTER TABLE "cv_credentials_credential" DROP CONSTRAINT "FK_d7a2e8c3298ac6a3316bced8a03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71d49eb47d345064e9626c7ca7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7a2e8c3298ac6a3316bced8a0"`);
        await queryRunner.query(`DROP TABLE "cv_credentials_credential"`);
    }

}
