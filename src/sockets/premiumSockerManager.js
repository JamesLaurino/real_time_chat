/**
 * @file premiumSockerManager.js
 * @description Gère la fonctionnalité de chat en temps réel pour les conversations premium en utilisant Socket.IO.
 *
 * @logique
 * 1.  **Isolation avec un Chemin Unique**: Ce manager initialise Socket.IO avec un chemin personnalisé : `path: '/socket.io-premium/'`.
 *     Ce changement est crucial pour éviter les conflits avec l'instance principale de Socket.IO (`socketManager.js`). Il garantit que
 *     les deux services fonctionnent de manière indépendante sur le même serveur HTTP sans interférer avec leurs connexions respectives.
 *
 * 2.  **Authentification Spécifique au Namespace**: Le middleware d'authentification (`authenticateSocket`) est appliqué directement
 *     au namespace `/conversation/premium` (`premiumNamespace.use(authenticateSocket)`). Cela garantit que seuls les utilisateurs
 *     authentifiés peuvent se connecter à ce point d'accès spécifique. Appliquer le middleware au namespace est la méthode correcte
 *     pour le protéger.
 *
 * 3.  **Gestion de la Liste des Utilisateurs**:
 *     - Lorsqu'un utilisateur rejoint une conversation (`join_conversation`), le serveur récupère la liste de tous les IDs utilisateurs
 *       présents dans cette "room" et la diffuse à tous les membres via l'événement `user_list_update`.
 *     - Lors de la déconnexion (`disconnect`), le serveur recalcule la liste des utilisateurs pour les rooms où il
 *       se trouvait et envoie une liste mise à jour. Cela permet au frontend d'afficher une liste précise des participants en temps réel.
 */
const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const MessageService = require('../services/message.service');

const onlineUsers = new Map();
let ioInstance;

function initPremiumSocket(server) {
    const io = socketIO(server, {
        path: '/socket.io-premium/', // Chemin unique pour ce service
        cors: {
            origin: '*',
        },
    });

    const premiumNamespace = io.of('/conversation/premium');

    premiumNamespace.use(authenticateSocket);

    premiumNamespace.on('connection', (socket) => {
        const { userId } = socket.decoded;
        console.log(`User connected: ${userId} with socket ${socket.id}`);
        onlineUsers.set(userId, true);

        socket.broadcast.emit('user_status_changed', { userId, online: true });

        socket.on('join_conversation', async (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${userId} joined conversation room: ${conversationId}`);

            // Notify room members of the new user list
            const socketsInRoom = await io.of('/conversation/premium').in(conversationId).fetchSockets();
            const userIdsInRoom = socketsInRoom.map(s => s.decoded.userId);
            io.of('/conversation/premium').to(conversationId).emit('user_list_update', userIdsInRoom);
        });


        socket.on('send_message', async ({ conversationId, recipientId, content }) => {
            try {
                const newMessage = await MessageService.sendMessage(userId,
                    recipientId, content, conversationId);
                socket.nsp.to(conversationId).emit('receive_message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message_error', 'Failed to send message.');
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
            ioInstance.emit('user_status_changed', { userId, online: false });

            // Update user list in rooms the user was in
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    const socketsInRoom = await io.of('/conversation/premium').in(room).fetchSockets();
                    const userIdsInRoom = socketsInRoom.map(s => s.decoded.userId);
                    io.of('/conversation/premium').to(room).emit('user_list_update', userIdsInRoom);
                }
            }
        });
    });

    return io;
}

function isUserOnline(userId) {
    return onlineUsers.has(userId);
}

function getIo() {
    if (!ioInstance) {
        throw new Error('Socket.io not initialized!');
    }
    return ioInstance;
}

module.exports = {
    initPremiumSocket,
    isUserOnline,
    getIo,
    onlineUsers,
};
