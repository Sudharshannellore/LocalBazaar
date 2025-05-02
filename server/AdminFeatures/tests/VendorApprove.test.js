const request = require('supertest');
const express = require('express');
const mockingoose = require('mockingoose');
const Vendor = require('../../VendorFeatures/models/Vendor');
const {
  getPendingVendors,
  approveVendor,
  approveRejected
} = require('../controllers/VendorApproveController');

const app = express();
app.use(express.json());

// Testing for pending vendors
app.get('/pending/vendor', getPendingVendors);
describe('Vendor Controller', () => {
  const vendorId = '645fcfc5d8a1b72e749342aa';

  describe('GET /pending/vendor', () => {
    it('should return list of pending vendors', async () => {
      const mockVendors = [{ _id: vendorId, name: 'Test Vendor', approvedStatus: 'pending' }];
      mockingoose(Vendor).toReturn(mockVendors, 'find');

      const res = await request(app).get('/pending/vendor');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('approvedStatus', 'pending');
    });
  });

// Testing for vendor approve  
app.post('/approve/vendor/:id', approveVendor);
  describe('POST /approve/vendor/:id', () => {
    it('should approve a vendor', async () => {
      mockingoose(Vendor).toReturn({ _id: vendorId, approvedStatus: 'approved' }, 'findOneAndUpdate');

      const res = await request(app).post(`/approve/vendor/${vendorId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Vendor approved');
    });

  });

// Testing for vendor rejections 
app.post('/reject/vendor/:id', approveRejected); 
  describe('POST /reject/vendor/:id', () => {
    it('should reject a vendor', async () => {
      mockingoose(Vendor).toReturn({ _id: vendorId, approvedStatus: 'rejected' }, 'findOneAndUpdate');

      const res = await request(app).post(`/reject/vendor/${vendorId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Vendor Rejected');
    });
  });
});
