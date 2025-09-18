const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const ConversationUserService = require('../services/conversationUser.service.js');
const ConversationService = require('../services/conversation.service.js');
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
        const { id: userId } = socket.decoded; // Use 'id' from JWT payload and rename it to userId
        console.log(`User connected: ${userId} with socket ${socket.id}`);
        onlineUsers.set(userId, true);

        socket.broadcast.emit('user_status_changed', { userId, online: true });

        socket.on('join_conversation', async (conversationName) => { // e.g., conversationName is 'premium'
            if (conversationName === 'premium') {
                socket.join('premium');
                console.log(`User ${userId} joined premium conversation room`);

                const premiumConversation = await ConversationService.findOrCreatePremiumGroup();

                // Here you would add the user to the conversation_user table
                // Note: You might want to check if the user is already in the group first
                // For simplicity, we'll just try to add them.
                try {
                    await ConversationUserService.create({ conversation_id: premiumConversation.id, user_id: userId });
                } catch (e) {
                    // Ignore unique constraint errors if the user is already in the group
                    if (e.name !== 'SequelizeUniqueConstraintError') {
                        console.error('Failed to add user to premium group', e);
                    }
                }

                const socketsInRoom = await premiumNamespace.in('premium').fetchSockets();
                const userIdsInRoom = socketsInRoom.map(s => s.decoded.id);
                premiumNamespace.to('premium').emit('user_list_update', userIdsInRoom);
            }
        });


        socket.on('send_message', async ({ content }) => { // recipientId and conversationId are removed from client payload
            try {
                // Find or create the premium group conversation to get its ID
                const premiumConversation = await ConversationService.findOrCreatePremiumGroup();
                const conversationId = premiumConversation.id;

                const newMessage = await MessageService.sendMessage(userId, null, content, conversationId);
                socket.nsp.to('premium').emit('receive_message', newMessage);
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
