const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const ConversationUser = require("../models/conversation_user.model");

const ConversationUserService = {
    /**
     * Créer un nouvel enregistrement
     * @param {Object} data - {conversation_id, user_id}
     */
    async create(data) {
        return await ConversationUser.create(data);
    },

    /**
     * Récupérer tous les enregistrements
     */
    async findAll() {
        return await ConversationUser.findAll({
            include: [{ model: User }, { model: Conversation }] // préférable aux strings
        });
    },

    /**
     * Récupérer un enregistrement par son ID
     * @param {number} id
     */
    async findById(id) {
        return await ConversationUser.findByPk(id, {
            include: [{ model: User }, { model: Conversation }]
        });
    },

    /**
     * Mettre à jour un enregistrement par son ID
     * @param {number} id
     * @param {Object} data
     */
    async update(id, data) {
        const [affectedRows] = await ConversationUser.update(data, {
            where: { id }
        });
        return affectedRows;
    },

    /**
     * Supprimer un enregistrement par son ID
     * @param {number} id
     */
    async remove(id) {
        return await ConversationUser.destroy({
            where: { id }
        });
    }
};

module.exports = ConversationUserService;