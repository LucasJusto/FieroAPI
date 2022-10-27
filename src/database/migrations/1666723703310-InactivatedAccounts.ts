import {MigrationInterface, QueryRunner} from "typeorm";

export class InactivatedAccounts1666723703310 implements MigrationInterface {
    name = 'InactivatedAccounts1666723703310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "inactivated" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "inactivated"`);
    }

}
