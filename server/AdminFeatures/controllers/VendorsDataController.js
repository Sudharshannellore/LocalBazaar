const Vendor = require('../../VendorFeatures/models/Vendor');

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();

    if (vendors.length > 0) {
      const vendorData = vendors.map(vendor => ({
        id: vendor._id,
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        phone: vendor.phone,
        location: vendor.location,
        businessLogo: vendor.businessLogo,
        category: vendor.category,
        products: vendor.products || []
      }));

      res.status(200).json(vendorData);
    } else {
      res.status(404).json({ message: 'No vendors found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
