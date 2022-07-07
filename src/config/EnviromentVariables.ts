import "./dotenv.js";

const {
  PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  USER_AUTH_TOKEN_KEY,
  USER_AUTH_TOKEN_EXPIRE_TIME
} = process.env;

const variables = {
  PORT: Number(PORT),
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT: Number(DB_PORT),
  USER_AUTH_TOKEN_KEY,
  USER_AUTH_TOKEN_EXPIRE_TIME: Number(USER_AUTH_TOKEN_EXPIRE_TIME)
};

export default variables;
