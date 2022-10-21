import {MigrationInterface, QueryRunner} from "typeorm";

export class invitationCode1666380907261 implements MigrationInterface {
    name = 'invitationCode1666380907261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP COLUMN "invitationCode"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD "invitationCode" character varying`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db" UNIQUE ("invitationCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" DROP COLUMN "invitationCode"`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD "invitationCode" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quick_challenge" ADD CONSTRAINT "UQ_80cb8e87796d44a7c16f9a5e9db" UNIQUE ("invitationCode")`);
    }

}
