import {MigrationInterface, QueryRunner} from "typeorm";

export class QuickChallengeTables1658168425638 implements MigrationInterface {
    name = 'QuickChallengeTables1658168425638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL, "name" character varying NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), "quickChallengeId" uuid, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quick_challenge" ("id" uuid NOT NULL, "name" character varying NOT NULL, "invitationCode" uuid NOT NULL, "type" character varying NOT NULL, "goal" double precision NOT NULL, "goalMeasure" character varying NOT NULL, "finished" boolean NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db" UNIQUE ("invitationCode"), CONSTRAINT "PK_4ce9f50baac3ac873a67c23ecb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_users_user" ("teamId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b15f37b0ce77b1f0bb3e5b98633" PRIMARY KEY ("teamId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e51365666f6e400fe5f85d709a" ON "team_users_user" ("teamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3645709c5fc6fa1178ebe7f7b9" ON "team_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "salt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_bad53942b0a5d9e6db51b2d6c46" FOREIGN KEY ("quickChallengeId") REFERENCES "quick_challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_e51365666f6e400fe5f85d709ab" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_3645709c5fc6fa1178ebe7f7b9c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_3645709c5fc6fa1178ebe7f7b9c"`);
        await queryRunner.query(`ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_e51365666f6e400fe5f85d709ab"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_bad53942b0a5d9e6db51b2d6c46"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3645709c5fc6fa1178ebe7f7b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e51365666f6e400fe5f85d709a"`);
        await queryRunner.query(`DROP TABLE "team_users_user"`);
        await queryRunner.query(`DROP TABLE "quick_challenge"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }

}
