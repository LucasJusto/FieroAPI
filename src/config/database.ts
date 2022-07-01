import { ConnectionOptions } from "typeorm";

export default {
  type: "postgres",
  database: "database",
  host: "localhost",
  port: Number(5432),
  username: "FieroDB",
  password: "dbpwd123AHAM",
  logging: false,
  entities: ["src/Model/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  cli: {
    migrationsDir: "src/database/migrations",
  },
} as ConnectionOptions;
