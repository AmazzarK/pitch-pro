const express = require('express');
const router = express.Router();
const { generatePitch } = require('../services/deepseek');
const Pitch = require('../models/Pitch');
const connectDB = require('../config/db');

let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

router.post('/', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Please provide a valid startup idea description.' 
      });
    }

    if (idea.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Idea too short', 
        message: 'Please provide a more detailed description of your startup idea (at least 10 characters).' 
      });
    }

    if (idea.length > 2000) {
      return res.status(400).json({ 
        error: 'Idea too long', 
        message: 'Please keep your startup idea description under 2000 characters.' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'Configuration error', 
        message: 'OpenAI API key is not configured. Please check server configuration.' 
      });
    }

    console.log('🤖 Generating pitch for idea:', idea.substring(0, 50) + '...');
    const pitchData = await generatePitch(idea.trim());

    try {
      await initDB();
      if (process.env.MONGODB_URI) {
        const newPitch = new Pitch({
          idea: idea.trim(),
          name: pitchData.name,
          elevator: pitchData.elevator,
          slides: pitchData.slides,
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown'
        });
        await newPitch.save();
        console.log('💾 Pitch saved to database');
      }
    } catch (dbError) {
      console.warn('⚠️  Failed to save to database:', dbError.message);
    }

    console.log('✅ Pitch generated successfully');
    res.json({
      success: true,
      data: pitchData
    });

  } catch (error) {
    console.error('❌ Error generating pitch:', error);
    res.status(500).json({ 
      error: 'Failed to generate pitch', 
      message: error.message 
    });
  }
});

module.exports = router;
