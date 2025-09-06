const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Conversation = require('./conversation.model');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conversation,
      key: 'id',
    },
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'messages',
  timestamps: false,
});

Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });

module.exports = Message;