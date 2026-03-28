const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/token');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address
});

const register = async (req, res) => {
  try {
    const { name, email, password, phone = '', address = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (!String(phone).trim()) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }
    if (!String(address).trim()) {
      return res.status(400).json({ message: 'Address is required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      address: address.trim()
    });

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    user.refreshTokens.push(refreshToken);
    await user.save();

    return res.status(201).json({
      message: 'Registered successfully.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    user.refreshTokens.push(refreshToken);
    await user.save();

    return res.json({
      message: 'Login successful.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login.' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ message: 'Refresh token is not valid.' });
    }

    const accessToken = signAccessToken(user._id.toString());
    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to refresh token.' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(200).json({ message: 'Logged out.' });
    }
    const decoded = jwt.decode(token);
    if (!decoded?.userId) {
      return res.status(200).json({ message: 'Logged out.' });
    }
    await User.findByIdAndUpdate(decoded.userId, { $pull: { refreshTokens: token } });
    return res.status(200).json({ message: 'Logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout.' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone = '', address = '' } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    user.name = name.trim();
    user.phone = phone.trim();
    user.address = address.trim();
    await user.save();
    return res.json({ message: 'Profile updated.', user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

module.exports = { register, login, refreshToken, logout, me, updateProfile };
