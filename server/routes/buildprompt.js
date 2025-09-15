const express = require('express');
const router = express.Router();
const { generateBuildPrompt } = require('../services/buildprompt-generator');

router.post('/', async (req, res) => {
  try {
    const { idea, pitchData } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed startup idea (minimum 10 characters)'
      });
    }

    if (idea.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Idea description too long (maximum 500 characters)'
      });
    }

    console.log('⚡ Generating optimized build prompt for:', idea.substring(0, 50) + '...');
    
    const prompt = await generateBuildPrompt(idea.trim(), pitchData);

    console.log('✅ Build prompt generated successfully');

    res.json({
      success: true,
      data: {
        prompt: prompt,
        characterCount: prompt.length,
        generatedAt: new Date().toISOString(),
        optimizedFor: 'quick development'
      }
    });

  } catch (error) {
    console.error('❌ Build prompt generation error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate build prompt. Please try again.'
    });
  }
});

module.exports = router;
