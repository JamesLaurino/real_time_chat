const request = require('supertest');
const { app, server } = require('../src/index');
const sequelize = require('../src/config/db');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create users
  await request(app).post('/auth/signup').send({ username: 'user1', email: 'user1@test.com', password: 'password' });
  await request(app).post('/auth/signup').send({ username: 'user2', email: 'user2@test.com', password: 'password' });

  // Log in to get a token
  const res = await request(app).post('/auth/login').send({ email: 'user1@test.com', password: 'password' });
  token = res.body.data.token;
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
  await sequelize.close();
});

describe('Users Endpoint', () => {
  it('should get all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].username).toBe('user1');
    expect(res.body.data[1].username).toBe('user2');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(401);
  });
});
