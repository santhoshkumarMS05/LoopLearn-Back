// models/SkillLog.js
const mongoose = require('mongoose');

const skillLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    required: [true, 'Time spent is required'],
    min: [1, 'Time spent must be at least 1 minute']
  },
  confidence: {
    type: Number,
    required: [true, 'Confidence rating is required'],
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const SkillLog = mongoose.model('SkillLog', skillLogSchema);

module.exports = SkillLog;