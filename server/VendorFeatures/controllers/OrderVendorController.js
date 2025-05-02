const Order = require('../../UserFeatures/models/Order')

// orders are placed
exports.getOrdersPlaced = async (req, res) => {
  try {
    const orders = await Order.find({ 
      vendorId: req.vendorId,
      orderStatus: { $in: ['Placed','Accepted', 'Preparing'] }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching delivery orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getHistoryVendorOrders = async (req, res)=>{
    const vendorId = req.vendorId;
    try {
        const getHistory = await Order.find({vendorId : vendorId });
        if(getHistory)
           res.status(200).json(getHistory);
        else
           res.status(404).json({message: 'Orders Not Found'})
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', err: error})
    }
};