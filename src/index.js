const express = require('express');
const http = require('http');
const { initSocket } = require('./sockets/socketManager');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const conversationRoutes = require('./routes/conversation.routes');
const sequelize = require('./config/db');
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');

// Configuration CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:3001',
  'http://localhost:63342',
];

if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push('https://your-project-name.web.app');
  allowedOrigins.push('https://your-project-name.firebaseapp.com');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}


app.use(helmet());

initSocket(server);

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running !!!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/conversations', conversationRoutes);

app.use(errorHandler);

const startServer = () => {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database & tables created!');
      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unable to connect to the database:', err);
      } else {
        console.error('Unable to connect to the database. Check credentials and connectivity.');
      }
    });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, server };