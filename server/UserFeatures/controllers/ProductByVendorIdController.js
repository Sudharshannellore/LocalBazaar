const Product = require('../../VendorFeatures/models/Product');

exports.FindProductsByVendor = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.params.id }).lean();
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No Products Found for this Vendor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
