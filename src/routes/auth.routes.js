const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { signupValidationRules, loginValidationRules } = require('../validators/auth.validator');
const validate = require('../middleware/validation.middleware');

router.post('/signup', signupValidationRules(), validate, AuthController.signup);
router.post('/login', loginValidationRules(), validate, AuthController.login);

module.exports = router;