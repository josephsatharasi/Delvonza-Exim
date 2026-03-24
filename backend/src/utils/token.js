const jwt = require('jsonwebtoken');

const signAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m'
  });

const signRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d'
  });

module.exports = { signAccessToken, signRefreshToken };
