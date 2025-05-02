const Order = require('../../UserFeatures/models/Order')


// Orders are Ready
exports.getOrdersReady = async (req, res) => {
    try {

    const orders = await Order.find({
      orderStatus: { $in: ["Ready for Pickup", 'Out for Delivery'] }, 
      $or: [
        { deliveryAssignedTo: null },
        { deliveryAssignedTo: req.deliveryId }
      ]
    });

    res.status(200).json({ message: 'Delivery assigned successfully and orders fetched.', orders });
  } catch (error) {
    console.error('Error assigning delivery and fetching orders:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateDeliveryId = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { deliveryId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryAssignedTo === null) {
      order.deliveryAssignedTo = deliveryId;
      await order.save();
      return res.status(200).json({ message: true });
    } else {
      return res.status(400).json({ message: 'Delivery already assigned' });
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }

} 

exports.getHistoryDeliveries = async (req, res)=>{
    const deliveryId = req.deliveryId;
    try {
        const getHistory = await Order.find({deliveryAssignedTo : deliveryId });
        if(getHistory)
           res.status(200).json(getHistory);
        else
           res.status(404).json({message: 'Orders Not Found'})
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', err: error})
    }
};

exports.updatePayment =  async (req, res)=>{
    try {
        const orderId = req.params.id;
        const { isPaid } = req.body;
    
        const order = await Order.findById(orderId);
    
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        if ((order.paymentMethod === 'COD')&&(order.isPaid === false)) {
          order.isPaid = isPaid;
          await order.save();
          return res.status(200).json({ message: true });
        } else {
          return res.status(400).json({ message: 'Payment already Done' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
      }
    
    }