
const express = require('express');
const http = require('http');
const { initSocket } = require('./sockets/socketManager');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

initSocket(server);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});