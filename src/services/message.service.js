const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
// const { getSocketId, getIo } = require('../sockets/socketManager'); // Remove getIo import

const MessageService = {
  async sendMessage(senderId, recipientId, content, conversationId) {
    // 1. Find or create the conversation (only if conversationId is not provided)
    let conversation;
    if (conversationId) {
      conversation = { id: conversationId };
    } else {
      conversation = await ConversationModel.findOrCreateConversation(senderId, recipientId);
    }

    // 2. Create the message in the database
    const newMessage = await MessageModel.createMessage(conversation.id, senderId, content);

    // 3. DO NOT EMIT HERE. Let socketManager handle the emission.
    // The message object returned here will be used by socketManager to emit.

    return {
      id: newMessage.id,
      conversationId: conversation.id,
      senderId: senderId,
      content: content,
      createdAt: newMessage.created_at || new Date().toISOString(),
    };
  }
};

module.exports = MessageService;
