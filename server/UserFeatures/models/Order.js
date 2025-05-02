const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor',
  },
  deliveryAssignedTo : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery', default : null,
  },
  username: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  items: [
    {
      productItemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      productName: {type: String, require: true},
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  taxes: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    pincode: { type: String },
  },
  paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
  isPaid: { type: Boolean, default: false },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'],
    default: 'Placed',
  },
  placedAt: { type: Date, default: Date.now }
}, 
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);