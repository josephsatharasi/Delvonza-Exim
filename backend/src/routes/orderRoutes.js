const express = require('express');
const auth = require('../middleware/auth');
const {
  placeOrder,
  createCheckoutSession,
  getOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

router.get('/admin/all', getAllOrders);
router.put('/admin/:orderId/status', updateOrderStatus);

router.use(auth);
router.post('/checkout', createCheckoutSession);
router.post('/', placeOrder);
router.get('/', getOrders);

module.exports = router;
