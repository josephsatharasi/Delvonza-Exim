const express = require('express');
const auth = require('../middleware/auth');
const {
  register,
  login,
  refreshToken,
  logout,
  me,
  updateProfile
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);

module.exports = router;
