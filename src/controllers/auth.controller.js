const AuthService = require('../services/auth.service');

const AuthController = {
  async signup(req, res, next) {
    try {
      const user = await AuthService.signup(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const token = await AuthService.login(req.body);
      res.status(200).json({ success: true, data: token });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;