const bcrypt = require('bcryptjs');
const { connectMongoDB, disconnectMongoDB, getMongoDb } = require('../../../config/mongodb');

async function fixUserPassword() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    console.log('Connected to MongoDB');
    
    // Get the users collection
    const db = getMongoDb();
    const usersCollection = db.collection('users');
    
    // Find the user
    const user = await usersCollection.findOne({ email: 'bbsfan99@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📋 Found user:', {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    });
    
    // Hash a new password properly (just once)
    const newPassword = '123456'; // The password they're trying to use
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password directly
    const result = await usersCollection.updateOne(
      { email: 'bbsfan99@gmail.com' },
      { $set: { password: hashedPassword } }
    );
    
    console.log('✅ Password updated successfully');
    console.log('📝 Modified count:', result.modifiedCount);
    
    // Test the password
    const updatedUser = await usersCollection.findOne({ email: 'bbsfan99@gmail.com' });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    
    console.log('🔑 Password test:', isMatch ? '✅ Valid' : '❌ Invalid');
    
    // Close connection
    await disconnectMongoDB();
    console.log('Connection closed');
    
  } catch (error) {
    await disconnectMongoDB();
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUserPassword();
