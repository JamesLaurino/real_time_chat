const pool = require('../src/config/db');
const UserModel = require('../src/models/user.model');
const ConversationModel = require('../src/models/conversation.model');
const MessageModel = require('../src/models/message.model');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is used for password hashing

async function seedMockData() {
  console.log('Starting to seed mock data...');

  try {
    // --- Create Users ---
    console.log('Creating users...');
    const hashedPassword1 = await bcrypt.hash('1234', 10);
    const user1 = await UserModel.create({ username: 'user1', email: 'user1@mail.com', password_hash: hashedPassword1 });
    console.log('Created user1:', user1);

    const hashedPassword2 = await bcrypt.hash('1234', 10);
    const user2 = await UserModel.create({ username: 'user2', email: 'user2@mail.com', password_hash: hashedPassword2 });
    console.log('Created user2:', user2);

    // --- Create Conversations ---
    console.log('Creating conversations...');
    const conversation1_2 = await ConversationModel.findOrCreateConversation(user1.id, user2.id);
    console.log('Created conversation between user1 and user2:', conversation1_2);

    // --- Create Messages ---
    console.log('Creating messages...');
    await MessageModel.createMessage(conversation1_2.id, user1.id, 'Salut user2, comment ça va ?');
    await MessageModel.createMessage(conversation1_2.id, user2.id, 'Salut user1 ! Ça va bien, merci. Et toi ?');
    await MessageModel.createMessage(conversation1_2.id, user1.id, 'Super ! Je suis en train de tester notre nouvelle app de chat.');
    await MessageModel.createMessage(conversation1_2.id, user2.id, 'Génial ! Ça a l\'air de bien fonctionner.');

    console.log('Mock data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding mock data:', error);
    // Check if the error is due to duplicate entry for email
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
      console.warn('Users might already exist. Skipping user creation and proceeding with conversations/messages.');
      // Attempt to retrieve existing users and continue
      try {
        const existingUser1 = await UserModel.findByEmail('user1@mail.com');
        const existingUser2 = await UserModel.findByEmail('user2@mail.com');

        if (existingUser1 && existingUser2) {
          console.log('Found existing users. Proceeding with conversations and messages.');
          const conversation1_2 = await ConversationModel.findOrCreateConversation(existingUser1.id, existingUser2.id);
          console.log('Found or created conversation between existing user1 and user2:', conversation1_2);

          await MessageModel.createMessage(conversation1_2.id, existingUser1.id, 'Nouveau message de user1 (après re-seed).');
          await MessageModel.createMessage(conversation1_2.id, existingUser2.id, 'Nouveau message de user2 (après re-seed).');
          console.log('Added new messages to existing conversation.');
        } else {
          console.error('Could not find existing users after duplicate entry error. Please clear your database or manually create users.');
        }
      } catch (retrieveError) {
        console.error('Error retrieving existing users:', retrieveError);
      }
    }
  } finally {
    // Close the database connection pool
    if (pool && pool.end) {
      await pool.end();
      console.log('Database connection closed.');
    }
  }
}

seedMockData();
