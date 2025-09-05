require('dotenv').config();
const sequelize = require('../src/config/db');
const User = require('../src/models/user.model');
const Conversation = require('../src/models/conversation.model');
const Message = require('../src/models/message.model');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Use force: true to drop existing tables
    console.log('Database synchronized and tables (re)created.');

    // Create users
    const passwordHash1 = await bcrypt.hash('password123', 10);
    const passwordHash2 = await bcrypt.hash('password456', 10);

    const user1 = await User.create({
      username: 'Alice',
      email: 'alice@example.com',
      password_hash: passwordHash1,
    });

    const user2 = await User.create({
      username: 'Bob',
      email: 'bob@example.com',
      password_hash: passwordHash2,
    });

    console.log('Users created:', user1.toJSON(), user2.toJSON());

    // Create a conversation between Alice and Bob
    const conversation = await Conversation.create({
      user1_id: user1.id,
      user2_id: user2.id,
    });
    console.log('Conversation created:', conversation.toJSON());

    // Create messages in the conversation
    await Message.bulkCreate([
      {
        conversation_id: conversation.id,
        sender_id: user1.id,
        content: 'Hi Bob, how are you?',
      },
      {
        conversation_id: conversation.id,
        sender_id: user2.id,
        content: 'I am good, Alice! How about you?',
      },
      {
        conversation_id: conversation.id,
        sender_id: user1.id,
        content: 'I am doing great, thanks!',
      },
    ]);
    console.log('Messages created.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();