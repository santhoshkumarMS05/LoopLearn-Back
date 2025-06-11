// routes/review.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWeakSkills,
  generateReviewPlan,
  getChartData
} = require('../controllers/reviewController');

// All routes require authentication
router.use(auth);

// Review routes
router.get('/weak-skills', getWeakSkills);
router.get('/generate-plan', generateReviewPlan);
router.get('/chart-data', getChartData);

module.exports = router;