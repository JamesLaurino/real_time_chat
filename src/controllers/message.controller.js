const MessageService = require('../services/message.service');

const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.userId; // Assuming auth middleware adds userId to request

    const message = await MessageService.sendMessage(senderId, recipientId, content, conversationId);

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
};
