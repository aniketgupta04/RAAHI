const fs = require('fs');
const path = require('path');
const { getOptionalEnv } = require('./env');

let cachedKeys = null;
let cachedPath = null;

const getApiKeysPath = () => {
  const configuredPath = getOptionalEnv('API_KEYS_FILE_PATH');

  if (!configuredPath) {
    return null;
  }

  return path.resolve(__dirname, '..', configuredPath);
};

const loadApiKeys = () => {
  const resolvedPath = getApiKeysPath();

  if (!resolvedPath) {
    cachedKeys = {};
    cachedPath = null;
    return cachedKeys;
  }

  if (cachedKeys && cachedPath === resolvedPath) {
    return cachedKeys;
  }

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`API keys file not found at: ${resolvedPath}`);
  }

  const fileContents = fs.readFileSync(resolvedPath, 'utf8').replace(/^\uFEFF/, '');
  cachedKeys = JSON.parse(fileContents);
  cachedPath = resolvedPath;

  return cachedKeys;
};

const getOptionalApiKey = (name, fallback = undefined) => {
  const apiKeys = loadApiKeys();
  const value = apiKeys[name];
  return value === undefined || value === '' ? fallback : value;
};

const getRequiredApiKey = (name) => {
  const value = getOptionalApiKey(name);

  if (!value) {
    throw new Error(`Missing required API key: ${name}`);
  }

  return value;
};

module.exports = {
  getApiKeysPath,
  getOptionalApiKey,
  getRequiredApiKey,
  loadApiKeys
};
