const pool = require('../config/db');

const ConversationModel = {
  async findOrCreateConversation(user1Id, user2Id) {
    // Look for an existing conversation
    const [existing] = await pool.execute(
      'SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [user1Id, user2Id, user2Id, user1Id]
    );

    if (existing.length > 0) {
      return existing[0];
    }

    // If not, create a new one
    const [result] = await pool.execute(
      'INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)',
      [user1Id, user2Id]
    );

    return { id: result.insertId, user1_id: user1Id, user2_id: user2Id };
  },

  async getUserConversations(userId) {
    const [rows] = await pool.execute(
      `SELECT c.id, c.created_at, 
             u1.username as user1_username, u1.id as user1_id, 
             u2.username as user2_username, u2.id as user2_id
       FROM conversations c
       JOIN users u1 ON c.user1_id = u1.id
       JOIN users u2 ON c.user2_id = u2.id
       WHERE c.user1_id = ? OR c.user2_id = ?`,
      [userId, userId]
    );
    return rows;
  }
};

module.exports = ConversationModel;
