const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LITACHKA_API_URL =
  'https://private-anon-76a246e709-litackaapi.apiary-mock.com/cards/';

const TEST_API_KEY = process.env.TEST_API_KEY;
export { PORT, MONGO_URL, IS_PRODUCTION, LITACHKA_API_URL, TEST_API_KEY };
