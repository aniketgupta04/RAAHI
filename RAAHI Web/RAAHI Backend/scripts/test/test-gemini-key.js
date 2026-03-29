require('dotenv').config();
const { getOptionalApiKey } = require('../../config/apiKeys');

console.log('🔍 Checking Gemini API Key Configuration...\n');

const apiKey = getOptionalApiKey('geminiApiKey', process.env.GEMINI_API_KEY);

// Check if API key exists and is not placeholder
if (!apiKey || apiKey === 'your_actual_gemini_api_key_here' || apiKey === 'your_gemini_api_key_here') {
  console.log('❌ Gemini API key not set or still using placeholder');
  console.log('📋 Current value:', apiKey || 'undefined');
  console.log('\n🔧 To fix this:');
  console.log('1. Get your API key from: https://makersuite.google.com/app/apikey');
  console.log('2. Open the API keys JSON file configured in your backend .env');
  console.log('3. Replace the placeholder with your actual API key');
  console.log('4. Save and restart your server');
  process.exit(1);
} else {
  console.log('✅ Gemini API key is configured');
  console.log('🔑 Key preview:', apiKey.substring(0, 15) + '...');
  
  // Validate key format
  if (apiKey.startsWith('AIzaSy') && apiKey.length >= 35) {
    console.log('✅ API key format looks correct');
  } else {
    console.log('⚠️  API key format might be incorrect');
    console.log('   Expected format: AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('   Your key starts with:', apiKey.substring(0, 10));
  }
}

// Test AI Service initialization
console.log('\n🤖 Testing AI Service...');
try {
  const aiService = require('../../services/aiService');
  
  // Give it a moment to initialize
  setTimeout(() => {
    if (aiService.initialized) {
      console.log('✅ AI Service initialized successfully');
      console.log('🚀 Ready to use Gemini AI features!');
    } else {
      console.log('❌ AI Service failed to initialize');
      console.log('💡 Check server console for error details');
    }
  }, 1000);
  
} catch (error) {
  console.log('❌ Error loading AI Service:', error.message);
}

console.log('\n📋 Next steps:');
console.log('1. Run: npm start (to start your server)');
console.log('2. Look for: "✅ Gemini AI service initialized"');
console.log('3. Test the chatbot in your application');

console.log('\n🔗 Useful links:');
console.log('- Get API key: https://makersuite.google.com/app/apikey');
console.log('- Gemini docs: https://ai.google.dev/docs');
console.log('- Setup guide: ./GEMINI_API_SETUP.md');
