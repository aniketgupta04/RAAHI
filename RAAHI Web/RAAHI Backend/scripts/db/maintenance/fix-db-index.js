const { connectMongoDB, disconnectMongoDB, getMongoDb } = require('../../../config/mongodb');

async function fixUsernameIndex() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    console.log('Connected to MongoDB');
    
    // Get the users collection
    const db = getMongoDb();
    const usersCollection = db.collection('users');
    
    // List all indexes
    console.log('Current indexes:');
    const indexes = await usersCollection.listIndexes().toArray();
    console.log(JSON.stringify(indexes, null, 2));
    
    // Try to drop the problematic username index
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('ℹ️ username_1 index not found (may have been already dropped)');
      } else {
        console.log('❌ Error dropping username_1 index:', error.message);
      }
    }
    
    // List existing users
    console.log('\nExisting users:');
    const users = await usersCollection.find({}, { projection: { email: 1, firstName: 1, lastName: 1, createdAt: 1 } }).toArray();
    console.log(JSON.stringify(users, null, 2));
    
    // Close connection
    await disconnectMongoDB();
    console.log('Connection closed');
    
  } catch (error) {
    await disconnectMongoDB();
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUsernameIndex();
