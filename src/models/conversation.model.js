const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversations',
  timestamps: false,
});

Conversation.belongsTo(User, { as: 'user1', foreignKey: 'user1_id' });
Conversation.belongsTo(User, { as: 'user2', foreignKey: 'user2_id' });

module.exports = Conversation;