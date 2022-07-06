import "./dotenv.js";

const {
  PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} = process.env;

const variables = {
  PORT: Number(PORT),
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT: Number(DB_PORT),
};

export default variables;
