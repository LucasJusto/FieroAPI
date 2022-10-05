import {MigrationInterface, QueryRunner} from "typeorm";

export class verificationCode1664995807242 implements MigrationInterface {
    name = 'verificationCode1664995807242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification_code" ("id" uuid NOT NULL, "owner_id" uuid NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT now(), "updated_At" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d702c086da466e5d25974512d46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "verification_code" ADD CONSTRAINT "FK_1a917e13a8fcfc71bda15d4a79e" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification_code" DROP CONSTRAINT "FK_1a917e13a8fcfc71bda15d4a79e"`);
        await queryRunner.query(`DROP TABLE "verification_code"`);
    }

}
