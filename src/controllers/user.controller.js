const User = require('../models/user.model');
const ConversationService = require('../services/conversation.service');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const { onlineUsers } = require('../sockets/socketManager');

const UserController = {
  async getMe(req, res, next) {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async getUserConversations(req, res, next) {
    try {
      const userId = req.userId;
      const conversations = await ConversationService.getUserConversations(userId);
      res.status(200).json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  },

  async getConversationMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { limit = 20, offset = 0 } = req.query;

      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        const error = new Error('Conversation not found');
        error.statusCode = 404;
        return next(error);
      }

      const messages = await Message.findAll({
        where: { conversation_id: conversationId },
        include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }],
        order: [['created_at', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  },

  // La nouvelle méthode pour lister tous les utilisateurs avec leur statut
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'created_at'],
      });

      const usersWithStatus = users.map(user => {
        const userJSON = user.toJSON();
        userJSON.online = onlineUsers.has(user.id);
        return userJSON;
      });

      res.status(200).json({ success: true, data: usersWithStatus });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
