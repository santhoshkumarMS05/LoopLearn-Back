// routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chatWithAI } = require('../controllers/aiController');

// All routes require authentication
router.use(auth);

// AI chat route
router.post('/chat', chatWithAI);

module.exports = router;