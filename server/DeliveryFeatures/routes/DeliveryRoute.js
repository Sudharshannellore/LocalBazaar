const express = require("express");
const {registerDelivery, loginDelivery} = require('../controllers/DeliveryController');
const orderDeliveryController = require('../controllers/OrdersDeliveryController');
const verifyToken = require('../../Middleware/VerifyDeliveryToken')

const router = express.Router();

router.post('/register', registerDelivery);
router.post('/login', loginDelivery);

// delivery orders
router.get('/delivery-orders', verifyToken, orderDeliveryController.getOrdersReady);

// Delivery Id Update
router.put('/delivery-id/:id', orderDeliveryController.updateDeliveryId);

// Update PaymentD
router.put('/payment-status/:id', orderDeliveryController.updatePayment);

// History Delivery Orders
router.get('/orders-history', verifyToken, orderDeliveryController.getHistoryDeliveries)

module.exports = router;