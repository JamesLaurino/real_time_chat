const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const MessageService = require('../services/message.service'); // Import MessageService

const onlineUsers = new Map();
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
    onlineUsers.set(userId, true);

    // Join conversation room
    // TODO: Extend this for group chats (rooms with multiple users)
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation room: ${conversationId}`);
    });

    // TODO: Add a 'leave_conversation' event for when a user closes a chat window

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
      onlineUsers.delete(userId);
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
  initSocket,
  isUserOnline,
  getIo,
  onlineUsers,
};
