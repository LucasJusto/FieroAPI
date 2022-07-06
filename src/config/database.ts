import { ConnectionOptions } from "typeorm";
import variables from "./EnviromentVariables.js";
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = variables;

export default {
  type: "postgres",
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
  entities: ["src/Model/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  cli: {
    migrationsDir: "src/database/migrations",
  },
} as ConnectionOptions;
