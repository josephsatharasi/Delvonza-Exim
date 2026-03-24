const express = require('express');
const auth = require('../middleware/auth');
const { createStripeCheckout, verifyStripeSession } = require('../controllers/paymentController');

const router = express.Router();

router.use(auth);
router.post('/stripe/create', createStripeCheckout);
router.post('/stripe/verify', verifyStripeSession);

module.exports = router;
