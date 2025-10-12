require('dotenv').config();
const sequelize = require('../src/config/db');

// 1. Importer les modèles. L'ordre est important pour l'opération de suppression.
const Message = require('../src/models/message.model');
const Conversation_user = require('../src/models/conversation_user.model');
const Conversation = require('../src/models/conversation.model');
const User = require('../src/models/user.model');

async function unseedDatabase() {
    console.log('🔄 Démarrage du nettoyage des données de la base de données (Unseed)...');

    try {
        // ⚠️ Désactiver temporairement les vérifications de clés étrangères.
        if (sequelize.options.dialect === 'mysql' || sequelize.options.dialect === 'mariadb') {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        } else if (sequelize.options.dialect === 'sqlite') {
            await sequelize.query('PRAGMA foreign_keys = OFF', null, { raw: true });
        }

        // 2. Supprimer toutes les données des tables dans l'ordre inverse des dépendances

        console.log('Nettoyage de la table Messages...');
        await Message.destroy({ truncate: true, cascade: true });

        console.log('Nettoyage de la table Conversation_user...');
        await Conversation_user.destroy({ truncate: true, cascade: true });

        console.log('Nettoyage de la table Conversations...');
        await Conversation.destroy({ truncate: true, cascade: true });

        console.log('Nettoyage de la table Users...');
        await User.destroy({ truncate: true, cascade: true });

        // 3. Réactiver les vérifications de clés étrangères.
        if (sequelize.options.dialect === 'mysql' || sequelize.options.dialect === 'mariadb') {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        } else if (sequelize.options.dialect === 'sqlite') {
            await sequelize.query('PRAGMA foreign_keys = ON', null, { raw: true });
        }

        console.log('Toutes les données ont été TRUNCATE avec succès.');

    } catch (error) {
        console.error('Erreur lors du nettoyage de la base de données :', error);
        process.exit(1);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

unseedDatabase();