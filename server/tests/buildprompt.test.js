const request = require('supertest');
const express = require('express');
const buildPromptRoute = require('../routes/buildprompt');

// Mock the buildprompt-generator service
jest.mock('../services/buildprompt-generator', () => ({
  generateBuildPrompt: jest.fn()
}));

const { generateBuildPrompt } = require('../services/buildprompt-generator');

const app = express();
app.use(express.json());
app.use('/api/buildprompt', buildPromptRoute);

describe('Build Prompt API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/buildprompt', () => {
    it('should generate build prompt successfully', async () => {
      const mockPrompt = 'Create a React app with Express backend for a food delivery service...';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: 'Food delivery app for healthy meals' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.prompt).toBe(mockPrompt);
      expect(response.body.data.characterCount).toBe(mockPrompt.length);
      expect(generateBuildPrompt).toHaveBeenCalledWith('Food delivery app for healthy meals');
    });

    it('should reject empty idea', async () => {
      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide a valid startup idea');
    });

    it('should reject undefined idea', async () => {
      const response = await request(app)
        .post('/api/buildprompt')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide a valid startup idea');
    });

    it('should reject non-string idea', async () => {
      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: 123 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide a valid startup idea');
    });

    it('should reject too short idea', async () => {
      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: 'Short' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide more details');
    });

    it('should reject too long idea', async () => {
      const longIdea = 'a'.repeat(501);
      
      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: longIdea })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Description too long');
    });

    it('should trim whitespace from idea', async () => {
      const mockPrompt = 'Test prompt content';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: '  Food delivery app  ' })
        .expect(200);

      expect(generateBuildPrompt).toHaveBeenCalledWith('Food delivery app');
      expect(response.body.success).toBe(true);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'DeepSeek API error';
      generateBuildPrompt.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: 'Valid startup idea' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Failed to generate build prompt');
    });

    it('should log request processing', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockPrompt = 'Test prompt';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);

      await request(app)
        .post('/api/buildprompt')
        .send({ idea: 'Food delivery app' })
        .expect(200);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚡ Generating optimized build prompt')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Build prompt generated successfully')
      );

      consoleSpy.mockRestore();
    });

    it('should include metadata in response', async () => {
      const mockPrompt = 'Create a modern web application...';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: 'SaaS productivity tool' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('prompt', mockPrompt);
      expect(response.body.data).toHaveProperty('characterCount', mockPrompt.length);
      expect(response.body.data).toHaveProperty('generatedAt');
      expect(response.body.data).toHaveProperty('optimizedFor', 'quick development');
      expect(new Date(response.body.data.generatedAt)).toBeInstanceOf(Date);
    });

    it('should validate character count limits are enforced', async () => {
      // Test exactly at the 500 character limit
      const ideaAt500 = 'a'.repeat(500);
      const mockPrompt = 'Test prompt';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: ideaAt500 })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Test just over the 500 character limit
      const ideaAt501 = 'a'.repeat(501);
      
      const errorResponse = await request(app)
        .post('/api/buildprompt')
        .send({ idea: ideaAt501 })
        .expect(400);

      expect(errorResponse.body.success).toBe(false);
    });

    it('should handle special characters in idea', async () => {
      const mockPrompt = 'Test prompt for special chars';
      generateBuildPrompt.mockResolvedValueOnce(mockPrompt);
      
      const specialIdea = 'AI-powered e-commerce platform with émojis! 🚀 & special chars: @#$%';

      const response = await request(app)
        .post('/api/buildprompt')
        .send({ idea: specialIdea })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(generateBuildPrompt).toHaveBeenCalledWith(specialIdea);
    });
  });
});
