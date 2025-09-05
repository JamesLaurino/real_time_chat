const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const AuthService = {
  async signup(user) {
    const { username, email, password } = user;
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, email, password_hash });
    return newUser;
  },

  async login(credentials) {
    const { email, password } = credentials;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    return { token };
  }
};

module.exports = AuthService;