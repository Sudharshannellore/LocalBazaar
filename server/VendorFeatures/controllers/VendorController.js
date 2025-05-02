const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "freshbazaar";

exports.VendorRegistration = async (req, res) => {
  try {
    const {
      businessName,
      businessEmail,
      password,
      phone,
      address,
      city,
      state,
      businessLogo,
      category,
    } = req.body;

    // Check if vendor already exists
    const isEmail = await Vendor.findOne({ businessEmail });
    if (isEmail) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor
    const createVendor = new Vendor({
      businessName,
      businessEmail,
      password: hashedPassword,
      phone,
      location: { address, city, state },
      businessLogo,
      category,
    });

    await createVendor.save();
    res.status(200).json({ message: 'Vendor registered successfully, pending approval' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.LoginVendor = async (req, res) => {
  try {
    const { businessEmail, password } = req.body;

    const existingVendor = await Vendor.findOne({ businessEmail });
    if (!existingVendor) return res.status(404).json({ message: "Vendor Not Found" });

    if (existingVendor.approvedStatus !== 'approved') {
      return res.status(403).json({ message: "Vendor not approved yet!" });
    }

    const isMatch = await bcrypt.compare(password, existingVendor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: existingVendor._id }, SECRET);

    res.status(200).json({
      message: "Login successful",
      token,
      vendor: {
        id: existingVendor._id,
        businessName: existingVendor.businessName,
        businessEmail: existingVendor.businessEmail,
        phone: existingVendor.phone,
        location: existingVendor.location,
        businessLogo: existingVendor.businessLogo,
        category: existingVendor.category,      
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
