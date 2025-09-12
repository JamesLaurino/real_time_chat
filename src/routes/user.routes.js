const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', authMiddleware, UserController.getMe);
router.get('/me/conversations', authMiddleware, UserController.getUserConversations);
router.get('/', authMiddleware, UserController.getAllUsers);
router.put('/premium', authMiddleware, UserController.updatePremiumStatus);

module.exports = router;
