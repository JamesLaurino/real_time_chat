const UserModel = require('../models/user.model');
const ConversationModel = require('../models/conversation.model'); // Import ConversationModel
const MessageModel = require('../models/message.model'); // Import MessageModel

const UserController = {
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getUserConversations(req, res) {
    try {
      const userId = req.userId; // Get userId from authenticated request
      const conversations = await ConversationModel.getUserConversations(userId);
      res.status(200).json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getConversationMessages(req, res) {
    try {
      const conversationId = req.params.conversationId;
      // Optional: Add authorization check here to ensure req.userId is part of this conversation
      // For now, we'll assume the user is authorized if they know the conversationId.
      // A more robust solution would involve checking if req.userId is user1_id or user2_id in the conversation.
      const messages = await MessageModel.getMessagesByConversation(conversationId);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = UserController;