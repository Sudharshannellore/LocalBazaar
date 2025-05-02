const jwt = require('jsonwebtoken');

const VerifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach vendor id to request
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = VerifyUserToken;
