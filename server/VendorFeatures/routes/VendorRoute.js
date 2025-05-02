const express = require("express");
const vendorController = require('../controllers/VendorController');

// Tokens
const verifyVendorToken = require('../../Middleware/VerifyVendorToken');
const VerifyUserToken = require('../../Middleware/VerifyUserToken')

// Vendor orders Imports
const orderVendorController = require('../controllers/OrderVendorController');


// Product Imports
const productController = require('../controllers/ProductController');

// Review Imports
const reviewController = require("../controllers/ReviewController");

const router = express.Router();

// Vendor Routes
router.post('/register', vendorController.VendorRegistration);
router.post('/login', vendorController.LoginVendor);


// Product Routes
router.post('/save/product', verifyVendorToken, productController.addProduct);
router.get('/get/product', verifyVendorToken, productController.getProducts)
router.delete('/delete/product/:id', verifyVendorToken, productController.deleteProduct)
router.put('/update/product/:id', verifyVendorToken, productController.updateProduct)

// Review Routes
router.post("/create/review/:id", VerifyUserToken, reviewController.createReview);
router.get("/get/review/:id", reviewController.getReviews);

// vendor orders
router.get('/vendor-orders', verifyVendorToken, orderVendorController.getOrdersPlaced);
router.get('/order/history', verifyVendorToken, orderVendorController.getHistoryVendorOrders);

module.exports = router;