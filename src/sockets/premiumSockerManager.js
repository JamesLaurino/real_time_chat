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

        socket.on('join_conversation', async (conversationId) => {
                socket.join('premium conversation room : ' + conversationId);
                console.log(`User ${userId} joined premium conversation room ` + conversationId);

                //const premiumConversation = await ConversationService.findPremiumConversationById(conversationId);
                // premiumConversation.id

                try {
                    await ConversationUserService.create({ conversation_id: conversationId, user_id: userId });
                } catch (e) {
                    if (e.name !== 'SequelizeUniqueConstraintError') {
                        console.error('Failed to add user to premium group', e);
                    }
                }

                const socketsInRoom = await premiumNamespace.in('premium').fetchSockets();
                const userIdsInRoom = socketsInRoom.map(s => s.decoded.id);
                premiumNamespace.to('premium').emit('user_list_update', userIdsInRoom);
        });


        // MESSAGE_DATA  : { conversationId, content }
        socket.on('send_message', async (messageData) => {
            try {
                //const premiumConversation = await ConversationService.findPremiumConversationById(messageData.conversationId);
                const conversationId = messageData.conversationId;

                const newMessage = await MessageService.sendMessage(userId, null, messageData.content, conversationId);
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
