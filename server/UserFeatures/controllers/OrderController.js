const Order = require('../models/Order');
const razorpay  = require('../utils/razorpay')
const crypto = require('crypto');


exports.placeOrder = async (req, res) => {
  try {
    const {
      userId,
      vendorId,
      username,
      email,
      phone,
      items,
      amount,
      deliveryFee,
      taxes,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      isPaid,
    } = req.body;

    // Create a new order document
    const newOrder = new Order({
      userId,
      vendorId,
      username,
      email,
      phone,
      items,
      amount,
      deliveryFee,
      taxes,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      isPaid,
      orderStatus: 'Placed', // Default status
    });

    await newOrder.save();

    // Emit socket event to Vendor (new order received)
    req.io.emit('newOrder', {
      orderId: newOrder._id,
      vendorId: newOrder.vendorId,
      items: newOrder.items,
      amount: newOrder.amount,
      deliveryFee: newOrder.deliveryFee,
      taxes: newOrder.taxes,
      totalAmount: newOrder.totalAmount,
      deliveryAddress: newOrder.deliveryAddress,
      orderStatus: newOrder.orderStatus,
      createdAt: newOrder.createdAt,
    });

    res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Razorpay Order Creation Failed:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

exports.getLatestOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const latestOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestOrder) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ order: latestOrder });
  } catch (error) {
    console.error('Get latest order error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
      return res.status(400).json({ message: 'Order ID and new status are required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit live update to customer and delivery partner
    req.io.emit('orderStatusUpdated', { orderId: updatedOrder._id, newStatus });

    res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

exports.getHistoryOrders = async (req, res)=>{
  const userId = req.userId;
  try {
      const getHistory = await Order.find({userId : userId });
      if(getHistory)
         res.status(200).json(getHistory);
      else
         res.status(404).json({message: 'Orders Not Found'})
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', err: error})
  }
};

