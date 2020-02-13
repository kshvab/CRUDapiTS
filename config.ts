const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MAILING_SERVISE = process.env.MAILING_SERVISE;
const MAILING_USER = process.env.MAILING_USER;
const MAILING_PASS = process.env.MAILING_PASS;
const MAILING_ADMINS = process.env.MAILING_ADMINS;

export {
  PORT,
  MONGO_URL,
  //IS_PRODUCTION: process.env.NODE_ENV === 'production',
  MAILING_SERVISE,
  MAILING_USER,
  MAILING_PASS,
  MAILING_ADMINS
};
