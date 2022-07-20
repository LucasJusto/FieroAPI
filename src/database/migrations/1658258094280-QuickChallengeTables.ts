import {MigrationInterface, QueryRunner} from "typeorm";

export class QuickChallengeTables1658258094280 implements MigrationInterface {
    name = 'QuickChallengeTables1658258094280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_user" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "team_id" uuid NOT NULL, "score" double precision NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_add64c4bdc53d926d9c0992bccc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL, "name" character varying NOT NULL, "quickChallenge_id" uuid NOT NULL, "owner_id" uuid NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quick_challenge" ("id" uuid NOT NULL, "name" character varying NOT NULL, "invitationCode" uuid NOT NULL, "owner_id" uuid NOT NULL, "type" character varying NOT NULL, "goal" double precision NOT NULL, "goalMeasure" character varying NOT NULL, "finished" boolean NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db" UNIQUE ("invitationCode"), CONSTRAINT "PK_4ce9f50baac3ac873a67c23ecb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_32437794ab1a0519530561ea159" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_ed60beadf0e6dffb2b9a5d164e4" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_b342fa0864f10bd006259ae3412" FOREIGN KEY ("quickChallenge_id") REFERENCES "quick_challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD CONSTRAINT "FK_1ad7c3aaa1a97a2ce2a672e9c84" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP CONSTRAINT "FK_1ad7c3aaa1a97a2ce2a672e9c84"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b342fa0864f10bd006259ae3412"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_ed60beadf0e6dffb2b9a5d164e4"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_32437794ab1a0519530561ea159"`);
        await queryRunner.query(`DROP TABLE "quick_challenge"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "team_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}