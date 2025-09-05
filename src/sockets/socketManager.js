const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const MessageService = require('../services/message.service'); // Import MessageService

const userSocketMap = new Map();
let ioInstance;

function initSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(authenticateSocket);
  ioInstance = io;

  io.on('connection', (socket) => {
    const { userId } = socket.decoded;
    console.log(`User connected: ${userId} with socket ${socket.id}`);
    userSocketMap.set(userId, socket.id);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation room: ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', async ({ conversationId, recipientId, content }) => {
      try {
        const newMessage = await MessageService.sendMessage(userId, recipientId, content, conversationId);
        // Emit message to all participants in the conversation room
        ioInstance.to(conversationId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', 'Failed to send message.');
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      userSocketMap.delete(userId);
    });
  });

  return io;
}

function getSocketId(userId) {
  return userSocketMap.get(userId);
}

function getIo() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized!');
  }
  return ioInstance;
}

module.exports = {
  initSocket,
  getSocketId,
  getIo,
};
