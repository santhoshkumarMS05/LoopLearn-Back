// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController.js');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;