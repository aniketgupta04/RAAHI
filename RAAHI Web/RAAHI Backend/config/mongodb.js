const mongoose = require('mongoose');
const { getRequiredEnv } = require('./env');

const DEFAULT_MONGO_OPTIONS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  family: 4
};

let listenersRegistered = false;

const getMongoUri = () => getRequiredEnv('MONGODB_URI');

const registerConnectionListeners = () => {
  if (listenersRegistered) {
    return;
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  listenersRegistered = true;
};

const connectMongoDB = async (options = {}) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    registerConnectionListeners();

    const conn = await mongoose.connect(getMongoUri(), {
      ...DEFAULT_MONGO_OPTIONS,
      ...options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

const disconnectMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const getMongoDb = () => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB is not connected');
  }

  return mongoose.connection.db;
};

module.exports = {
  DEFAULT_MONGO_OPTIONS,
  connectMongoDB,
  disconnectMongoDB,
  getMongoDb,
  getMongoUri
};
