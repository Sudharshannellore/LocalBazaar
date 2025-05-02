const request = require('supertest');
const express = require('express');
const mockingoose = require('mockingoose');
const Order = require('../../UserFeatures/models/Order');
const {
  getOrdersPlaced,
  getHistoryVendorOrders
} = require('../controllers/OrderVendorController'); // adjust path as needed

const app = express();
app.use(express.json());

// Simulate middleware that sets vendorId
app.get('/orders/placed', (req, res) => {
  req.vendorId = 'vendor123';
  getOrdersPlaced(req, res);
});

app.get('/orders/history', (req, res) => {
  req.vendorId = 'vendor123';
  getHistoryVendorOrders(req, res);
});

describe('GET /orders/placed', () => {
  it('should return placed/accepted/preparing orders for vendor', async () => {
    const orders = [
      { _id: '1', orderStatus: 'Placed' },
      { _id: '2', orderStatus: 'Preparing' }
    ];

    mockingoose(Order).toReturn(orders, 'find');

    const res = await request(app).get('/orders/placed');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should return 500 on DB error', async () => {
    mockingoose(Order).toReturn(new Error('DB Error'), 'find');

    const res = await request(app).get('/orders/placed');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});

describe('GET /orders/history', () => {
  it('should return all orders for vendor', async () => {
    const orders = [{ _id: '1' }, { _id: '2' }];
    mockingoose(Order).toReturn(orders, 'find');

    const res = await request(app).get('/orders/history');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should return 200 with empty array if no orders found', async () => {
    mockingoose(Order).toReturn([], 'find');

    const res = await request(app).get('/orders/history');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return 500 on DB error', async () => {
    mockingoose(Order).toReturn(new Error('DB Error'), 'find');

    const res = await request(app).get('/orders/history');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});
