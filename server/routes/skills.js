// routes/skills.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserSkills,
  logPracticeSession,
  getPracticeHistory,
  getTodayStats,
  updateSkillLog,
  deleteSkillLog,
  getSkillNames
} = require('../controllers/skillController');

// All routes require authentication
router.use(auth);

// Skill routes
router.get('/', getUserSkills);
router.get('/names', getSkillNames);
router.get('/history', getPracticeHistory);
router.get('/today-stats', getTodayStats);
router.post('/log', logPracticeSession);
router.put('/log/:id', updateSkillLog);
router.delete('/log/:id', deleteSkillLog);

module.exports = router;