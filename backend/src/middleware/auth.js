const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Access token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token.' });
  }
};

module.exports = auth;
