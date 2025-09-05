const jwt = require('jsonwebtoken');

function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.decoded = decoded;
    next();
  });
}

module.exports = { authenticateSocket };
