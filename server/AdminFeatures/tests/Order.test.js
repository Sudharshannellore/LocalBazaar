const request = require('supertest');
const express = require('express');
const mockingoose = require('mockingoose');
const Order = require('../../UserFeatures/models/Order');
const { getOrders } = require('../controllers/OrderController');
const app = express();
app.get('/orders', getOrders);

describe('GET /orders', () => {
  it('should return 200 and list of orders if orders exist', async () => {
    const mockOrders = [
      { _id: '1', user: 'User A', total: 100 },
      { _id: '2', user: 'User B', total: 200 }
    ];

    mockingoose(Order).toReturn(mockOrders, 'find');

    const res = await request(app).get('/orders');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
