const express = require('express');
const { sendMessage } = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, sendMessage);

module.exports = router;
