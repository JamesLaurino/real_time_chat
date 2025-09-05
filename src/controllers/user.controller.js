const UserModel = require('../models/user.model');

const UserController = {
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = UserController;