const { generatePitch } = require('./deepseek');
const axios = require('axios');

/**
 * Generate a comprehensive AI code prompt for a startup idea
 * This service creates detailed prompts that can be used with AI coding tools
 * to scaffold full-stack MERN applications
 */

/**
 * Generate code prompt using a comprehensive template
 * @param {string} idea - The startup idea description
 * @returns {Promise<string>} - Generated code prompt
 */
async function generateCodePrompt(idea) {
  try {
    // Option A: Use DeepSeek API to enhance the prompt dynamically
    const enhancedPrompt = await generateEnhancedPrompt(idea);
    return enhancedPrompt;
  } catch (error) {
    console.warn('DeepSeek API unavailable, falling back to template-based generation:', error.message);
    // Option B: Fallback to static template generation
    return generateTemplatePrompt(idea);
  }
}

/**
 * Generate enhanced prompt using DeepSeek API
 * @param {string} idea - The startup idea description  
 * @returns {Promise<string>} - AI-enhanced code prompt
 */
async function generateEnhancedPrompt(idea) {
  // Use the existing DeepSeek service but with a different system prompt
  const SYSTEM_PROMPT = `You are an expert full-stack developer and project architect. 
Given a startup idea, create a comprehensive, detailed prompt that another AI coding assistant can use to generate a complete MERN stack application.

The prompt should include:
1. Clear project overview and goals
2. Detailed technical requirements (MERN stack)
3. Folder structure specification
4. Frontend requirements (React + Tailwind CSS)
5. Backend requirements (Node.js + Express)
6. Database schema (MongoDB)
7. API endpoints specification
8. Authentication requirements (if needed)
9. Environment setup instructions
10. Package dependencies
11. Step-by-step setup and run instructions

Make the prompt extremely detailed and actionable so that an AI can generate production-ready code.

Return ONLY the code generation prompt as plain text, no JSON formatting.`;

  // Use axios instead of fetch
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Create a comprehensive code generation prompt for this startup idea: ${idea}`
      }
    ],
    temperature: 0.7,
    max_tokens: 3000
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000
  });

  return response.data.choices[0].message.content;
}

/**
 * Generate prompt using static template (fallback method)
 * @param {string} idea - The startup idea description
 * @returns {string} - Template-based code prompt
 */
function generateTemplatePrompt(idea) {
  return `# MERN Stack Application Development Prompt

## Project Overview
Create a complete MERN (MongoDB, Express.js, React, Node.js) stack application for the following startup idea:

**Startup Idea:** ${idea}

## Technical Requirements

### Technology Stack
- **Frontend:** React 18+ with Vite
- **CSS Framework:** Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based authentication
- **Package Manager:** npm

### Project Structure
Create the following folder structure:
\`\`\`
project-name/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend  
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── README.md
└── .gitignore
\`\`\`

### Frontend Requirements (React + Tailwind)
1. **Components:**
   - Header/Navigation
   - Landing page
   - User authentication (login/register)
   - Main application features
   - Footer

2. **Styling:**
   - Use Tailwind CSS for all styling
   - Responsive design (mobile-first)
   - Modern, clean UI/UX
   - Dark/light theme support

3. **State Management:**
   - Use React Context API or Redux Toolkit
   - Implement proper error handling
   - Loading states for async operations

4. **Key Features to Implement:**
   - User registration and login
   - Protected routes
   - Core functionality based on the startup idea
   - User dashboard
   - Profile management

### Backend Requirements (Node.js + Express)
1. **API Structure:**
   - RESTful API design
   - Proper HTTP status codes
   - JSON responses
   - Error handling middleware

2. **Authentication:**
   - JWT token-based authentication
   - Password hashing with bcrypt
   - Protected routes middleware
   - Refresh token mechanism

3. **Database Models (MongoDB):**
   - User model (authentication)
   - Core business models based on the startup idea
   - Proper mongoose schemas with validation

4. **API Endpoints:**
   - \`POST /api/auth/register\` - User registration
   - \`POST /api/auth/login\` - User login
   - \`GET /api/auth/profile\` - Get user profile
   - \`PUT /api/auth/profile\` - Update user profile
   - Additional endpoints based on the startup idea

### Database Schema (MongoDB)
Design appropriate schemas based on the startup idea, including:

1. **User Schema:**
   - name, email, password (hashed)
   - role, createdAt, updatedAt
   - Additional fields based on requirements

2. **Business Logic Schemas:**
   - Design schemas specific to the startup idea
   - Include proper relationships
   - Add indexes for performance

### Environment Configuration
Create environment files:

**server/.env:**
\`\`\`
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
\`\`\`

**client/.env:**
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

### Package Dependencies

**Client (package.json):**
\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "@heroicons/react": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
\`\`\`

**Server (package.json):**
\`\`\`json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.0",
    "dotenv": "^16.0.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^6.1.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
\`\`\`

### Setup and Run Instructions

1. **Clone and Setup:**
   \`\`\`bash
   # Create project directory
   mkdir project-name && cd project-name
   
   # Initialize git
   git init
   \`\`\`

2. **Backend Setup:**
   \`\`\`bash
   cd server
   npm init -y
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-rate-limit helmet
   npm install -D nodemon
   
   # Create .env file with your MongoDB URI and JWT secret
   # Start development server
   npm run dev
   \`\`\`

3. **Frontend Setup:**
   \`\`\`bash
   cd ../client
   npm create vite@latest . -- --template react
   npm install
   npm install react-router-dom axios @heroicons/react
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   
   # Start development server
   npm run dev
   \`\`\`

4. **Database Setup:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update connection string in server/.env
   - Database will be created automatically when the app runs

### Additional Implementation Guidelines

1. **Security Best Practices:**
   - Implement proper input validation
   - Use helmet for security headers
   - Rate limiting for API endpoints
   - Sanitize user inputs

2. **Code Quality:**
   - Use ESLint and Prettier
   - Write clean, commented code
   - Implement proper error handling
   - Use async/await for async operations

3. **Testing (Optional):**
   - Unit tests for utilities
   - Integration tests for API endpoints
   - Component tests for React components

4. **Deployment Preparation:**
   - Build scripts in package.json
   - Environment-specific configurations
   - Docker configuration (optional)

## Implementation Priority

1. Start with backend API structure and authentication
2. Implement core database models
3. Create basic React frontend with routing
4. Implement authentication flow
5. Build core features specific to the startup idea
6. Add styling and responsive design
7. Testing and optimization

Generate a complete, production-ready MERN stack application following these specifications. Focus on clean code, proper architecture, and the specific requirements of the startup idea provided.`;
}

module.exports = { generateCodePrompt };
