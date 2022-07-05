import { createConnection } from "typeorm";
import databaseOptions from "../config/database.js";

export default () => {
  return createConnection(databaseOptions);
};
