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

  const SYSTEM_PROMPT = `You are a professional pitch deck designer and startup advisor. 
Given a startup idea, create a compelling pitch with:
1. A catchy, memorable company name (2-3 words max)
2. A clear, compelling one-sentence elevator pitch
3. Exactly 4 HTML slides for a pitch deck with modern, professional design

Each slide must be valid HTML with Tailwind CSS classes. Use cutting-edge design:
- Professional gradient backgrounds with modern color palettes
- Bold typography with proper hierarchy
- Icons and visual elements (use Unicode icons: 🚀, 💡, 📈, 🎯, 💰, 🌟, ⚡, 🔥, 💎, 🏆)
- Proper spacing and layout
- High contrast for readability
- Professional shadows and effects

Slides should cover: Problem, Solution, Market/Business Model, and Call to Action.

Use these modern gradient combinations:
- Slide 1 (Problem): from-slate-900 via-purple-900 to-slate-900
- Slide 2 (Solution): from-blue-900 via-indigo-900 to-purple-900  
- Slide 3 (Market/Business): from-emerald-900 via-teal-900 to-cyan-900
- Slide 4 (Call to Action): from-rose-900 via-pink-900 to-purple-900

Return ONLY valid JSON in this exact format:
{
  "name": "Company Name",
  "elevator": "One sentence elevator pitch that clearly explains the value proposition.",
  "slides": [
    "<section class='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-12 flex flex-col justify-center items-center relative overflow-hidden'><div class='absolute inset-0 bg-black/20'></div><div class='relative z-10 text-center max-w-6xl mx-auto'><div class='text-6xl mb-6'>🔥</div><h1 class='text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent leading-tight'>THE PROBLEM</h1><p class='text-2xl md:text-3xl text-purple-100 font-light leading-relaxed mb-8'>Problem description here</p><div class='w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full'></div></div></section>",
    "<section class='min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-12 flex flex-col justify-center items-center relative overflow-hidden'><div class='absolute inset-0 bg-black/20'></div><div class='relative z-10 text-center max-w-6xl mx-auto'><div class='text-6xl mb-6'>💡</div><h1 class='text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight'>OUR SOLUTION</h1><p class='text-2xl md:text-3xl text-blue-100 font-light leading-relaxed mb-8'>Solution description here</p><div class='w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full'></div></div></section>",
    "<section class='min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-12 flex flex-col justify-center items-center relative overflow-hidden'><div class='absolute inset-0 bg-black/20'></div><div class='relative z-10 text-center max-w-6xl mx-auto'><div class='text-6xl mb-6'>📈</div><h1 class='text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent leading-tight'>MARKET</h1><p class='text-2xl md:text-3xl text-emerald-100 font-light leading-relaxed mb-8'>Market and business model here</p><div class='w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full'></div></div></section>",
    "<section class='min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 text-white p-12 flex flex-col justify-center items-center relative overflow-hidden'><div class='absolute inset-0 bg-black/20'></div><div class='relative z-10 text-center max-w-6xl mx-auto'><div class='text-6xl mb-6'>🚀</div><h1 class='text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent leading-tight'>LET'S BUILD</h1><p class='text-2xl md:text-3xl text-rose-100 font-light leading-relaxed mb-8'>Call to action here</p><div class='w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full'></div></div></section>"
  ]
}

Make each slide visually stunning, professional, and persuasive. Use bold typography, appropriate icons, and ensure perfect readability with high contrast.`;

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
