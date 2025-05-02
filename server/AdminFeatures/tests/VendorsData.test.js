const request = require('supertest');
const express = require('express');
const mockingoose = require('mockingoose');
const Vendor = require('../../VendorFeatures/models/Vendor');
const { getVendors } = require('../controllers/VendorsDataController');

const app = express();
app.get('/get/vendor-data', getVendors);

describe('GET /get/vendor-data', () => {
  it('should return 200 and a list of vendors with selected fields', async () => {
    const mockVendors = [
      {
        _id: '1',
        businessName: 'Fresh Farm',
        businessEmail: 'farm@example.com',
        phone: '1234567890',
        location: 'Andhra Pradesh',
        businessLogo: 'logo.png',
        category: 'Vegetables',
        products: [{ name: 'Tomato' }]
      },
      {
        _id: '2',
        businessName: 'Green Mart',
        businessEmail: 'green@example.com',
        phone: '0987654321',
        location: 'Telangana',
        businessLogo: 'logo2.png',
        category: 'Fruits',
        products: []
      }
    ];

    mockingoose(Vendor).toReturn(mockVendors, 'find');

    const res = await request(app).get('/get/vendor-data');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('businessName');
    expect(res.body[0]).toHaveProperty('products');
    expect(res.body[1].products).toEqual([]);
  });
});
