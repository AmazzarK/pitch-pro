const express = require('express');
const router = express.Router();
const Pitch = require('../models/Pitch');
const connectDB = require('../config/db');

let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

router.get('/', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        message: 'Database not configured',
        data: []
      });
    }

    await initDB();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pitches = await Pitch.find()
      .select('name elevator createdAt idea')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Pitch.countDocuments();

    res.json({
      success: true,
      data: pitches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(404).json({
        error: 'Database not configured'
      });
    }

    await initDB();

    const pitch = await Pitch.findById(req.params.id).lean();
    
    if (!pitch) {
      return res.status(404).json({
        error: 'Pitch not found'
      });
    }

    res.json({
      success: true,
      data: pitch
    });

  } catch (error) {
    console.error('Error fetching pitch:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pitch',
      message: error.message 
    });
  }
});

module.exports = router;
