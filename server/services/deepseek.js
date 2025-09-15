const axios = require('axios');

let deepseekClient;
try {
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-deepseek-api-key-here') {
    console.warn('⚠️  DeepSeek API key not configured properly. Please set DEEPSEEK_API_KEY in your .env file.');
    deepseekClient = null;
  } else {
    deepseekClient = axios.create({
      baseURL: 'https://api.deepseek.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds timeout
    });
    console.log('✅ DeepSeek client initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize DeepSeek client:', error.message);
  deepseekClient = null;
}

async function generatePitch(idea) {
  if (!deepseekClient) {
    throw new Error('DeepSeek is not configured. Please set a valid DEEPSEEK_API_KEY in your .env file.');
  }

  const SYSTEM_PROMPT = `You are a professional pitch deck creator and startup advisor. 
Given a startup idea, create a compelling pitch with:
1. A catchy, memorable company name (2-3 words max)
2. A clear, compelling one-sentence elevator pitch
3. Exactly 4 HTML slides for a pitch deck

Each slide must be valid HTML with Tailwind CSS classes. Use modern, professional styling.
Slides should cover: Problem, Solution, Market/Business Model, and Call to Action.

Return ONLY valid JSON in this exact format:
{
  "name": "Company Name",
  "elevator": "One sentence elevator pitch that clearly explains the value proposition.",
  "slides": [
    "<section class='min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8 flex flex-col justify-center items-center'><h1 class='text-6xl font-bold mb-8'>Slide 1 Content</h1><p class='text-xl text-center max-w-4xl'>Description</p></section>",
    "<section class='min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white p-8 flex flex-col justify-center items-center'>Slide 2 HTML</section>",
    "<section class='min-h-screen bg-gradient-to-br from-pink-900 to-red-900 text-white p-8 flex flex-col justify-center items-center'>Slide 3 HTML</section>",
    "<section class='min-h-screen bg-gradient-to-br from-red-900 to-orange-900 text-white p-8 flex flex-col justify-center items-center'>Slide 4 HTML</section>"
  ]
}

Make it professional, visually appealing, and persuasive. Use appropriate gradients and ensure text is readable.`;

  try {
    const response = await deepseekClient.post('/chat/completions', {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create a pitch for this startup idea: ${idea}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const content = response.data.choices[0].message.content;
    const result = JSON.parse(content);

    if (!result.name || !result.elevator || !result.slides || !Array.isArray(result.slides)) {
      throw new Error('Invalid response structure from DeepSeek');
    }

    if (result.slides.length < 3 || result.slides.length > 5) {
      throw new Error('Invalid number of slides (should be 3-5)');
    }

    return result;

  } catch (error) {
    console.error('DeepSeek API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.response.statusText;
      
      if (status === 401) {
        throw new Error('Invalid DeepSeek API key. Please check your configuration.');
      } else if (status === 429) {
        throw new Error('DeepSeek API rate limit exceeded. Please try again later.');
      } else if (status === 402) {
        throw new Error('DeepSeek API quota exceeded. Please check your billing.');
      } else {
        throw new Error(`DeepSeek API error (${status}): ${message}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from DeepSeek API. Please check your internet connection.');
    } else if (error.name === 'SyntaxError') {
      throw new Error('Failed to parse DeepSeek response. The AI may have returned invalid JSON.');
    } else {
      throw new Error(`Failed to generate pitch: ${error.message}`);
    }
  }
}

module.exports = { generatePitch };
