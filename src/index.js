
const express = require('express');
const http = require('http');
const { initSocket } = require('./sockets/socketManager');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const conversationRoutes = require('./routes/conversation.routes');
const sequelize = require('./config/db');
const User = require('./models/user.model');
const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model');
const errorHandler = require("./middleware/errorHandler");

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
app.use('/conversations', conversationRoutes);

app.use(errorHandler);

// Sync Sequelize models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });