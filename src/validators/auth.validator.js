const { body } = require('express-validator');

const signupValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').not().isEmpty().withMessage('Username is required'),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ];
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
};
