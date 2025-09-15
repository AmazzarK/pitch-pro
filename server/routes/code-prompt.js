const express = require('express');
const router = express.Router();
const { generateCodePrompt } = require('../services/code-prompt-generator');

/**
 * POST /api/code-prompt
 * Generate AI code prompt for a startup idea
 * 
 * @param {string} idea - The startup idea description
 * @returns {object} { prompt: string } - Generated code prompt
 */
router.post('/', async (req, res) => {
  try {
    const { idea } = req.body;

    // Validate input
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Idea field is required and must be a non-empty string'
      });
    }

    // Validate idea length (prevent extremely long inputs)
    if (idea.trim().length > 2000) {
      return res.status(400).json({
        error: 'Input too long',
        message: 'Idea description must be less than 2000 characters'
      });
    }

    // Generate the code prompt
    const prompt = await generateCodePrompt(idea.trim());

    // Return the generated prompt
    res.json({
      success: true,
      prompt: prompt
    });

  } catch (error) {
    console.error('Code prompt generation error:', error);
    
    // Return user-friendly error
    res.status(500).json({
      error: 'Generation failed',
      message: 'Failed to generate code prompt. Please try again.'
    });
  }
});

module.exports = router;
