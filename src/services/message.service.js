const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const { Op } = require('sequelize');
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

    // 2. Create the message in the database
    const newMessage = await Message.create({ conversation_id: conversation.id, sender_id: senderId, content });

    // 3. DO NOT EMIT HERE. Let socketManager handle the emission.
    // The message object returned here will be used by socketManager to emit.

    return {
      id: newMessage.id,
      conversationId: newMessage.conversation_id,
      senderId: newMessage.sender_id,
      content: newMessage.content,
      createdAt: newMessage.created_at,
    };
  }
};

module.exports = MessageService;
