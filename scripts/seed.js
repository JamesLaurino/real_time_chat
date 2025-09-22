require('dotenv').config();
const sequelize = require('../src/config/db');
const User = require('../src/models/user.model');
const Conversation = require('../src/models/conversation.model');
const Message = require('../src/models/message.model');
const Conversation_user = require('../src/models/conversation_user.model');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Use force: true to drop existing tables
    console.log('Database synchronized and tables (re)created.');

    // Create users
    const passwordHash1 = await bcrypt.hash('password123', 10);

    const user1 = await User.create({
      username: 'Alice',
      email: 'alice@example.com',
      password_hash: passwordHash1,
      premium:true
    });

    const user2 = await User.create({
      username: 'Bob',
      email: 'bob@example.com',
      password_hash: passwordHash1,
      premium:true
    });

    const user3 = await User.create({
      username: 'Gin',
      email: 'gin@example.com',
      password_hash: passwordHash1,
      premium:true
    });

    const user4 = await User.create({
      username: 'Tonic',
      email: 'tonic@example.com',
      password_hash: passwordHash1,
    });

    const user5 = await User.create({
      username: 'Aude',
      email: 'javel@example.com',
      password_hash: passwordHash1,
    });

    console.log('Users created:', user1.toJSON(), user2.toJSON());

    // Create a conversation between Alice and Bob
    const conversation = await Conversation.create({
      user1_id: user1.id,
      user2_id: user2.id,
    });
    console.log('Conversation created:', conversation.toJSON());

    // Conversation entre deux non premium aude + tonic
    const conversation2 = await Conversation.create({
      user1_id: user4.id,
      user2_id: user5.id,
    });

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
      {
        conversation_id: conversation.id,
        sender_id: user3.id,
        content: 'I am the third user here!',
      },
      {
        conversation_id: conversation2.id,
        sender_id: user4.id,
        content: 'I am Tonic user here!',
      },
      {
        conversation_id: conversation2.id,
        sender_id: user5.id,
        content: 'I am the Aude user here!',
      },
    ]);
    console.log('Messages created.');

    // Create conversation premium
    const conversation_user = await Conversation_user.create({
      conversation_id: conversation.id,
      user_id: user3.id
    })

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();