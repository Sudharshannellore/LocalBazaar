const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController')
const product = require('../controllers/ProductByVendorIdController');
const orderController = require('../controllers/OrderController');
const verifyUserToken = require('../../Middleware/VerifyUserToken')

// user authentication 
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Usernames for reviews
router.get('/get/username/:id', userController.usernameById);

// User get products based on vendor id
router.post('/vendor/product/:id', product.FindProductsByVendor);

// User places a new order
router.post('/place/order', orderController.placeOrder);

// Razorpay payment gate way
router.post('/create/order/razorpay', orderController.createRazorpayOrder);

// User gets the latest order
router.get('/latest/order', verifyUserToken, orderController.getLatestOrder);

// Vendor updates order status
router.patch('/order/update-status', orderController.updateOrderStatus);

// Vendor order history
router.get('/order/history', verifyUserToken, orderController.getHistoryOrders)

module.exports = router;