const service = require('../services/conversationUser.service');
const conversationService = require('../services/conversation.service');

const conversationPremiumController = {

    async create (req, res) {
        try {
            const conversationUser = await service.create(req.body);
            res.status(201).json(conversationUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async createPremiumConversationPremium (req, res) {
        try {
            const conversationUser = await conversationService.createPremiumConversation();
            res.status(201).json(conversationUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getAll (req, res)  {
        try {
            const all = await service.findAll();
            res.json(all);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getOne (req, res) {
        try {
            const item = await service.findById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update (req, res) {
        try {
            const updated = await service.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ message: 'Not found' });
            res.json({ message: 'Updated successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove (req, res) {
        try {
            const deleted = await service.delete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Not found' });
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = conversationPremiumController;