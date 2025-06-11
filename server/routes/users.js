// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updatePreferences,
  getUserStats,
  resetProgress,
  deleteAccount
} = require('../controllers/userController');

// All routes require authentication
router.use(auth);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Preferences route
router.put('/preferences', updatePreferences);

// Statistics route
router.get('/stats', getUserStats);

// Danger zone routes
router.delete('/reset-progress', resetProgress);
router.delete('/account', deleteAccount);

module.exports = router;