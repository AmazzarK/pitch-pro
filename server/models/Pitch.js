const mongoose = require('mongoose');

const PitchSchema = new mongoose.Schema({
  idea: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  elevator: {
    type: String,
    required: true,
    trim: true
  },
  slides: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  }
});

PitchSchema.index({ createdAt: -1 });
PitchSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('Pitch', PitchSchema);
