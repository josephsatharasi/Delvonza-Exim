const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  placeOrder,
  createCheckoutSession,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

router.get('/admin/all', adminAuth, getAllOrders);
router.put('/admin/:orderId/status', adminAuth, updateOrderStatus);
router.delete('/admin/:orderId', adminAuth, deleteOrder);

router.use(auth);
router.post('/checkout', createCheckoutSession);
router.post('/', placeOrder);
router.get('/', getOrders);

module.exports = router;
