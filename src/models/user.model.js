const pool = require('../config/db');

const UserModel = {
  async create(user) {
    const { username, email, password_hash } = user;
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );
    return { id: result.insertId, username, email };
  },

  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = UserModel;