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
  entities: ["**/Model/*.{ts,js}"],
  migrations: ["**/database/migrations/*.{ts,js}"],
  cli: {
    migrationsDir: "src/database/migrations",
  },
} as ConnectionOptions;
