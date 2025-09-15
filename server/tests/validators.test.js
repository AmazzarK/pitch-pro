const { validateCodePromptInput, sanitizeInput } = require('../utils/validators');

describe('Validators', () => {
  describe('validateCodePromptInput', () => {
    it('should validate correct input', () => {
      const input = {
        idea: 'A social media platform for pet owners to connect and share',
        pitchData: {
          name: 'PetConnect',
          elevator: 'Connect pet owners worldwide'
        }
      };

      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.details).toEqual([]);
    });

    it('should reject missing idea', () => {
      const input = { pitchData: {} };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea is required');
    });

    it('should reject non-string idea', () => {
      const input = { idea: 123 };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea must be a string');
    });

    it('should reject empty idea', () => {
      const input = { idea: '   ' };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea cannot be empty');
    });

    it('should reject short idea', () => {
      const input = { idea: 'Short' };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea must be at least 10 characters long');
    });

    it('should reject long idea', () => {
      const input = { idea: 'A'.repeat(2001) };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea must be less than 2000 characters');
    });

    it('should detect harmful content', () => {
      const input = { idea: 'My idea <script>alert("xss")</script> is great' };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Idea contains potentially harmful content');
    });

    it('should validate pitch data structure', () => {
      const input = {
        idea: 'A social media platform for pet owners',
        pitchData: 'invalid'
      };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Pitch data must be an object');
    });

    it('should validate pitch data fields', () => {
      const input = {
        idea: 'A social media platform for pet owners',
        pitchData: {
          name: 123,
          elevator: true,
          slides: 'invalid'
        }
      };
      const result = validateCodePromptInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.details).toContain('Pitch name must be a string');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize harmful content', () => {
      const input = 'My idea <script>alert("xss")</script> is great';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('My idea sc_ript>alert("xss")/sc_ript is great');
    });

    it('should remove angle brackets', () => {
      const input = 'My idea with <tags> should be clean';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('My idea with tags should be clean');
    });

    it('should trim whitespace', () => {
      const input = '  My idea with spaces  ';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('My idea with spaces');
    });

    it('should limit length', () => {
      const input = 'A'.repeat(3000);
      const sanitized = sanitizeInput(input);
      
      expect(sanitized.length).toBe(2000);
    });

    it('should handle non-string input', () => {
      const input = 123;
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('');
    });
  });
});
