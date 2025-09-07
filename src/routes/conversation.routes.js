const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { getConversationMessagesValidationRules } = require('../validators/user.validator');
const validate = require('../middleware/validation.middleware');

router.get('/:conversationId/messages', authMiddleware, getConversationMessagesValidationRules(), validate, UserController.getConversationMessages);

module.exports = router;
