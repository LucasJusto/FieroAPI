import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTables1655838143069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'user',
              columns: [
                {
                  name: 'id',
                  type: 'uuid',
                  isPrimary: true,
                },
                {
                  name: 'name',
                  type: 'varchar',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: 'true',
                  },
                  {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                  },
                  {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                  }
              ],
            }),
          );
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE cuser")
    }

}
