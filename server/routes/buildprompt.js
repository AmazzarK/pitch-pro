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

    const prompt = await generateBuildPrompt(idea.trim(), pitchData);

    res.json({
      success: true,
      prompt: prompt
    });

  } catch (error) {
    console.error('Build prompt generation error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate build prompt'
    });
  }
});

module.exports = router;
