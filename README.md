# PitchPerfect 🚀

Transform your startup ideas into professional pitches and comprehensive development prompts with AI-powered generation. Create compelling company names, elevator pitches, beautiful pitch decks, and actionable code prompts for developers.

## ✨ Features

### 🎯 **Pitch Generation**
- **AI-Powered Pitch Creation**: Uses DeepSeek AI to generate compelling startup pitches
- **Beautiful Pitch Decks**: Generate 4-slide HTML presentations with modern gradient designs
- **Professional Styling**: Cutting-edge design with bold typography, icons, and visual effects
- **PDF & Image Export**: Download pitch decks as PDFs or individual PNG slides

### ⚡ **AI Code Prompt Generator**
- **Comprehensive Code Prompts**: Generate detailed MERN stack development instructions
- **Quick Build Prompts**: Fast 500-character optimized prompts for rapid development
- **Smart Navigation**: Smooth scrolling between comprehensive and quick prompt generators
- **Copy & Download**: One-click copying and file download functionality
- **Template Fallback**: Reliable responses even when AI service is unavailable

### 🎨 **Enhanced User Experience**
- **Responsive Design**: Perfect performance on desktop and mobile devices
- **Smooth Animations**: Framer Motion animations for professional interactions
- **Real-time Validation**: Input validation with character counters and visual feedback
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 💾 **Optional Database**
- **Pitch History**: Store generated pitches with MongoDB (optional)
- **Performance**: Works perfectly without database for core functionality

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, Comprehensive validation
- **Database**: MongoDB (optional)
- **AI**: DeepSeek API (deepseek-chat model)
- **PDF Generation**: jsPDF + html2canvas
- **Testing**: Jest (backend) + Vitest (frontend)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- DeepSeek API key ([Get one here](https://platform.deepseek.com))
- MongoDB (optional, for pitch history)

### 1. Clone and Install

```bash
git clone https://github.com/AmazzarK/pitch-pro.git
cd PitchPerfect
npm run install-all
```

### 2. Configure Environment

Create `server/.env` file:

```env
# Required - DeepSeek API Configuration
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
DEEPSEEK_MODEL=deepseek-chat

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: MongoDB for pitch history
MONGODB_URI=mongodb://localhost:27017/pitchperfect
```

### 3. Start Development

```bash
# Start both client and server
npm run dev

# Or start individually:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:5173
```

### 4. Production Build

```bash
npm run build
npm start
```



## 🎯 Project Structure

```
PitchPerfect/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── BuildPromptGenerator.jsx    # Quick build prompt generator
│   │   │   ├── CodePromptGenerator.jsx     # Comprehensive code prompt generator
│   │   │   ├── PitchResult.jsx             # Enhanced pitch display
│   │   │   ├── Header.jsx                  # Landing page header
│   │   │   ├── IdeaForm.jsx                # Main idea input form
│   │   │   ├── LoadingScreen.jsx           # Animated loading states
│   │   │   ├── Navigation.jsx              # Site navigation
│   │   │   └── ErrorMessage.jsx            # Error display component
│   │   ├── services/
│   │   │   ├── api.js                      # Enhanced API client
│   │   │   └── pdf.js                      # PDF generation service
│   │   └── tests/                          # Vitest test suites
│   └── package.json
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                           # MongoDB configuration
│   ├── models/
│   │   └── Pitch.js                        # Pitch data model
│   ├── routes/
│   │   ├── generate.js                     # Main pitch generation
│   │   ├── code-prompt.js                  # Comprehensive code prompts
│   │   ├── buildprompt.js                  # Quick build prompts
│   │   └── history.js                      # Pitch history
│   ├── services/
│   │   ├── deepseek.js                     # Main DeepSeek API service
│   │   ├── code-prompt-generator.js        # Comprehensive prompt generation
│   │   └── buildprompt-generator.js        # Quick prompt generation
│   ├── utils/
│   │   └── validators.js                   # Input validation utilities
│   ├── tests/                              # Jest test suites
│   │   ├── buildprompt.test.js
│   │   ├── code-prompt.test.js
│   │   └── validators.test.js
│   └── package.json
└── package.json                    # Root package.json with concurrently
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEEPSEEK_API_KEY` | Yes | Your DeepSeek API key |
| `DEEPSEEK_MODEL` | No | DeepSeek model to use (default: deepseek-chat) |
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | No | MongoDB connection string |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |

### Model Options

- `deepseek-chat`: Primary model for all generations
- `deepseek-coder`: Specialized for code generation (if available)

## 📱 Features in Detail

### Comprehensive Pitch Generation
- **Company Naming**: Creative, memorable startup names (2-3 words max)
- **Elevator Pitches**: Clear, compelling one-sentence value propositions
- **4-Slide Pitch Decks**: Problem → Solution → Market → Call to Action
- **Professional Design**: Modern gradients, bold typography, visual icons



## 🎨 Customizing AI Prompts

The AI prompt can be customized in `server/services/openai.js`:

```javascript
// Modify this system prompt to change AI behavior
const SYSTEM_PROMPT = `You are a professional pitch deck creator...`

// Adjust these parameters:
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',    // or 'gpt-4'
  temperature: 0.7,          // 0.1-1.0 (creativity level)
  max_tokens: 4000,          // Response length limit
  // ...
})
```

### Prompt Customization Options:

1. **Change the role**: Modify the system prompt to act as different types of advisors
2. **Adjust creativity**: Lower temperature (0.1-0.3) for conservative, higher (0.7-1.0) for creative
3. **Modify slide count**: Change the prompt to request 3-5 slides
4. **Update styling**: Modify Tailwind classes in the prompt for different visual themes
5. **Add industry focus**: Include industry-specific guidance in the prompt


## 🛡 Security Features

- Rate limiting (10 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Error handling without exposing internals

## 🚦 Common Issues & Solutions

### OpenAI API Issues
- **"Invalid API key"**: Check your `.env` file and API key validity
- **"Quota exceeded"**: Check your OpenAI billing and usage limits
- **"Rate limited"**: Wait and try again, or upgrade your OpenAI plan

### PDF Generation Issues
- **Fonts not rendering**: Ensure Google Fonts are loaded
- **Scaling problems**: Check the transform scale values in PDF service
- **Memory issues**: Reduce slide complexity or image sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the powerful GPT models
- Tailwind CSS for the beautiful styling system
- The React and Node.js communities for excellent tools and documentation

---

**Built with ❤️ for entrepreneurs and startup enthusiasts**
#   p i t c h - p r o 
 

 
