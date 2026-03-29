const mongoose = require('mongoose');
const { connectMongoDB, disconnectMongoDB } = require('./mongodb');
const { initializeFirebase } = require('./firebase');

class DatabaseManager {
  constructor() {
    this.mongoConnection = null;
    this.firebaseServices = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      console.log('🔗 Initializing database connections...');

      // Connect to MongoDB
      try {
        this.mongoConnection = await connectMongoDB();
        console.log('✅ MongoDB connection established');
      } catch (mongoError) {
        console.warn('⚠️  MongoDB connection failed:', mongoError.message);
        console.log('📝 Server will continue without MongoDB - please check your MongoDB connection');
      }

      // Initialize Firebase (optional for now)
      try {
        const hasFirebaseEnvConfig =
          process.env.FIREBASE_PROJECT_ID &&
          process.env.FIREBASE_PROJECT_ID !== 'your-project-id';
        const hasFirebaseServiceAccountPath =
          process.env.FIREBASE_SERVICE_ACCOUNT_PATH &&
          process.env.FIREBASE_SERVICE_ACCOUNT_PATH !== 'API Keys/your-service-account.json';

        if (hasFirebaseEnvConfig || hasFirebaseServiceAccountPath) {
          this.firebaseServices = initializeFirebase();
          console.log('✅ Firebase services initialized');
        } else {
          console.log('⚠️  Firebase not configured - skipping Firebase initialization');
          this.firebaseServices = null;
        }
      } catch (firebaseError) {
        console.warn('⚠️  Firebase initialization failed:', firebaseError.message);
        console.log('📝 Server will continue without Firebase - update .env with proper Firebase credentials');
        this.firebaseServices = null;
      }

      this.isConnected = true;
      console.log('🎉 Database connections established successfully');

      return {
        mongodb: true,
        firebase: this.firebaseServices
      };

    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('📝 Server will start without database connection. Some features may not work.');
      // Don't throw error - allow server to start
      return {
        mongodb: false,
        firebase: this.firebaseServices
      };
    }
  }

  getFirebaseServices() {
    if (!this.firebaseServices) {
      throw new Error('Firebase not initialized. Call connect() first.');
    }
    return this.firebaseServices;
  }

  async disconnect() {
    try {
      await disconnectMongoDB();
      console.log('🔌 MongoDB connection closed');

      this.isConnected = false;
      console.log('👋 All database connections closed');

    } catch (error) {
      console.error('❌ Error disconnecting from databases:', error.message);
      throw error;
    }
  }

  isHealthy() {
    return {
      mongodb: mongoose.connection.readyState === 1,
      firebase: this.firebaseServices !== null,
      overall: this.isConnected && mongoose.connection.readyState === 1
    };
  }

  async testConnections() {
    const health = this.isHealthy();
    const results = {
      mongodb: { status: 'disconnected', latency: null, error: null },
      firebase: { status: 'disconnected', latency: null, error: null }
    };

    // Test MongoDB
    if (health.mongodb) {
      try {
        const start = Date.now();
        await mongoose.connection.db.admin().ping();
        results.mongodb = {
          status: 'connected',
          latency: Date.now() - start,
          error: null
        };
      } catch (error) {
        results.mongodb = {
          status: 'error',
          latency: null,
          error: error.message
        };
      }
    }

    // Test Firebase
    if (health.firebase) {
      try {
        const start = Date.now();
        await this.firebaseServices.database.ref('.info/connected').once('value');
        results.firebase = {
          status: 'connected',
          latency: Date.now() - start,
          error: null
        };
      } catch (error) {
        results.firebase = {
          status: 'error',
          latency: null,
          error: error.message
        };
      }
    }

    return results;
  }
}

// Export singleton instance
const databaseManager = new DatabaseManager();
module.exports = databaseManager;
