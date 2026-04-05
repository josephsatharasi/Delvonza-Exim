const express = require('express');
const { register, login, me, forgotPassword, resetPassword } = require('../controllers/adminAuthController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', adminAuth, me);

module.exports = router;
