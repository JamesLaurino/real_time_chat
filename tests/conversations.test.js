const request = require('supertest');
const { app, server } = require('../src/index');
const sequelize = require('../src/config/db');
const User = require('../src/models/user.model');
const Conversation = require('../src/models/conversation.model');
const Message = require('../src/models/message.model');

let token;
let user1, user2;
let conversation;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create users
  await request(app).post('/auth/signup').send({ username: 'user1', email: 'user1@test.com', password: 'password' });
  await request(app).post('/auth/signup').send({ username: 'user2', email: 'user2@test.com', password: 'password' });

  user1 = await User.findOne({ where: { email: 'user1@test.com' } });
  user2 = await User.findOne({ where: { email: 'user2@test.com' } });

  // Log in user1 to get a token
  const res = await request(app).post('/auth/login').send({ email: 'user1@test.com', password: 'password' });
  token = res.body.data.token;

  // Create a conversation
  conversation = await Conversation.create({ user1_id: user1.id, user2_id: user2.id });

  // Create messages
  await Message.create({ conversation_id: conversation.id, sender_id: user1.id, content: 'Hello user2' });
  await Message.create({ conversation_id: conversation.id, sender_id: user2.id, content: 'Hello user1' });
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
  await sequelize.close();
});

describe('Conversation and Message Endpoints', () => {
  it('should get user conversations', async () => {
    const res = await request(app)
      .get('/users/me/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].user1_id).toBe(user1.id);
  });

  it('should get conversation messages', async () => {
    const res = await request(app)
      .get(`/conversations/${conversation.id}/messages`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].content).toBe('Hello user2');
  });

  it('should return 404 for a non-existent conversation', async () => {
    const res = await request(app)
      .get('/conversations/999/messages')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Conversation not found');
  });

  it('should return 401 if no token is provided for conversations', async () => {
    const res = await request(app).get('/users/me/conversations');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 if no token is provided for messages', async () => {
    const res = await request(app).get(`/conversations/${conversation.id}/messages`);
    expect(res.statusCode).toEqual(401);
  });
});
