// Test DeepSeek API integration
require('dotenv').config();
const { generatePitch } = require('./services/deepseek');

async function testDeepSeek() {
  try {
    console.log('Testing DeepSeek API integration...');
    console.log('API Key configured:', process.env.DEEPSEEK_API_KEY ? 'Yes' : 'No');
    console.log('Model:', process.env.DEEPSEEK_MODEL || 'deepseek-chat');
    
    // Only test if API key is configured
    if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your-deepseek-api-key-here') {
      const testIdea = "A mobile app that helps people find and book local fitness classes in their neighborhood";
      const result = await generatePitch(testIdea);
      
      console.log('✅ DeepSeek API test successful!');
      console.log('Company Name:', result.name);
      console.log('Elevator Pitch:', result.elevator);
      console.log('Number of slides:', result.slides.length);
    } else {
      console.log('⚠️  DeepSeek API key not configured. Please add your API key to .env file.');
      console.log('Set DEEPSEEK_API_KEY=your-actual-deepseek-api-key');
    }
    
  } catch (error) {
    console.error('❌ DeepSeek API test failed:', error.message);
  }
}

testDeepSeek();
