const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if(!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
