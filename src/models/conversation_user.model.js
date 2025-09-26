const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");
const User = require("./user.model");
const Conversation = require('./conversation.model');

const ConversationUser = sequelize.define('Conversation_user', {
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'conversation_user',
    timestamps: false,
});

ConversationUser.belongsTo(User, {foreignKey: 'user_id' });
ConversationUser.belongsTo(Conversation, {foreignKey: 'conversation_id' });

module.exports = ConversationUser;