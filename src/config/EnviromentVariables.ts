import "./dotenv.js";

const {
  PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  USER_AUTH_TOKEN_KEY,
  USER_AUTH_TOKEN_EXPIRE_TIME,
  SENDGRID_API_KEY,
  DEFAULT_PASSWORD_FOR_DELETED_ACCOUNTS
} = process.env;

const variables = {
  PORT: Number(PORT),
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT: Number(DB_PORT),
  USER_AUTH_TOKEN_KEY,
  USER_AUTH_TOKEN_EXPIRE_TIME: Number(USER_AUTH_TOKEN_EXPIRE_TIME),
  SENDGRID_API_KEY,
  DEFAULT_PASSWORD_FOR_DELETED_ACCOUNTS
};

export default variables;
