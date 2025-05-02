const request = require('supertest');
const express = require('express');
const mockingoose = require('mockingoose');
const Delivery = require('../models/Delivery');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerDelivery, loginDelivery } = require('../controllers/DeliveryController');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

// Testing for register
app.post('/register', registerDelivery);
describe('POST /register - Delivery Registration', () => {
  it('should register a new delivery agent successfully', async () => {
    mockingoose(Delivery).toReturn(null, 'findOne'); // No existing user
    mockingoose(Delivery).toReturn({ _id: '123', email: 'a@b.com' }, 'save');
    bcrypt.hash.mockResolvedValue('hashed_password');

    const res = await request(app)
      .post('/register')
      .send({
        username: 'Agent1',
        email: 'a@b.com',
        password: 'password123',
        phone: '1234567890'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Delivery registered successfully');
  });

  it('should return 400 if delivery agent already exists', async () => {
    mockingoose(Delivery).toReturn({ _id: '123', email: 'a@b.com' }, 'findOne');

    const res = await request(app)
      .post('/register')
      .send({ email: 'a@b.com', password: 'pass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Delivery agent already exists');
  });

  it('should return 500 on server error', async () => {
    mockingoose(Delivery).toReturn(new Error('DB Error'), 'findOne');

    const res = await request(app)
      .post('/register')
      .send({ email: 'test@test.com', password: 'pass' });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});

// Testing for Login
app.post('/login', loginDelivery);
describe('POST /login - Delivery Login', () => {
  it('should login successfully and return token', async () => {
    const deliveryUser = {
      _id: '123',
      username: 'Agent1',
      email: 'a@b.com',
      phone: '1234567890',
      password: 'hashed_pw'
    };

    mockingoose(Delivery).toReturn(deliveryUser, 'findOne');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake_jwt_token');

    const res = await request(app)
      .post('/login')
      .send({ email: 'a@b.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'fake_jwt_token');
    expect(res.body.delivery).toHaveProperty('email', 'a@b.com');
  });

  it('should return 400 if delivery not found', async () => {
    mockingoose(Delivery).toReturn(null, 'findOne');

    const res = await request(app).post('/login').send({ email: 'unknown@mail.com', password: 'pass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Delivery not found');
  });

  it('should return 400 if password does not match', async () => {
    const mockUser = { email: 'a@b.com', password: 'hashed_pw' };
    mockingoose(Delivery).toReturn(mockUser, 'findOne');
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/login').send({ email: 'a@b.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 500 on server error', async () => {
    mockingoose(Delivery).toReturn(new Error('DB Error'), 'findOne');

    const res = await request(app).post('/login').send({ email: 'a@b.com', password: 'pass' });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});
