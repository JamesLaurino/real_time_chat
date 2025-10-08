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

    const user6 = await User.create({
      username: 'Charlie',
      email: 'charlie@example.com',
      password_hash: passwordHash1,
      premium: true
    });

    const user7 = await User.create({
      username: 'David',
      email: 'david@example.com',
      password_hash: passwordHash1,
      premium: true
    });

    const user8 = await User.create({
      username: 'Emma',
      email: 'emma@example.com',
      password_hash: passwordHash1,
      premium: true
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

    // Create MULTICHAT conversations (Premium Group Chats)
    // Multichat 1: Tech Discussion
    const multichat1 = await Conversation.create({
      user1_id: user1.id,
      user2_id: user1.id,
    });

    // Multichat 2: Gaming Group
    const multichat2 = await Conversation.create({
      user1_id: user2.id,
      user2_id: user2.id,
    });

    // Multichat 3: General Chat
    const multichat3 = await Conversation.create({
      user1_id: user6.id,
      user2_id: user6.id,
    });

    console.log('Conversations and multichats created.');

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
      // Multichat 1 messages (Tech Discussion)
      {
        conversation_id: multichat1.id,
        sender_id: user1.id,
        content: 'Welcome to the Tech Discussion multichat!',
      },
      {
        conversation_id: multichat1.id,
        sender_id: user3.id,
        content: 'Hey everyone! Excited to discuss tech topics here.',
      },
      {
        conversation_id: multichat1.id,
        sender_id: user6.id,
        content: 'What are we discussing today?',
      },
      {
        conversation_id: multichat1.id,
        sender_id: user7.id,
        content: 'Let\'s talk about the latest JavaScript frameworks!',
      },
      // Multichat 2 messages (Gaming Group)
      {
        conversation_id: multichat2.id,
        sender_id: user2.id,
        content: 'Welcome to the Gaming Group!',
      },
      {
        conversation_id: multichat2.id,
        sender_id: user1.id,
        content: 'Anyone up for a game tonight?',
      },
      {
        conversation_id: multichat2.id,
        sender_id: user8.id,
        content: 'Count me in! What game are we playing?',
      },
      {
        conversation_id: multichat2.id,
        sender_id: user3.id,
        content: 'I suggest we play some multiplayer action!',
      },
      // Multichat 3 messages (General Chat)
      {
        conversation_id: multichat3.id,
        sender_id: user6.id,
        content: 'This is the General Chat room. Feel free to discuss anything!',
      },
      {
        conversation_id: multichat3.id,
        sender_id: user7.id,
        content: 'Great! Happy to be here.',
      },
      {
        conversation_id: multichat3.id,
        sender_id: user8.id,
        content: 'What a nice community we have here!',
      },
    ]);
    console.log('Messages created.');

    // Create conversation_user entries for premium group chats (Multichat)
    // Multichat 1: Tech Discussion participants
    await Conversation_user.bulkCreate([
      { conversation_id: multichat1.id, user_id: user1.id },
      { conversation_id: multichat1.id, user_id: user3.id },
      { conversation_id: multichat1.id, user_id: user6.id },
      { conversation_id: multichat1.id, user_id: user7.id },
      // Multichat 2: Gaming Group participants
      { conversation_id: multichat2.id, user_id: user1.id },
      { conversation_id: multichat2.id, user_id: user2.id },
      { conversation_id: multichat2.id, user_id: user3.id },
      { conversation_id: multichat2.id, user_id: user8.id },
      // Multichat 3: General Chat participants
      { conversation_id: multichat3.id, user_id: user6.id },
      { conversation_id: multichat3.id, user_id: user7.id },
      { conversation_id: multichat3.id, user_id: user8.id },
      // Old premium conversation
      { conversation_id: conversation.id, user_id: user3.id }
    ]);

    console.log('Conversation users (multichat participants) created.');
    console.log('Database seeding completed successfully!');
    console.log('\n=== MULTICHAT DETAILS ===');
    console.log(`Multichat 1 (Tech Discussion) ID: ${multichat1.id} - Users: Alice, Gin, Charlie, David`);
    console.log(`Multichat 2 (Gaming Group) ID: ${multichat2.id} - Users: Alice, Bob, Gin, Emma`);
    console.log(`Multichat 3 (General Chat) ID: ${multichat3.id} - Users: Charlie, David, Emma`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();