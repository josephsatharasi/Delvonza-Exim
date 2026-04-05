const jwt = require('jsonwebtoken');

const getSecret = () => process.env.ADMIN_JWT_SECRET || process.env.JWT_ACCESS_SECRET;

const signAdminAccessToken = (adminId) => {
  const secret = getSecret();
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET (or JWT_ACCESS_SECRET) must be set.');
  }
  return jwt.sign({ adminId: String(adminId), typ: 'admin' }, secret, {
    expiresIn: process.env.ADMIN_TOKEN_EXPIRES || '12h'
  });
};

const verifyAdminAccessToken = (token) => {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.typ !== 'admin' || !decoded.adminId) return null;
    return decoded;
  } catch {
    return null;
  }
};

module.exports = { signAdminAccessToken, verifyAdminAccessToken };
