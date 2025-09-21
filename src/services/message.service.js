const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const { Op } = require('sequelize');
const User = require("../models/user.model");
// const { getSocketId, getIo } = require('../sockets/socketManager'); // Remove getIo import

const MessageService = {
  async sendMessage(senderId, recipientId, content, conversationId) {
    // 1. Find or create the conversation (only if conversationId is not provided)
    let conversation;
    if (conversationId) {
      conversation = { id: conversationId };
    } else {
      [conversation, created] = await Conversation.findOrCreate({
        where: {
          [Op.or]: [
            { user1_id: senderId, user2_id: recipientId },
            { user1_id: recipientId, user2_id: senderId },
          ],
        },
        defaults: {
          user1_id: senderId,
          user2_id: recipientId,
        },
      });
    }

    // 2. Check user quota if not premium
    const user = await User.findByPk(senderId);

    if(user && user.premium === false) {
      const startOfToday = new Date();
      startOfToday.setHours(0,0,0,0);

      const count = await Message.count({
        where: {
          sender_id: senderId,
          created_at: { [Op.gte]: startOfToday }
        }
      });

      if (count >= 10) {
        throw new Error('You have reached your daily message limit.');
      }
    }

    // 2. Create the message in the database
    const newMessage = await Message.create({ conversation_id: conversation.id, sender_id: senderId, content });

    const messageWithSender = await Message.findByPk(newMessage.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }],
    });

    return {
      id: messageWithSender.id,
      conversationId: messageWithSender.conversation_id,
      senderId: messageWithSender.sender_id,
      content: messageWithSender.content,
      createdAt: messageWithSender.created_at,
      sender: messageWithSender.sender,
    };
  },

  async getMessagesByConversationId(conversationId) {
    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }],
      order: [['created_at', 'ASC']],
    });

    return messages.map(message => ({
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      content: message.content,
      createdAt: message.created_at,
      sender: message.sender,
    }));
  }
};

module.exports = MessageService;
