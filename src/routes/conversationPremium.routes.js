const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const premiumController = require('../controllers/conversationPremium.controller');

router.post('/', authMiddleware, premiumController.create);
router.get('/', authMiddleware, premiumController.getAll);
router.get('/:id', authMiddleware, premiumController.getOne);
router.put('/:id', authMiddleware, premiumController.update);
router.delete('/:id', authMiddleware, premiumController.remove);

module.exports = router;
