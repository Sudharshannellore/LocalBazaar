const Product = require('../models/Product');
const Vendor = require('../models/Vendor')

// Create a new Product
exports.addProduct = async (req, res)=>{
    try {
        const { name, description, price, image, units } = req.body;
    
        const saveProduct = new Product({
          vendor: req.vendorId, // coming from JWT
          name,
          description,
          price,
          image,
          units
        });
        const vendor = await Vendor.findById(req.vendorId);
        let savedProduct = await saveProduct.save();        
        // product pushing into vendor
        vendor.products.push(savedProduct._id);
        await vendor.save();

        res.status(200).json(savedProduct);
      } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Server error while adding product." });
      }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {

   const products = await Product.find({ vendor: req.vendorId });

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Delete a Product
exports.deleteProduct = async (req, res)=>{
    try {
        let response = await Product.findByIdAndDelete(req.params.id);
        if (response) {
            res.status(200).json({message: 'Successfully Deleted'});
        } else {
            res.status(404).json({message: 'Product Not Found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error Please Check You Credentials '})
    }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image,  units } = req.body;
    const productId = req.params.id;

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the current vendor
    if (product.vendor.toString() !== req.vendorId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own products' });
    }

    // Update the fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (image) product.image = image;
    if (units) product.units = units;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
