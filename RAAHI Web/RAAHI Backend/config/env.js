const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env')
});

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getOptionalEnv = (name, fallback = undefined) => {
  const value = process.env[name];
  return value === undefined ? fallback : value;
};

module.exports = {
  getRequiredEnv,
  getOptionalEnv
};
