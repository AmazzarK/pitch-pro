const express = require('express');
const router = express.Router();
const { generateEnhancedCodePrompt } = require('../services/code-prompt-generator');
const { validateCodePromptInput } = require('../utils/validators');

/**
 * POST /api/code-prompt
 * Generate comprehensive AI code prompt for a startup idea with pitch data
 * 
 * @param {string} idea - The startup idea description
 * @param {Object} pitchData - Optional pitch data including name, elevator pitch, and slides
 * @returns {Object} Enhanced prompt data with tech stack and structure recommendations
 */
router.post('/', async (req, res) => {
  try {
    const { idea, pitchData } = req.body;

    // Enhanced validation
    const validationResult = validateCodePromptInput({ idea, pitchData });
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validationResult.error,
        details: validationResult.details
      });
    }

    console.log('🤖 Generating enhanced code prompt for:', idea.substring(0, 50) + '...');

    // Generate comprehensive prompt data
    const promptData = await generateEnhancedCodePrompt({
      idea: idea.trim(),
      pitchData: pitchData || null
    });

    console.log('✅ Enhanced code prompt generated successfully');

    // Return structured response
    res.json({
      success: true,
      data: {
        prompt: promptData.prompt,
        techStack: promptData.techStack,
        fileStructure: promptData.fileStructure,
        summary: promptData.summary,
        features: promptData.features,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Code prompt generation error:', error);
    
    // Enhanced error handling
    const statusCode = error.name === 'ValidationError' ? 400 : 
                      error.name === 'RateLimitError' ? 429 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.name || 'Generation failed',
      message: error.message || 'Failed to generate code prompt. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

module.exports = router;
