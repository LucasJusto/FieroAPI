import {MigrationInterface, QueryRunner} from "typeorm";

export class Sprint3AlterTables1659639060664 implements MigrationInterface {
    name = 'Sprint3AlterTables1659639060664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_user" ADD "beginDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD "botPicture" character varying`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD "online" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD "alreadyBegin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD "maxTeams" integer NOT NULL DEFAULT '4'`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_32437794ab1a0519530561ea159"`);
        await queryRunner.query(`ALTER TABLE "team_user" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_32437794ab1a0519530561ea159" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_32437794ab1a0519530561ea159"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_user" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_32437794ab1a0519530561ea159" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP COLUMN "maxTeams"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP COLUMN "alreadyBegin"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP COLUMN "online"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP COLUMN "botPicture"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP COLUMN "beginDate"`);
    }

}
