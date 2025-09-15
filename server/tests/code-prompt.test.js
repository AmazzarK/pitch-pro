const request = require('supertest');
const express = require('express');
const codePromptRouter = require('../routes/code-prompt');

// Mock the code prompt generator service
jest.mock('../services/code-prompt-generator', () => ({
  generateEnhancedCodePrompt: jest.fn()
}));

const { generateEnhancedCodePrompt } = require('../services/code-prompt-generator');

const app = express();
app.use(express.json());
app.use('/api/code-prompt', codePromptRouter);

describe('Code Prompt API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/code-prompt', () => {
    const mockPromptData = {
      prompt: 'Test prompt content',
      techStack: ['React', 'Node.js', 'MongoDB'],
      fileStructure: { 'client/': ['src/', 'public/'] },
      summary: 'Test summary',
      features: ['Feature 1', 'Feature 2']
    };

    it('should generate code prompt successfully', async () => {
      generateEnhancedCodePrompt.mockResolvedValue(mockPromptData);

      const response = await request(app)
        .post('/api/code-prompt')
        .send({
          idea: 'A social media platform for pet owners',
          pitchData: {
            name: 'PetConnect',
            elevator: 'Connect pet owners worldwide'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        prompt: expect.any(String),
        techStack: expect.any(Array),
        fileStructure: expect.any(Object),
        summary: expect.any(String),
        features: expect.any(Array),
        generatedAt: expect.any(String)
      });

      expect(generateEnhancedCodePrompt).toHaveBeenCalledWith({
        idea: 'A social media platform for pet owners',
        pitchData: {
          name: 'PetConnect',
          elevator: 'Connect pet owners worldwide'
        }
      });
    });

    it('should return 400 for missing idea', async () => {
      const response = await request(app)
        .post('/api/code-prompt')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.message).toBe('Idea is required');
    });

    it('should return 400 for short idea', async () => {
      const response = await request(app)
        .post('/api/code-prompt')
        .send({ idea: 'Short' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Idea must be at least 10 characters long');
    });

    it('should return 400 for long idea', async () => {
      const longIdea = 'A'.repeat(2001);
      
      const response = await request(app)
        .post('/api/code-prompt')
        .send({ idea: longIdea })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Idea must be less than 2000 characters');
    });

    it('should handle service errors gracefully', async () => {
      generateEnhancedCodePrompt.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/api/code-prompt')
        .send({ idea: 'A social media platform for pet owners' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error');
      expect(response.body.message).toBe('Service error');
    });

    it('should validate pitch data structure', async () => {
      const response = await request(app)
        .post('/api/code-prompt')
        .send({
          idea: 'A social media platform for pet owners',
          pitchData: 'invalid-pitch-data'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Pitch data must be an object');
    });

    it('should accept valid pitch data with all fields', async () => {
      generateEnhancedCodePrompt.mockResolvedValue(mockPromptData);

      const validPitchData = {
        name: 'PetConnect',
        elevator: 'Connect pet owners worldwide',
        slides: [
          { content: 'Problem slide content' },
          { content: 'Solution slide content' }
        ]
      };

      const response = await request(app)
        .post('/api/code-prompt')
        .send({
          idea: 'A social media platform for pet owners',
          pitchData: validPitchData
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(generateEnhancedCodePrompt).toHaveBeenCalledWith({
        idea: 'A social media platform for pet owners',
        pitchData: validPitchData
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should handle potentially harmful input', async () => {
      const harmfulIdea = 'My startup idea <script>alert("xss")</script> is awesome';

      const response = await request(app)
        .post('/api/code-prompt')
        .send({ idea: harmfulIdea })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Idea contains potentially harmful content');
    });
  });
});
