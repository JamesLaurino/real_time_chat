const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const AuthService = {
  async signup(user) {
    const { username, email, password } = user;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password_hash });
    return newUser;
  },

  async login(credentials) {
    const { email, password } = credentials;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
};

module.exports = AuthService;