const User = require('../models/user.model');

const UserService = {
  async updatePremiumStatus(email, premium) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.premium = premium;
    await user.save();
    return user;
  }
};

module.exports = UserService;