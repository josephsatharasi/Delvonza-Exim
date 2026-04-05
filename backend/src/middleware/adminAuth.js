const { verifyAdminAccessToken } = require('../utils/adminToken');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const decoded = verifyAdminAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired session. Please sign in again.' });
  }
  req.adminId = decoded.adminId;
  return next();
};

module.exports = adminAuth;
