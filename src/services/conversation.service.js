const Conversation = require('../models/conversation.model');
const ConversationUser = require('../models/conversation_user.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');

const ConversationService = {
  async findOrCreateConversation(user1Id, user2Id) {
    const [conversation, created] = await Conversation.findOrCreate({
      where: {
        [Op.or]: [
          { user1_id: user1Id, user2_id: user2Id },
          { user1_id: user2Id, user2_id: user1Id },
        ],
      },
      defaults: {
        user1_id: user1Id,
        user2_id: user2Id,
      },
    });
    return conversation;
  },

  async createPremiumConversation(user_id, name = null) {
    // Create conversation with null user IDs for group chats
    const conversation = await Conversation.create({
      user1_id: null,
      user2_id: null,
      name: name
    });

    // Add creator to ConversationUser table (only once)
    const ConversationUser = require('../models/conversation_user.model');
    await ConversationUser.create({
      conversation_id: conversation.id,
      user_id: user_id
    });

    return conversation;
  },

  async findPremiumConversationById(conversationId) {
    return await Conversation.findByPk(conversationId);
  },

  async getUserConversations(userId) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId },
        ],
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] },
      ],
    });
    return conversations;
  },

  async findOrCreatePremiumGroup() {
    const [conversation] = await Conversation.findOrCreate({
      where: { user1_id: null, user2_id: null },
      defaults: { user1_id: null, user2_id: null },
    });
    return conversation;
  },

  async deleteConversation(conversationId) {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Delete all related records before deleting the conversation
    // 1. Delete all messages in this conversation
    await Message.destroy({
      where: { conversation_id: conversationId }
    });

    // 2. Delete all ConversationUser records (participants)
    await ConversationUser.destroy({
      where: { conversation_id: conversationId }
    });

    // 3. Finally delete the conversation itself
    await conversation.destroy();
    return { message: 'Conversation deleted successfully' };
  },
};

module.exports = ConversationService;