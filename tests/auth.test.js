const request = require('supertest');
const { app, server } = require('../src/index');
const sequelize = require('../src/config/db');

beforeAll(async () => {
  // Use force: true to reset the database before tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the server and the database connection
  await new Promise(resolve => server.close(resolve));
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toBe('testuser');
  });

  it('should not signup a user with an existing email', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser2',
        email: 'test@example.com', // Same email as before
        password: 'password123',
      });
    expect(res.statusCode).toBe(500); // Or whatever your error handler returns
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not login with a wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
