const pool = require('../config/db');

const MessageModel = {
  async createMessage(conversationId, senderId, content) {
    const [result] = await pool.execute(
      'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
      [conversationId, senderId, content]
    );
    return { id: result.insertId, conversation_id: conversationId, sender_id: senderId, content };
  },

  async getMessagesByConversation(conversationId) {
    const [rows] = await pool.execute(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );
    return rows;
  }
};

module.exports = MessageModel;
