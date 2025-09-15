const axios = require('axios');

/**
 * Enhanced AI Code Prompt Generation Service
 * Generates comprehensive, structured prompts for AI coding tools
 * with tech stack recommendations and project structure guidance
 */

/**
 * Generate enhanced code prompt with comprehensive project data
 * @param {Object} params - Generation parameters
 * @param {string} params.idea - The startup idea description
 * @param {Object} [params.pitchData] - Optional pitch data
 * @returns {Promise<Object>} Enhanced prompt data
 */
async function generateEnhancedCodePrompt({ idea, pitchData }) {
  try {
    console.log('🚀 Generating enhanced code prompt...');
    
    // Option A: Use DeepSeek API for dynamic generation
    const enhancedData = await generateDynamicPrompt(idea, pitchData);
    return enhancedData;
  } catch (error) {
    console.warn('⚠️  DeepSeek API unavailable, using template generation:', error.message);
    
    // Option B: Fallback to intelligent template generation
    return generateIntelligentTemplate(idea, pitchData);
  }
}

/**
 * Generate dynamic prompt using DeepSeek API with structured output
 * @param {string} idea - Startup idea description
 * @param {Object} pitchData - Pitch data including name, elevator, slides
 * @returns {Promise<Object>} Structured prompt data
 */
async function generateDynamicPrompt(idea, pitchData) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured');
  }

  const systemPrompt = createAdvancedSystemPrompt(pitchData);
  const userPrompt = createUserPrompt(idea, pitchData);

  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 90000 // Extended timeout for comprehensive generation
  });

  const generatedContent = response.data.choices[0].message.content;
  
  // Parse and structure the response
  return parseStructuredResponse(generatedContent, idea, pitchData);
}

/**
 * Create advanced system prompt for comprehensive code generation
 * @param {Object} pitchData - Pitch data for context
 * @returns {string} System prompt
 */
function createAdvancedSystemPrompt(pitchData) {
  return `You are an expert full-stack developer, solution architect, and startup advisor with deep expertise in MERN stack development, modern web technologies, and scalable application architecture.

Your task is to generate a comprehensive, production-ready development prompt that another AI coding assistant can use to build a complete startup application.

RESPONSE STRUCTURE (return as JSON):
{
  "prompt": "Complete development prompt text",
  "techStack": ["Technology 1", "Technology 2", ...],
  "fileStructure": {
    "client/": ["src/", "public/", "package.json"],
    "server/": ["routes/", "models/", "services/", "package.json"]
  },
  "summary": "Brief project summary",
  "features": ["Feature 1", "Feature 2", ...]
}

REQUIREMENTS FOR THE DEVELOPMENT PROMPT:
1. **Project Overview**: Clear description, objectives, and success criteria
2. **Technical Architecture**: MERN stack with modern best practices
3. **Detailed Features**: Core functionality, user flows, and edge cases
4. **Database Design**: MongoDB schemas with relationships
5. **API Specification**: RESTful endpoints with request/response examples
6. **Frontend Architecture**: React components, state management, routing
7. **Authentication & Security**: JWT, password hashing, input validation
8. **File Structure**: Complete folder organization
9. **Environment Setup**: Step-by-step installation and configuration
10. **Testing Strategy**: Unit and integration test requirements
11. **Deployment Guidelines**: Production deployment considerations
12. **Performance Optimization**: Caching, bundling, lazy loading
13. **Error Handling**: Comprehensive error management
14. **Documentation**: Code comments and API documentation

TECH STACK INTELLIGENCE:
- Analyze the idea and recommend appropriate additional technologies
- Consider authentication needs, payment processing, real-time features, etc.
- Suggest modern tools: TypeScript, Tailwind CSS, Socket.io, Stripe, etc.

The prompt should be comprehensive enough that an AI can generate production-quality code with minimal additional guidance.`;
}

/**
 * Create user prompt with idea and pitch context
 * @param {string} idea - Startup idea
 * @param {Object} pitchData - Pitch information
 * @returns {string} User prompt
 */
function createUserPrompt(idea, pitchData) {
  let prompt = `Generate a comprehensive development prompt for this startup idea:

**Idea:** ${idea}`;
  
  if (pitchData) {
    if (pitchData.name) {
      prompt += `

**Company Name:** ${pitchData.name}`;
    }
    if (pitchData.elevator) {
      prompt += `

**Elevator Pitch:** ${pitchData.elevator}`;
    }
    if (pitchData.slides && pitchData.slides.length > 0) {
      prompt += `

**Business Context:**`;
      pitchData.slides.forEach((slide, index) => {
        if (slide.content) {
          // Extract text content from HTML slides
          const textContent = slide.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          if (textContent) {
            prompt += `
- Slide ${index + 1}: ${textContent.substring(0, 200)}...`;
          }
        }
      });
    }
  }
  
  prompt += `

Create a detailed development prompt that covers all technical and business requirements for building this application as a complete MERN stack solution.`;
  
  return prompt;
}

/**
 * Parse structured response from DeepSeek API
 * @param {string} content - Raw response content
 * @param {string} idea - Original idea for fallback
 * @param {Object} pitchData - Pitch data for fallback
 * @returns {Object} Structured prompt data
 */
function parseStructuredResponse(content, idea, pitchData) {
  try {
    // Try to parse as JSON first
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (parsedData.prompt && parsedData.techStack) {
        return {
          prompt: parsedData.prompt,
          techStack: Array.isArray(parsedData.techStack) ? parsedData.techStack : [],
          fileStructure: parsedData.fileStructure || generateDefaultFileStructure(),
          summary: parsedData.summary || generateSummary(idea, pitchData),
          features: parsedData.features || []
        };
      }
    }
    
    // Fallback: treat entire content as prompt
    return {
      prompt: content,
      techStack: inferTechStack(idea, content),
      fileStructure: generateDefaultFileStructure(),
      summary: generateSummary(idea, pitchData),
      features: extractFeatures(content, idea)
    };
  } catch (error) {
    console.warn('Failed to parse structured response, using fallback:', error.message);
    
    return {
      prompt: content,
      techStack: inferTechStack(idea, content),
      fileStructure: generateDefaultFileStructure(),
      summary: generateSummary(idea, pitchData),
      features: extractFeatures(content, idea)
    };
  }
}

/**
 * Generate intelligent template when API is unavailable
 * @param {string} idea - Startup idea
 * @param {Object} pitchData - Pitch data
 * @returns {Object} Template-based prompt data
 */
function generateIntelligentTemplate(idea, pitchData) {
  const techStack = inferTechStack(idea);
  const features = extractFeaturesFromIdea(idea);
  const summary = generateSummary(idea, pitchData);
  
  const prompt = createComprehensiveTemplate({
    idea,
    pitchData,
    techStack,
    features,
    summary
  });
  
  return {
    prompt,
    techStack,
    fileStructure: generateDefaultFileStructure(),
    summary,
    features
  };
}

/**
 * Infer technology stack from idea and content
 * @param {string} idea - Startup idea
 * @param {string} [content] - Additional content to analyze
 * @returns {string[]} Recommended tech stack
 */
function inferTechStack(idea, content = '') {
  const analysisText = (idea + ' ' + content).toLowerCase();
  const baseStack = ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS'];
  const additionalTech = [];
  
  // Authentication
  if (analysisText.includes('login') || analysisText.includes('user') || analysisText.includes('account')) {
    additionalTech.push('JWT', 'bcrypt');
  }
  
  // Payments
  if (analysisText.includes('pay') || analysisText.includes('subscription') || analysisText.includes('purchase')) {
    additionalTech.push('Stripe');
  }
  
  // Real-time features
  if (analysisText.includes('chat') || analysisText.includes('live') || analysisText.includes('real-time')) {
    additionalTech.push('Socket.io');
  }
  
  // File uploads
  if (analysisText.includes('upload') || analysisText.includes('photo') || analysisText.includes('image')) {
    additionalTech.push('Multer', 'Cloudinary');
  }
  
  // Email
  if (analysisText.includes('email') || analysisText.includes('notification')) {
    additionalTech.push('Nodemailer');
  }
  
  // API documentation
  additionalTech.push('Swagger/OpenAPI');
  
  // Development tools
  additionalTech.push('Vite', 'ESLint', 'Prettier');
  
  return [...baseStack, ...additionalTech];
}

/**
 * Extract features from idea text
 * @param {string} idea - Startup idea
 * @returns {string[]} Extracted features
 */
function extractFeaturesFromIdea(idea) {
  const features = [];
  const lowerIdea = idea.toLowerCase();
  
  // Common feature patterns
  const featurePatterns = [
    { pattern: /user.*registration|sign.*up|create.*account/, feature: 'User Registration & Authentication' },
    { pattern: /login|sign.*in|authenticate/, feature: 'User Login System' },
    { pattern: /profile|dashboard/, feature: 'User Dashboard & Profile Management' },
    { pattern: /search|find|discover/, feature: 'Search & Discovery' },
    { pattern: /chat|message|communication/, feature: 'Real-time Messaging' },
    { pattern: /payment|pay|subscription|billing/, feature: 'Payment Processing' },
    { pattern: /upload|share|post/, feature: 'Content Upload & Sharing' },
    { pattern: /notification|alert/, feature: 'Notification System' },
    { pattern: /admin|management/, feature: 'Admin Panel' },
    { pattern: /mobile|responsive/, feature: 'Mobile-Responsive Design' },
    { pattern: /api|integration/, feature: 'RESTful API' },
    { pattern: /social|network/, feature: 'Social Features' },
    { pattern: /analytics|tracking/, feature: 'Analytics & Tracking' },
    { pattern: /review|rating|feedback/, feature: 'Review & Rating System' }
  ];
  
  featurePatterns.forEach(({ pattern, feature }) => {
    if (pattern.test(lowerIdea)) {
      features.push(feature);
    }
  });
  
  // Ensure minimum features
  if (features.length === 0) {
    features.push('Core Application Logic', 'User Interface', 'Data Management');
  }
  
  return features;
}

/**
 * Generate project summary
 * @param {string} idea - Startup idea
 * @param {Object} pitchData - Pitch data
 * @returns {string} Project summary
 */
function generateSummary(idea, pitchData) {
  if (pitchData?.elevator) {
    return pitchData.elevator;
  }
  
  const sentences = idea.split('.').filter(s => s.trim().length > 0);
  return sentences[0]?.trim() + '.' || idea.substring(0, 150) + '...';
}

/**
 * Generate default file structure
 * @returns {Object} Default MERN project structure
 */
function generateDefaultFileStructure() {
  return {
    "client/": {
      "public/": ["index.html", "favicon.ico"],
      "src/": {
        "components/": ["Header.jsx", "Footer.jsx", "Layout.jsx"],
        "pages/": ["Home.jsx", "Login.jsx", "Dashboard.jsx"],
        "services/": ["api.js", "auth.js"],
        "utils/": ["helpers.js", "constants.js"],
        "hooks/": ["useAuth.js", "useApi.js"],
        "context/": ["AuthContext.jsx"]
      },
      "package.json": null,
      "vite.config.js": null,
      "tailwind.config.js": null
    },
    "server/": {
      "routes/": ["auth.js", "users.js", "api.js"],
      "models/": ["User.js", "Data.js"],
      "middleware/": ["auth.js", "validation.js"],
      "services/": ["database.js", "email.js"],
      "utils/": ["helpers.js", "validators.js"],
      "config/": ["database.js", "environment.js"]
    },
    "package.json": null,
    "README.md": null,
    ".env.example": null
  };
}

/**
 * Extract features from generated content
 * @param {string} content - Generated content
 * @param {string} idea - Original idea
 * @returns {string[]} Extracted features
 */
function extractFeatures(content, idea) {
  const features = extractFeaturesFromIdea(idea);
  
  // Extract additional features from content
  const contentFeatures = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('websocket') || lowerContent.includes('socket.io')) {
    contentFeatures.push('Real-time Features');
  }
  if (lowerContent.includes('stripe') || lowerContent.includes('payment')) {
    contentFeatures.push('Payment Integration');
  }
  if (lowerContent.includes('jwt') || lowerContent.includes('authentication')) {
    contentFeatures.push('Authentication System');
  }
  
  return [...new Set([...features, ...contentFeatures])];
}

/**
 * Create comprehensive template prompt
 * @param {Object} params - Template parameters
 * @returns {string} Complete template prompt
 */
function createComprehensiveTemplate({ idea, pitchData, techStack, features, summary }) {
  const companyName = pitchData?.name || 'YourStartup';
  
  return `# ${companyName} - Complete MERN Stack Development Guide

## Project Overview
${summary}

**Original Idea:** ${idea}

## Project Requirements

### Core Features
${features.map(feature => `- ${feature}`).join('\n')}

### Technology Stack
${techStack.map(tech => `- ${tech}`).join('\n')}

## Detailed Development Instructions

### 1. Project Setup & Structure
Create a full-stack MERN application with the following structure:

\`\`\`
project-root/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls and utilities
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration files
│   └── server.js           # Entry point
├── package.json            # Root package.json for scripts
├── README.md
└── .env.example
\`\`\`

### 2. Backend Development

#### Database Models (MongoDB/Mongoose)
Create Mongoose schemas for:
- User authentication and profiles
- Core data entities based on the business logic
- Relationships between entities

#### API Endpoints
Design RESTful API with the following structure:
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/profile\` - Get user profile
- Additional endpoints based on features

#### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting

### 3. Frontend Development

#### React Components
- Create responsive, accessible components
- Use React hooks for state management
- Implement proper error boundaries
- Follow component composition patterns

#### State Management
- Use React Context for global state
- Implement custom hooks for business logic
- Handle loading and error states

#### UI/UX Design
- Mobile-first responsive design
- Modern UI with Tailwind CSS
- Consistent design system
- Accessible components

### 4. Integration & Features
${features.map(feature => `- Implement ${feature} with full functionality`).join('\n')}

### 5. Environment Setup

#### Dependencies
**Frontend:**
\`\`\`bash
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom @headlessui/react
npm install -D tailwindcss postcss autoprefixer
\`\`\`

**Backend:**
\`\`\`bash
npm init -y
npm install express mongoose cors helmet bcryptjs jsonwebtoken dotenv
npm install -D nodemon
\`\`\`

#### Environment Variables
Create \`.env\` file with:
- MongoDB connection string
- JWT secret
- API keys (if needed)
- Server port configuration

### 6. Development Workflow

1. Set up the project structure
2. Configure development environment
3. Implement authentication system
4. Build core backend API
5. Create React frontend components
6. Integrate frontend with backend
7. Add advanced features
8. Implement error handling
9. Add input validation
10. Test all functionality

### 7. Production Considerations

- Environment configuration
- Database optimization
- Security hardening
- Performance monitoring
- Error logging
- Backup strategies

## Getting Started

1. Clone or create the project structure
2. Install dependencies for both client and server
3. Set up environment variables
4. Start MongoDB service
5. Run \`npm run dev\` to start both frontend and backend
6. Begin development following the outlined structure

## Testing Strategy

- Unit tests for utilities and services
- Integration tests for API endpoints
- Component tests for React components
- End-to-end testing for critical user flows

Generate this complete application following modern development best practices, with clean, well-documented, and production-ready code.`;
}

module.exports = { 
  generateEnhancedCodePrompt,
  generateIntelligentTemplate,
  inferTechStack,
  generateDefaultFileStructure
};
