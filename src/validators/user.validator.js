const { param, query } = require('express-validator');

const getConversationMessagesValidationRules = () => {
  return [
    param('conversationId').isInt().withMessage('Conversation ID must be an integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  ];
};

module.exports = {
  getConversationMessagesValidationRules,
};
