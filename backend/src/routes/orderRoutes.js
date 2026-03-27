const express = require('express');
const auth = require('../middleware/auth');
const {
  placeOrder,
  createCheckoutSession,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

router.get('/admin/all', getAllOrders);
router.put('/admin/:orderId/status', updateOrderStatus);
router.delete('/admin/:orderId', deleteOrder);

router.use(auth);
router.post('/checkout', createCheckoutSession);
router.post('/', placeOrder);
router.get('/', getOrders);

module.exports = router;
