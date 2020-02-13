const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  //IS_PRODUCTION: process.env.NODE_ENV === 'production',
  MAILING_SERVISE: process.env.MAILING_SERVISE,
  MAILING_USER: process.env.MAILING_USER,
  MAILING_PASS: process.env.MAILING_PASS,
  MAILING_ADMINS: process.env.MAILING_ADMINS
};
