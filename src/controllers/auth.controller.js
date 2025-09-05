const AuthService = require('../services/auth.service');

const AuthController = {
  async signup(req, res) {
    try {
      const user = await AuthService.signup(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async login(req, res) {
    try {
      const token = await AuthService.login(req.body);
      res.status(200).json({ success: true, data: token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

module.exports = AuthController;