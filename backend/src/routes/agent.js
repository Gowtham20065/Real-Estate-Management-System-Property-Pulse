const express = require('express');
const { chat, clearHistory } = require('../controllers/agentController');
const router = express.Router();

// Auth is optional — agent works for guests too
router.post('/chat', chat);
router.delete('/history/:sessionId', clearHistory);

module.exports = router;
