const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const MessageService = require('../services/message.service');

const onlineUsers = new Map();
let ioInstance;

function initPremiumSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(authenticateSocket);
    ioInstance = io;

    io.of('/conversation/premium').on('connection', (socket) => {
        const { userId } = socket.decoded;
        console.log(`User connected: ${userId} with socket ${socket.id}`);
        onlineUsers.set(userId, true);

        socket.broadcast.emit('user_status_changed', { userId, online: true });

        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${userId} joined conversation room: ${conversationId}`);
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

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
            ioInstance.emit('user_status_changed', { userId, online: false });
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
