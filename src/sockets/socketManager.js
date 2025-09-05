const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');

const userSocketMap = new Map();

function initSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const { userId } = socket.decoded;
    console.log(`User connected: ${userId} with socket ${socket.id}`);
    userSocketMap.set(userId, socket.id);

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

module.exports = {
  initSocket,
  getSocketId,
};
