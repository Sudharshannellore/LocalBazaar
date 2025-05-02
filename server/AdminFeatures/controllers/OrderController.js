const Order = require('../../UserFeatures/models/Order')

exports.getOrders = async(req, res)=>{
    try {
        const orders = await Order.find();
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(204).json({message : 'No Orders Found'});
        }
    } catch (error) {
        res.status(500).json({message : 'Internal Server Error', err: error});
    }
};