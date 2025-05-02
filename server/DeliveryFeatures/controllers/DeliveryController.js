const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Delivery = require('../models/Delivery')

// Delivery Registration
const registerDelivery = async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    // Check if user already exists
    const existingDelivery = await Delivery.findOne({ email });
    if (existingDelivery) {
      return res.status(400).json({ message: 'Delivery agent already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Delivery
    const newDelivery = new Delivery({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    // Save user to DB
    await newDelivery.save();
    res.status(200).json({ message: 'Delivery registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delivery Login
const loginDelivery = async (req, res) => {

  const SECRET = process.env.JWT_SECRET || "freshbazaar";

  const { email, password } = req.body;
  try {
    // Find Delivery by email
    const delivery = await Delivery.findOne({ email });
    if (!delivery) {
      return res.status(400).json({ message: 'Delivery not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, delivery.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: delivery._id, email: delivery.email },
      SECRET    
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      delivery: {
        id: delivery._id,
        username: delivery.username,
        email: delivery.email,
        phone: delivery.phone,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {registerDelivery, loginDelivery};
