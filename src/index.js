
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});