const request = require('supertest');
const { app, server } = require('../src/index');
const sequelize = require('../src/config/db');
const User = require('../src/models/user.model');
const Message = require('../src/models/message.model');
const Conversation = require('../src/models/conversation.model');

describe('Message Quota via HTTP', () => {
  let user1, user2, premiumUser;
  let tokenUser1, tokenPremiumUser;
  let conversation1, conversation2;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create users
    await request(app).post('/auth/signup').send({ username: 'user1', email: 'user1@test.com', password: 'password' });
    await request(app).post('/auth/signup').send({ username: 'user2', email: 'user2@test.com', password: 'password' });
    await request(app).post('/auth/signup').send({ username: 'premium', email: 'premium@test.com', password: 'password' });

    user1 = await User.findOne({ where: { email: 'user1@test.com' } });
    user2 = await User.findOne({ where: { email: 'user2@test.com' } });
    premiumUser = await User.findOne({ where: { email: 'premium@test.com' } });

    // Make one user premium
    await premiumUser.update({ premium: true });

    // Create conversations
    conversation1 = await Conversation.create({ user1_id: user1.id, user2_id: user2.id });
    conversation2 = await Conversation.create({ user1_id: premiumUser.id, user2_id: user2.id });

    // Log in users to get tokens
    const resUser1 = await request(app).post('/auth/login').send({ email: 'user1@test.com', password: 'password' });
    tokenUser1 = resUser1.body.data.token;

    const resPremiumUser = await request(app).post('/auth/login').send({ email: 'premium@test.com', password: 'password' });
    tokenPremiumUser = resPremiumUser.body.data.token;
  }, 30000);

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });

  test('non-premium user should be blocked after 10 messages', async () => {
    const messages = [];
    for (let i = 0; i < 10; i++) {
        messages.push({
            conversation_id: conversation1.id,
            sender_id: user1.id,
            content: `message ${i}`
        });
    }
    await Message.bulkCreate(messages);

    const res = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        recipientId: user2.id,
        content: 'message 11',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('You have reached your daily message limit.');
  }, 30000);

  test('premium user should not be blocked after 10 messages', async () => {
    const messages = [];
    for (let i = 0; i < 10; i++) {
        messages.push({
            conversation_id: conversation2.id,
            sender_id: premiumUser.id,
            content: `message ${i}`
        });
    }
    await Message.bulkCreate(messages);

    const res = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${tokenPremiumUser}`)
      .send({
        recipientId: user2.id,
        content: 'message 11',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe('message 11');
  }, 30000);
});
