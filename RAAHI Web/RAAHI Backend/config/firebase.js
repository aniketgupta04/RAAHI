const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { getOptionalEnv } = require('./env');

const getServiceAccountFromEnv = () => {
  const privateKey = getOptionalEnv('FIREBASE_PRIVATE_KEY');
  const clientEmail = getOptionalEnv('FIREBASE_CLIENT_EMAIL');
  const projectId = getOptionalEnv('FIREBASE_PROJECT_ID');

  if (!privateKey || !clientEmail || !projectId || projectId === 'your-project-id') {
    return null;
  }

  return {
    type: 'service_account',
    project_id: projectId,
    private_key_id: getOptionalEnv('FIREBASE_PRIVATE_KEY_ID'),
    private_key: privateKey.replace(/\\n/g, '\n'),
    client_email: clientEmail,
    client_id: getOptionalEnv('FIREBASE_CLIENT_ID'),
    auth_uri: getOptionalEnv('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
    token_uri: getOptionalEnv('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: getOptionalEnv(
      'FIREBASE_CLIENT_CERT_URL',
      `https://www.googleapis.com/robot/v1/metadata/x509/${clientEmail}`
    )
  };
};

const getServiceAccountFromFile = () => {
  const configuredPath = getOptionalEnv('FIREBASE_SERVICE_ACCOUNT_PATH');

  if (!configuredPath) {
    return null;
  }

  const resolvedPath = path.resolve(__dirname, '..', configuredPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Firebase service account key file not found at: ${resolvedPath}`);
  }

  return require(resolvedPath);
};

const getServiceAccount = () => {
  const fromEnv = getServiceAccountFromEnv();
  if (fromEnv) {
    console.log('Using Firebase credentials from environment variables');
    return fromEnv;
  }

  const fromFile = getServiceAccountFromFile();
  if (fromFile) {
    console.log('Using Firebase credentials from service account file path');
    return fromFile;
  }

  throw new Error(
    'Firebase configuration not found. Set FIREBASE_* environment variables or FIREBASE_SERVICE_ACCOUNT_PATH.'
  );
};

const getFirebaseConfig = (serviceAccount) => {
  const projectId = serviceAccount.project_id || getOptionalEnv('FIREBASE_PROJECT_ID');

  return {
    projectId,
    databaseURL: getOptionalEnv(
      'FIREBASE_DATABASE_URL',
      `https://${projectId}-default-rtdb.firebaseio.com/`
    ),
    storageBucket: getOptionalEnv(
      'FIREBASE_STORAGE_BUCKET',
      `${projectId}.firebasestorage.app`
    )
  };
};

const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = getServiceAccount();
      const firebaseConfig = getFirebaseConfig(serviceAccount);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: firebaseConfig.databaseURL,
        storageBucket: firebaseConfig.storageBucket
      });

      console.log('Firebase Admin SDK initialized successfully');
    }

    return {
      auth: admin.auth(),
      database: admin.database(),
      firestore: admin.firestore(),
      storage: admin.storage(),
      messaging: admin.messaging()
    };
  } catch (error) {
    console.error('Error initializing Firebase:', error.message);
    throw error;
  }
};

module.exports = { initializeFirebase, admin };
