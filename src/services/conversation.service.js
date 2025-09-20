const Conversation = require('../models/conversation.model');
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

  async createPremiumConversation() {
    return await Conversation.create({ user1_id: null, user2_id: null });
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
};

module.exports = ConversationService;