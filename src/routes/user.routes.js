const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', authMiddleware, UserController.getMe);
router.get('/me/conversations', authMiddleware, UserController.getUserConversations); // New route for user conversations
router.get('/conversations/:conversationId/messages', authMiddleware, UserController.getConversationMessages); // New route for conversation messages

module.exports = router;