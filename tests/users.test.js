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

  it('should toggle the premium status of a user', async () => {
    // First, update to premium
    const res_to_premium = await request(app)
      .put('/users/premium')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'user2@test.com', premium: true });

    expect(res_to_premium.statusCode).toEqual(200);
    expect(res_to_premium.body.success).toBe(true);
    expect(res_to_premium.body.data.premium).toBe(true);

    // Then, update back to not premium
    const res_to_not_premium = await request(app)
      .put('/users/premium')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'user2@test.com', premium: false });

    expect(res_to_not_premium.statusCode).toEqual(200);
    expect(res_to_not_premium.body.success).toBe(true);
    expect(res_to_not_premium.body.data.premium).toBe(false);
  });
});