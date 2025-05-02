const express = require("express");
const categoryController = require('../controllers/CategoryController');
const vendorApproveController = require('../controllers/VendorApproveController');
const vendorData = require('../controllers/VendorsDataController');
const orderController = require('../controllers/OrderController');



const router = express.Router();

// Category Management
router.post('/save/category', categoryController.createCategory);
router.get('/get/category', categoryController.getCategories);
router.delete('/delete/category/:id', categoryController.deleteCategory);

// Vendor Approvals
router.get('/pending/vendor', vendorApproveController.getPendingVendors);
router.post('/approve/vendor/:id', vendorApproveController.approveVendor);
router.post('/reject/vendor/:id', vendorApproveController.approveRejected);

// Vendors Data
router.get('/get/vendor-data', vendorData.getVendors);

// Orders Data
router.get('/orders', orderController.getOrders);


module.exports = router;