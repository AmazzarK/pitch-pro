# DeepSeek API Migration Guide

## Overview
The PitchPerfect application has been successfully migrated from OpenAI API to DeepSeek API.

## Changes Made

### 1. Environment Variables (.env)
```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_MODEL=deepseek-chat
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2. Service Layer
- Renamed `services/openai.js` → `services/deepseek.js`
- Updated API client to use axios instead of OpenAI SDK
- Changed API endpoint to DeepSeek's chat completions API
- Updated error handling for DeepSeek-specific responses

### 3. Dependencies
- Added: `axios` for HTTP requests to DeepSeek API
- Removed: `openai` package (no longer needed)

### 4. Route Updates
- Updated `routes/generate.js` to import from `services/deepseek`

## Setup Instructions

### Step 1: Get DeepSeek API Key
1. Visit https://platform.deepseek.com/
2. Create an account or sign in
3. Generate an API key
4. Copy the API key

### Step 2: Update Environment
1. Open `server/.env`
2. Replace `your-deepseek-api-key-here` with your actual DeepSeek API key:
   ```env
   DEEPSEEK_API_KEY=sk-your-actual-deepseek-api-key
   ```

### Step 3: Install Dependencies
```bash
cd server
npm install
```

### Step 4: Test the Integration
```bash
node test-deepseek.js
```

### Step 5: Start the Server
```bash
npm run dev
# or
npm start
```

## DeepSeek API Details

### Endpoint
- Base URL: `https://api.deepseek.com/v1`
- Chat Completions: `/chat/completions`

### Model
- Default: `deepseek-chat`
- Supports JSON mode with `response_format: { type: "json_object" }`

### Rate Limits
- DeepSeek has different rate limits than OpenAI
- Handle 429 errors gracefully

### Error Codes
- 401: Invalid API key
- 402: Quota exceeded
- 429: Rate limit exceeded

## Testing

The application includes a test file (`test-deepseek.js`) to verify the integration works correctly.

To test:
1. Ensure your API key is set in `.env`
2. Run: `node test-deepseek.js`
3. Check for successful pitch generation

## Frontend Changes
No changes needed in the React frontend - all API communication goes through the same backend routes.

## Troubleshooting

### Common Issues
1. **API Key Not Working**: Verify the key is correct and has sufficient credits
2. **Network Errors**: Check internet connection and firewall settings
3. **Rate Limiting**: Implement retry logic with exponential backoff
4. **JSON Parsing**: DeepSeek responses should be valid JSON when using json_object mode

### Debugging
- Check server logs for detailed error messages
- Use the test file to isolate API issues
- Monitor DeepSeek dashboard for usage and errors

## Production Deployment
- Ensure API key is securely stored (not in version control)
- Set appropriate rate limiting
- Monitor API usage and costs
- Consider implementing caching for repeated requests
