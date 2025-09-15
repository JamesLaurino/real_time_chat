const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Conversation = require('./conversation.model');
const User = require('./user.model');

const ConversationParticipant = sequelize.define('ConversationParticipant', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversation_participants',
  timestamps: false,
});

ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversation_id' });
ConversationParticipant.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ConversationParticipant;
