const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', sendMessage); // Handles both guest and authenticated users
router.get('/history', protect, getChatHistory); // Only logged-in users

module.exports = router;
