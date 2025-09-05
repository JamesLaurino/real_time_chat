const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', authMiddleware, UserController.getMe);

module.exports = router;