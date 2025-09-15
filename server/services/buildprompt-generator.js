const axios = require('axios');

async function generateBuildPrompt(idea, pitchData) {
  const systemPrompt = `You are a senior full-stack developer. Create a concise MERN development prompt (max 800 words) for AI coding assistants.

Include:
1. Project overview & tech stack
2. Key features (3-5 main ones)
3. Database schema outline
4. API endpoints list
5. Frontend components structure
6. Setup instructions

Keep it actionable and focused. Return only the prompt text.`;

  const userPrompt = `Startup idea: ${idea}${pitchData?.name ? `\nCompany: ${pitchData.name}` : ''}${pitchData?.elevator ? `\nPitch: ${pitchData.elevator}` : ''}`;

  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.warn('DeepSeek API error, using template:', error.message);
    return generateTemplatePrompt(idea, pitchData);
  }
}

function generateTemplatePrompt(idea, pitchData) {
  const companyName = pitchData?.name || 'YourStartup';
  
  return `# ${companyName} - MERN Stack Development

## Project Overview
Build a modern web application for: ${idea}

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT tokens

## Key Features
- User authentication & profiles
- Core business logic implementation  
- Responsive design
- API integration
- Data management

## Database Schema
\`\`\`javascript
// User Model
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}

// Main Entity Model (customize based on idea)
{
  title: String,
  description: String,
  userId: ObjectId,
  createdAt: Date
}
\`\`\`

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user/profile
- GET /api/data (main resource)
- POST /api/data (create)
- PUT /api/data/:id (update)
- DELETE /api/data/:id (delete)

## Frontend Structure
\`\`\`
src/
├── components/
│   ├── Auth/
│   ├── Dashboard/
│   └── Common/
├── pages/
├── services/
└── hooks/
\`\`\`

## Setup Instructions
1. Create project structure
2. Install dependencies
3. Set up environment variables
4. Configure database connection  
5. Implement authentication
6. Build core features
7. Add styling and responsive design

Generate production-ready code with error handling, validation, and modern best practices.`;
}

module.exports = { generateBuildPrompt };
